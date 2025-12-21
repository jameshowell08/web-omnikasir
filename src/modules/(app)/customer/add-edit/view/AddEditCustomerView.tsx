'use client';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import BackButton from "@/src/modules/shared/view/BackButton";
import { Controller, useForm } from "react-hook-form";
import { AddEditCustomerFormScheme } from "../model/AddEditCustomerFormScheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import z from "zod";
import { Textarea } from "@/components/ui/textarea";
import AddEditCustomerController from "../controller/AddEditCustomerController";
import toast from "react-hot-toast";
import { useContext } from "react";
import { LoadingOverlayContext } from "@/src/modules/shared/view/LoadingOverlay";
import { useRouter } from "next/navigation";
import Routes from "@/src/modules/shared/model/Routes";

function AddEditCustomerHeader({ isEdit }: { isEdit: boolean }) {
    return (
        <header className="flex flex-row items-center gap-2">
            <BackButton />
            <h1 className="text-xl font-bold">{isEdit ? "Ubah" : "Tambah"} Pelanggan</h1>
        </header>
    )
}

function AddEditCustomerForm({ isEdit }: { isEdit: boolean }) {
    const router = useRouter();
    const showLoadingOverlay = useContext(LoadingOverlayContext);
    const form = useForm({
        resolver: zodResolver(AddEditCustomerFormScheme),
        defaultValues: {
            customerId: "(Dibuat otomatis)",
            customerName: "",
            email: "",
            phoneNumber: "",
            address: ""
        }
    });

    const handleSubmit = async (data: z.infer<typeof AddEditCustomerFormScheme>) => {
        showLoadingOverlay(true)

        const [isSuccess, errorMessage] = await AddEditCustomerController.addCustomer(data)

        if (isSuccess) {
            toast.success("Pelanggan berhasil ditambahkan")
            router.push(Routes.CUSTOMER.DEFAULT)
        } else {
            toast.error(errorMessage)
        }

        showLoadingOverlay(false)
    }

    return (
        <form className="mx-2 mt-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <FieldGroup>
                <Controller
                    name="customerId"
                    control={form.control}
                    render={({ field }) => (
                        <Field>
                            <FieldLabel htmlFor="customerId" className="gap-0 font-bold">ID Pelanggan</FieldLabel>
                            <Input {...field} placeholder="ID Pelanggan..." disabled />
                        </Field>
                    )}
                />

                <Controller
                    name="customerName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="customerName" className="gap-0 font-bold">Nama Pelanggan<span className="text-red-500">*</span></FieldLabel>
                            <Input {...field} placeholder="Nama Pelanggan..." aria-invalid={fieldState.invalid} />
                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />

                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="email" className="gap-0 font-bold">Email</FieldLabel>
                            <Input {...field} placeholder="Email..." aria-invalid={fieldState.invalid} type="email" />
                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />

                <Controller
                    name="phoneNumber"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="phoneNumber" className="gap-0 font-bold">Nomor Telepon</FieldLabel>
                            <FieldDescription>Nomor telepon dimulai setelah angka '0', contoh: 08123456789 akan ditulis +62 8123456789</FieldDescription>
                            <InputGroup>
                                <InputGroupAddon>
                                    <span className="font-bold">+62</span>
                                </InputGroupAddon>
                                <InputGroupInput value={field.value} onChange={(e) => {
                                    field.onChange(e.target.value.replace(/[^0-9]/g, ""))
                                }} placeholder="Nomor Telepon..." aria-invalid={fieldState.invalid} />
                            </InputGroup>
                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />

                <Controller
                    name="address"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="address" className="gap-0 font-bold">Alamat</FieldLabel>
                            <Textarea {...field} placeholder="Alamat..." aria-invalid={fieldState.invalid} />
                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />

                <Button type="submit" className="self-end">{isEdit ? "Ubah" : "Tambah"} Pelanggan</Button>
            </FieldGroup>
        </form>
    )
}

function AddEditCustomerView({ id, isEdit = false }: { id?: string, isEdit?: boolean }) {
    return (
        <div className="flex flex-col gap-2">
            <AddEditCustomerHeader isEdit={isEdit} />
            <AddEditCustomerForm isEdit={isEdit} />
        </div>
    )
}

export default AddEditCustomerView;