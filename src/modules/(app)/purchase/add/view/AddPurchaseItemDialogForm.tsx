import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconSearch } from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { AddPurchaseItemFormScheme } from "../model/AddPurchaseItemFormScheme";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";

function AddPurchaseItemDialogForm({ id }: { id: string }) {
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

    return (
        <form id={id} onSubmit={form.handleSubmit((data) => { console.log(data) })}>
            <FieldGroup>
                <Controller
                    name="sku"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="font-bold gap-0">SKU<span className="text-red-500">*</span></FieldLabel>
                            <div className="flex flex-row gap-2">
                                <Input
                                    placeholder="Masukkan SKU"
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                />
                                <Button
                                    type="button"
                                    size="icon"
                                    onClick={() => {
                                        form.setValue("productName", "Produk dengan sku " + field.value)
                                        form.setValue("productCategory", "Kategori " + field.value)
                                        form.setValue("productBrand", "Merek " + field.value)
                                    }}
                                >
                                    <IconSearch />
                                </Button>
                            </div>
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