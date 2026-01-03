import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddEditItemFormScheme, AddEditItemFormSchemeDefaultValues, AddEditItemFormSchemeType } from "../model/AddEditItemFormScheme";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { BaseUtil } from "../../../util/BaseUtil";
import { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import AddEditItemDialogController from "../controller/AddEditItemDialogController";

function AddEditItemForm({ formId, sku, onSubmit }: { formId: string, sku: string, onSubmit: (data: AddEditItemFormSchemeType) => void }) {
    const form = useForm({
        resolver: zodResolver(AddEditItemFormScheme),
        defaultValues: AddEditItemFormSchemeDefaultValues
    })

    const fetchProductBySku = useCallback(async () => {
        const payload = await AddEditItemDialogController.getProductById(sku)

        if (payload.isSuccess) {
            form.reset(payload.data)
        } else {
            toast.error(payload.message)
        }
    }, [sku, form])

    useEffect(() => {
        fetchProductBySku()
    }, [fetchProductBySku])

    return (
        <form
            id={formId}
            onSubmit={(e) => {
                e.stopPropagation()
                form.handleSubmit(onSubmit)(e)
            }}
        >
            <FieldGroup>
                <Controller
                    name="sku"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="font-bold gap-0">SKU</FieldLabel>
                            <Input placeholder="Masukkan SKU" {...field} disabled />
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

export default AddEditItemForm;