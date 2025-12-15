import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconSearch } from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { AddPurchaseItemFormScheme } from "../model/AddPurchaseItemFormScheme";
import { useRef, useState } from "react";
import AddPurchaseController from "../controller/AddPurchaseController";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";

function AddPurchaseItemDialogForm({ id }: { id: string }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isSkuValid, setIsSkuValid] = useState(false)
    const debounceSku = useRef<NodeJS.Timeout | null>(null)

    const form = useForm<z.infer<typeof AddPurchaseItemFormScheme>>({
        resolver: zodResolver(AddPurchaseItemFormScheme),
        defaultValues: {
            sku: "",
            productName: "",
            productCategory: "",
            productBrand: "",
            quantity: "",
            price: "",
        }
    })

    const handleSkuChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsSkuValid(false)
        setIsLoading(true)
        if (debounceSku.current) {
            clearTimeout(debounceSku.current)
        }
        debounceSku.current = setTimeout(() => {
            fetchPurchaseItemDetailBySku(e.target.value)
        }, 500)
    }

    const fetchPurchaseItemDetailBySku = async (sku: string) => {
        const [isSuccess, purchaseItemData, errorMessage] = await AddPurchaseController.getPurchaseItemBySku(sku)

        if (isSuccess) {
            const buyPrice = purchaseItemData?.buyPrice
            form.setValue("productName", purchaseItemData?.productName ?? "")
            form.setValue("productCategory", purchaseItemData?.productCategory ?? "")
            form.setValue("productBrand", purchaseItemData?.productBrand ?? "")
            form.setValue("price", buyPrice || buyPrice === 0 ? BaseUtil.formatNumberV2(buyPrice) : "")
            setIsSkuValid(true)
        } else {
            toast.error(errorMessage)
            setIsSkuValid(false)
        }

        setIsLoading(false)
    }

    const handleSubmit = (data: z.infer<typeof AddPurchaseItemFormScheme>) => {
        if (!isSkuValid) {
            toast.error("SKU tidak valid")
        }

        console.log(data)
    }

    return (
        <form id={id} onSubmit={form.handleSubmit((data) => { handleSubmit(data) })}>
            <FieldGroup>
                <Controller
                    name="sku"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="font-bold gap-0">SKU<span className="text-red-500">*</span></FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    placeholder="Masukkan SKU"
                                    value={field.value}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        handleSkuChanged(e)
                                    }}
                                    aria-invalid={fieldState.invalid}
                                />
                                {
                                    isLoading &&
                                    <InputGroupAddon align="inline-end">
                                        <Spinner />
                                    </InputGroupAddon>
                                }
                            </InputGroup>
                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />

                <Controller
                    name="productName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="font-bold">Nama Produk</FieldLabel>
                            <Input
                                placeholder="Masukkan nama produk"
                                {...field}
                                disabled
                            />
                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />

                <div className="flex flex-row gap-2">
                    <Controller
                        name="productBrand"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="font-bold">Merek</FieldLabel>
                                <Input
                                    placeholder="Masukkan merek"
                                    {...field}
                                    disabled
                                />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />

                    <Controller
                        name="productCategory"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="font-bold">Kategori</FieldLabel>
                                <Input
                                    placeholder="Masukkan kategori"
                                    {...field}
                                    disabled
                                />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />
                </div>

                <div className="flex flex-row gap-2">
                    <Controller
                        name="price"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="font-bold gap-0">Harga<span className="text-red-500">*</span></FieldLabel>
                                <InputGroup>
                                    <InputGroupAddon>
                                        <InputGroupText className="font-bold">
                                            Rp
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        placeholder="Masukkan harga"
                                        value={field.value}
                                        onChange={(e) => {
                                            const value = BaseUtil.unformatNumberV2(e.target.value)
                                            if (e.target.value === "") {
                                                field.onChange(e.target.value)
                                            } else if (!isNaN(value)) {
                                                field.onChange(BaseUtil.formatNumberV2(value))
                                            }
                                        }}
                                        aria-invalid={fieldState.invalid}
                                    />
                                </InputGroup>
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />

                    <Controller
                        name="quantity"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="font-bold gap-0">Jumlah<span className="text-red-500">*</span></FieldLabel>
                                <Input
                                    placeholder="Masukkan jumlah"
                                    value={field.value}
                                    onChange={(e) => {
                                        const value = BaseUtil.unformatNumberV2(e.target.value)
                                        if (e.target.value === "") {
                                            field.onChange(e.target.value)
                                        } else if (!isNaN(value)) {
                                            field.onChange(BaseUtil.formatNumberV2(value))
                                        }
                                    }}
                                    aria-invalid={fieldState.invalid}
                                />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />
                </div>
            </FieldGroup>
        </form>
    )
}

export default AddPurchaseItemDialogForm;