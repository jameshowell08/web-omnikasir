'use client';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { AddEditSalesItemFormScheme, AddEditSalesItemFormSchemeType } from "../model/AddEditSalesItemFormScheme";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import AddEditSalesController from "../controller/AddEditSalesController";
import toast from "react-hot-toast";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import { Button } from "@/components/ui/button";

function AddSalesItemForm({ formId, onAddItem }: { formId: string, onAddItem: (item: AddEditSalesItemFormSchemeType) => void }) {
    const [debouncedSku, setDebouncedSku] = useState("");
    const [isSkuValid, setIsSkuValid] = useState(false);
    const [isSkuFieldLoading, setIsSkuFieldLoading] = useState(false);
    const skuDebounce = useRef<NodeJS.Timeout | null>(null);

    const form = useForm({
        resolver: zodResolver(AddEditSalesItemFormScheme),
        defaultValues: {
            sku: "",
            productName: "",
            brand: "",
            quantity: "",
            price: "",
            isNeedImei: false,
            imeis: [],
            subtotal: ""
        }
    })

    const fetchProductData = async (sku: string) => {
        const [isSuccess, productData, errorMessage] = await AddEditSalesController.getProduct(sku);

        if (isSuccess) {
            setIsSkuValid(true);
            form.setValue("productName", productData?.name ?? "");
            form.setValue("brand", productData?.brand ?? "");
            form.setValue("price", productData?.price ?? "");
            form.setValue("isNeedImei", productData?.isNeedImei ?? false);
        } else {
            toast.error(errorMessage);
        }
        setIsSkuFieldLoading(false);
    }

    const handleSubmit = (data: AddEditSalesItemFormSchemeType) => {
        console.log(data);
        if (!isSkuValid) {
            toast.error("SKU tidak valid");
        } else {
            onAddItem({ ...data, subtotal: AddEditSalesController.calculateSubtotalToString(data) });
        }
    }

    useEffect(() => {
        if (skuDebounce.current) {
            clearTimeout(skuDebounce.current);
        }

        if (debouncedSku.length > 0) {
            setIsSkuFieldLoading(true);
            setIsSkuValid(false);

            skuDebounce.current = setTimeout(() => {
                fetchProductData(debouncedSku);
            }, 500);
        }
    }, [debouncedSku])

    return (
        <form id={formId} onSubmit={(e) => {
            e.stopPropagation();
            form.handleSubmit(handleSubmit)(e);
        }}>
            <FieldGroup>
                <Controller
                    name="sku"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="gap-2">
                            <FieldLabel className="font-bold gap-0">SKU<span className="text-red-500">*</span></FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    value={field.value}
                                    onChange={(e) => {
                                        setDebouncedSku(e.target.value);
                                        field.onChange(e.target.value);
                                    }}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Masukkan SKU"
                                />

                                {
                                    isSkuFieldLoading && (
                                        <InputGroupAddon align="inline-end">
                                            <Spinner />
                                        </InputGroupAddon>
                                    )
                                }
                            </InputGroup>
                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />

                <div className="flex flex-row gap-4">
                    <Controller
                        name="productName"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="gap-2">
                                <FieldLabel className="font-bold gap-0">Nama Produk</FieldLabel>
                                <Input
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Nama Produk"
                                    disabled
                                />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />

                    <Controller
                        name="brand"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="gap-2">
                                <FieldLabel className="font-bold gap-0">Merek</FieldLabel>
                                <Input
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Merek"
                                    disabled
                                />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />
                </div>

                <div className="flex flex-row gap-4">
                    <Controller
                        name="price"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="gap-2">
                                <FieldLabel className="font-bold gap-0">Harga<span className="text-red-500">*</span></FieldLabel>
                                <InputGroup>
                                    <InputGroupAddon>
                                        <InputGroupText className="font-bold">Rp</InputGroupText>
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        value={field.value}
                                        onChange={(e) => {
                                            if (e.target.value === "") {
                                                field.onChange("")
                                            } else {
                                                const value = BaseUtil.unformatNumberV2(e.target.value)
                                                if (isNaN(value)) {
                                                    field.onChange("")
                                                } else if (e.target.value.match(/^[0-9.,]+$/)) {
                                                    field.onChange(BaseUtil.formatNumberV2(value))
                                                }
                                            }
                                        }}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Masukkan Harga"
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
                            <Field data-invalid={fieldState.invalid} className="gap-2">
                                <FieldLabel className="font-bold gap-0">Jumlah<span className="text-red-500">*</span></FieldLabel>
                                <Input
                                    value={field.value}
                                    onChange={(e) => {
                                        if (e.target.value === "") {
                                            field.onChange("")
                                        } else {
                                            const value = BaseUtil.unformatNumberV2(e.target.value)
                                            if (isNaN(value)) {
                                                field.onChange("")
                                            } else if (e.target.value.match(/^[0-9.,]+$/)) {
                                                field.onChange(BaseUtil.formatNumberV2(value))
                                            }
                                        }
                                    }}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Masukkan Jumlah"
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

function AddSalesItemDialogContent({ onAddItem }: { onAddItem: (item: AddEditSalesItemFormSchemeType) => void }) {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Tambah Item Penjualan</DialogTitle>
                <DialogDescription>Isi form berikut untuk menambahkan item penjualan.</DialogDescription>
            </DialogHeader>

            <AddSalesItemForm formId="add-sales-item-form" onAddItem={onAddItem} />

            <DialogFooter>
                <Button form="add-sales-item-form">Tambah Item</Button>
            </DialogFooter>
        </DialogContent>
    )
}

export default AddSalesItemDialogContent;