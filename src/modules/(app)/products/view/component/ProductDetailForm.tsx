'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowBackUp, IconTrash, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

const IMEI = z.object({
    imei: z.string()
})

const formScheme = z.object({
    sku: z.string().min(1, "SKU tidak boleh kosong."),
    name: z.string().min(1, "Nama produk tidak boleh kosong."),
    brand: z.string().min(1, "Merek produk tidak boleh kosong."),
    category: z.string().min(1, "Kategori produk tidak boleh kosong."),
    sellPrice: z.string()
        .transform((val) => Number(val.replace(/\./g, "")))
        .pipe(z.number().min(1, "Harga jual tidak boleh kosong.")),
    buyPrice: z.string()
        .transform((val) => Number(val.replace(/\./g, ""))),
    stock: z.string()
        .transform((val) => Number(val.replace(/\./g, ""))),
    needImei: z.boolean(),
    imeis: z.array(IMEI),
})

const formatNumber = (value: string | number) => {
    const stringValue = String(value);
    const numericValue = stringValue.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

function ProductDetailForm(
    {
        title,
        isEdit = false
    }: {
        title: string,
        isEdit?: boolean
    }
) {
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(formScheme),
        defaultValues: {
            sku: "",
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

    function onSubmit(data: z.infer<typeof formScheme>) {
        console.log("hi")
        console.log(data)
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-center w-full">
                <div className="p-2 w-fit rounded-lg hover:bg-black/10" onClick={() => { router.back() }}>
                    <IconArrowBackUp />
                </div>

                <h1 className="text-2xl font-bold my-6 flex-1 mx-4">{title}</h1>

                {
                    isEdit &&
                    <div className="p-2 w-fit rounded-lg hover:bg-black/10" onClick={() => { /* TODO: Delete Product */ }}>
                        <IconTrash />
                    </div>
                }
            </div>

            <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="px-14">
                <FieldGroup className="gap-6">
                    <Controller
                        name="sku"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="gap-2">
                                <FieldLabel className="gap-0 font-bold">SKU<span className="text-red-500">*</span></FieldLabel>
                                <Input
                                    {...field}
                                    id="product-form-sku"
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
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="gap-2">
                                <FieldLabel className="gap-0 font-bold">Nama<span className="text-red-500">*</span></FieldLabel>
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
                                    <FieldLabel className="gap-0 font-bold">Merek<span className="text-red-500">*</span></FieldLabel>
                                    <Select
                                        {...field}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger id="product-form-brand" aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Pilih merek" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Merek 1</SelectItem>
                                            <SelectItem value="2">Merek 2</SelectItem>
                                            <SelectItem value="3">Merek 3</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                    <FieldLabel className="gap-0 font-bold">Kategori<span className="text-red-500">*</span></FieldLabel>
                                    <Select
                                        {...field}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger id="product-form-category" aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Pilih kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Kategori 1</SelectItem>
                                            <SelectItem value="2">Kategori 2</SelectItem>
                                            <SelectItem value="3">Kategori 3</SelectItem>
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
                                    <FieldLabel className="gap-0 font-bold">Harga Jual<span className="text-red-500">*</span></FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            id="product-form-sell-price"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Ketik disini..."
                                            autoComplete="off"
                                            onBlur={() => {
                                                const formatted = formatNumber(field.value);
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
                                    <FieldLabel className="gap-0 font-bold">Harga Beli</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            id="product-form-buy-price"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Ketik disini..."
                                            autoComplete="off"
                                            onBlur={() => {
                                                const formatted = formatNumber(field.value);
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
                                    <FieldLabel className="gap-0 font-bold">Stok<span className="text-red-500">*</span></FieldLabel>
                                    <Input
                                        {...field}
                                        id="product-form-stock"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Ketik disini..."
                                        autoComplete="off"
                                        onBlur={() => {
                                            const formatted = formatNumber(field.value);
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
                        <Field>
                            <FieldLabel className="font-bold">IMEI</FieldLabel>
                            <div className="flex flex-row gap-2">
                                <div className="flex flex-col w-full">
                                    <Input
                                        id="product-form-imeis"
                                        placeholder="Ketik disini..."
                                        autoComplete="off"
                                        value={imeiField}
                                        onChange={(e) => setImeiField(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                append({ imei: imeiField })
                                                setImeiField("")
                                            }
                                        }}
                                    />
                                    <p className="text-xs text-end mt-2">{form.getValues("imeis").length}/{stockAmount == "" ? 0 : stockAmount}</p>
                                </div>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        append({ imei: imeiField })
                                        setImeiField("")
                                    }}
                                >Tambah</Button>
                            </div>
                            {form.formState.errors.imeis && (
                                <FieldError errors={[form.formState.errors.imeis]} />
                            )}
                            {
                                <div className="flex flex-row flex-wrap gap-2">
                                    {
                                        fields.map((field, index) => (
                                            <Badge key={field.id} variant="outline" className="flex items-center gap-2">
                                                {field.imei}
                                                <IconX
                                                    onClick={() => remove(index)}
                                                    className="cursor-pointer !pointer-events-auto"
                                                />
                                            </Badge>
                                        ))
                                    }
                                </div>
                            }
                        </Field>
                    }
                    <Button type="submit" className="w-fit self-end">Simpan</Button>
                </FieldGroup>
            </form>
        </div>
    )
}

export default ProductDetailForm;