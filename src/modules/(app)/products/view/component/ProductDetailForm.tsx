'use client';
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowBackUp, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const formScheme = z.object({
    name: z.string().min(1, "Nama produk tidak boleh kosong"),
    price: z.coerce.number<string>().min(1, "Harga produk tidak boleh kosong"),
    stock: z.coerce.number<string>().min(1, "Stok produk tidak boleh kosong"),
    description: z.string().min(1, "Deskripsi produk tidak boleh kosong"),
})

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
            name: "",
            price: "",
            stock: "",
            description: "",
        }
    })

    function onSubmit(data: z.infer<typeof formScheme>) {
        console.log(data)
    }

    return (
        <div className="flex flex-col items-center">
            <div className="w-full flex items-center">
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

            <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="w-full px-14">
                <FieldGroup>
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="gap-2">
                                <FieldLabel>Nama</FieldLabel>
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
                    <Controller
                        name="price"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="gap-2">
                                <FieldLabel>Harga</FieldLabel>
                                <Input
                                    {...field}
                                    id="product-form-price"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Ketik disini..."
                                    autoComplete="off"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Button type="submit">Simpan</Button>
                </FieldGroup>
            </form>
        </div>
    )
}

export default ProductDetailForm;