'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingOverlayContext } from "@/src/modules/shared/view/LoadingOverlay";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowBackUp, IconTrash, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ProductFormController } from "../../controller/ProductFormController";
import { Category } from "../../model/Category";
import { NavigateTo, ProductFormEventCallback, ShowErrorToast, ShowHideLoadingOverlay, ShowSuccessfulToast, UpdateCategories, UpdateProductDetail } from "../../model/ProductFormEventCallback";
import { ProductFormScheme } from "../../model/ProductFormScheme";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";

function ProductDetailForm(
    {
        title,
        isEdit = false,
        sku = null
    }: {
        title: string,
        isEdit?: boolean,
        sku?: string | null
    }
) {
    const showLoadingOverlay = useContext(LoadingOverlayContext)
    const [categories, setCategories] = useState<Category[]>([])

    function onEventCallback(e: ProductFormEventCallback) {
        if (e instanceof ShowHideLoadingOverlay) {
            showLoadingOverlay(e.show)
        } else if (e instanceof UpdateCategories) {
            setCategories(e.categories)
        } else if (e instanceof ShowErrorToast) {
            toast.error(e.errorMessage)
        } else if (e instanceof NavigateTo) {
            router.push(e.path)
        } else if (e instanceof ShowSuccessfulToast) {
            toast.success(e.message)
        } else if (e instanceof UpdateProductDetail) {
            form.setValue("sku", e.sku)
            form.setValue("name", e.name)
            form.setValue("brand", e.brand)
            form.setValue("category", e.category)
            form.setValue("sellPrice", BaseUtil.formatNumber(e.sellPrice))
            form.setValue("buyPrice", BaseUtil.formatNumber(e.buyPrice))
            form.setValue("stock", BaseUtil.formatNumber(e.stock))
            form.setValue("needImei", e.needImei)
            form.setValue("imeis", e.imeis.map((imei) => ({ value: imei })))
        }
    }

    const [controller] = useState(() => new ProductFormController(onEventCallback))
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(ProductFormScheme),
        defaultValues: {
            sku: sku ?? "",
            name: "",
            brand: "",
            category: "",
            sellPrice: "",
            buyPrice: "",
            stock: "",
            needImei: false,
            imeis: [],
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "imeis",
    })

    const [imeiField, setImeiField] = useState("");
    const needImei = form.watch("needImei");
    const stockAmount = form.watch("stock");

    function addImei(imei: string) {
        const imeisInputted = fields.map((field) => field.value.toLowerCase())

        if (imeisInputted.includes(imei.toLowerCase())) {
            form.setError("imeis", {
                type: "manual",
                message: "IMEI sudah ada."
            })
            return
        }

        append({ value: imeiField })
        setImeiField("")
    }

    function removeImei(index: number) {
        remove(index)
    }

    useEffect(() => {
        controller.initializeForm(sku)
    }, [])

    return (
        <div className="flex flex-col">
            <div className="flex items-center w-full">
                <div className="p-2 w-fit rounded-lg hover:bg-black/10" onClick={() => { router.back() }}>
                    <IconArrowBackUp />
                </div>

                <h1 className="text-2xl font-bold my-6 flex-1 mx-4">{title}</h1>
            </div>

            <form id="product-form" onSubmit={form.handleSubmit((data) => controller.submitForm(isEdit, data))} className="px-14">
                <FieldGroup className="gap-6">
                    <Controller
                        name="sku"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="gap-2">
                                <FieldLabel className="gap-0 font-bold" htmlFor="product-form-sku">SKU<span className="text-red-500">*</span></FieldLabel>
                                <Input
                                    {...field}
                                    id="product-form-sku"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Ketik disini..."
                                    autoComplete="off"
                                    disabled={isEdit}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="gap-2">
                                <FieldLabel className="gap-0 font-bold" htmlFor="product-form-name">Nama<span className="text-red-500">*</span></FieldLabel>
                                <Input
                                    {...field}
                                    id="product-form-name"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Ketik disini..."
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <div className="flex flex-row gap-6">
                        <Controller
                            name="brand"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-2">
                                    <FieldLabel className="gap-0 font-bold" htmlFor="product-form-brand">Merek<span className="text-red-500">*</span></FieldLabel>
                                    <Input
                                        {...field}
                                        id="product-form-brand"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Ketik disini..."
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="category"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-2">
                                    <FieldLabel className="gap-0 font-bold" htmlFor="product-form-category">Kategori<span className="text-red-500">*</span></FieldLabel>
                                    <Select
                                        {...field}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger id="product-form-category" aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Pilih kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </div>

                    <div className="flex flex-row gap-6">
                        <Controller
                            name="sellPrice"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-2">
                                    <FieldLabel className="gap-0 font-bold" htmlFor="product-form-sell-price">Harga Jual<span className="text-red-500">*</span></FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            id="product-form-sell-price"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Ketik disini..."
                                            autoComplete="off"
                                            onFocus={(val) => {
                                                const unformatted = BaseUtil.unformatNumber(val.target.value);
                                                field.onChange(unformatted);
                                            }}
                                            onBlur={(val) => {
                                                const formatted = BaseUtil.formatNumber(val.target.value);
                                                field.onChange(formatted);
                                                field.onBlur();
                                            }}
                                        />
                                        <InputGroupAddon>
                                            <InputGroupText className="font-bold">Rp</InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="buyPrice"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-2">
                                    <FieldLabel className="gap-0 font-bold" htmlFor="product-form-buy-price">Harga Beli</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            id="product-form-buy-price"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Ketik disini..."
                                            autoComplete="off"
                                            onFocus={(val) => {
                                                field.onChange(BaseUtil.unformatNumber(val.target.value));
                                            }}
                                            onBlur={(val) => {
                                                const formatted = BaseUtil.formatNumber(val.target.value);
                                                field.onChange(formatted);
                                                field.onBlur();
                                            }}
                                        />
                                        <InputGroupAddon>
                                            <InputGroupText className="font-bold">Rp</InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </div>

                    <div className="flex flex-row gap-6">
                        <Controller
                            name="stock"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-2">
                                    <FieldLabel className="gap-0 font-bold" htmlFor="product-form-stock">Stok<span className="text-red-500">*</span></FieldLabel>
                                    <Input
                                        {...field}
                                        id="product-form-stock"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Ketik disini..."
                                        autoComplete="off"
                                        disabled={isEdit}
                                        onBlur={() => {
                                            const formatted = BaseUtil.formatNumber(field.value);
                                            field.onChange(formatted);
                                            field.onBlur();
                                        }}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <FieldGroup data-slot="checkbox-group" className="justify-center pt-6">
                            <Controller
                                name="needImei"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field orientation="horizontal" className="gap-2">
                                        <Checkbox
                                            id="product-form-need-imei"
                                            name={field.name}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={isEdit}
                                        />
                                        <FieldLabel className="gap-0">Perlu IMEI</FieldLabel>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </div>

                    {
                        needImei &&
                        <Field data-invalid={form.formState.errors.imeis?.message !== undefined} >
                            <FieldLabel className="font-bold gap-0" htmlFor="product-form-imeis">IMEI<span className="text-red-500">*</span></FieldLabel>
                            {
                                !isEdit &&
                                <div className="flex flex-row gap-2">
                                    <div className="flex flex-col w-full">
                                        <Input
                                            id="product-form-imeis"
                                            placeholder="Ketik disini..."
                                            autoComplete="off"
                                            aria-invalid={form.formState.errors.imeis?.message !== undefined}
                                            value={imeiField}
                                            onChange={(e) => {
                                                form.clearErrors("imeis")
                                                setImeiField(e.target.value)
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault()
                                                    addImei(imeiField)
                                                }
                                            }}
                                        />
                                        <div className="flex flex-row justify-between mt-2">
                                            {
                                                form.formState.errors.imeis && (
                                                    <FieldError errors={[form.formState.errors.imeis]} />
                                                )
                                            }
                                            {
                                                stockAmount !== "" &&
                                                <p className="text-xs text-end flex-1">{form.getValues("imeis").length}/{stockAmount}</p>
                                            }
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            addImei(imeiField)
                                        }}
                                    >Tambah</Button>
                                </div>
                            }
                            {
                                <div className="flex flex-row flex-wrap gap-2">
                                    {
                                        fields.map((field, index) => (
                                            <Badge key={field.id} variant="outline" className="flex items-center gap-2">
                                                {field.value}
                                                {
                                                    !isEdit && (
                                                        <IconX
                                                            onClick={() => removeImei(index)}
                                                            className="!pointer-events-auto"
                                                        />
                                                    )
                                                }
                                            </Badge>
                                        ))
                                    }
                                </div>
                            }
                        </Field>
                    }
                    <Button type="submit" className="w-fit self-end">{isEdit ? "Edit" : "Buat"} Produk</Button>
                </FieldGroup>
            </form>
        </div>
    )
}

export default ProductDetailForm;