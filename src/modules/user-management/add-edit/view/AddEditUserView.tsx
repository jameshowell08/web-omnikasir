'use client';
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Routes from "@/src/modules/shared/model/Routes";
import HeaderWithBackButton from "@/src/modules/shared/view/HeaderWithBackButton";
import { LoadingOverlayContext } from "@/src/modules/shared/view/LoadingOverlay";
import PasswordField from "@/src/modules/shared/view/PasswordField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import AddEditUserController from "../controller/AddEditUserController";
import { AddEditUserFormSchemeDefaultValues, AddEditUserFormSchemeType, getAddEditUserFormScheme } from "../model/AddEditUserFormScheme";

function AddEditUserForm({ isEdit = false, formValue, onSubmit }: { isEdit?: boolean, formValue?: AddEditUserFormSchemeType, onSubmit: (data: AddEditUserFormSchemeType) => void }) {
    const form = useForm({
        resolver: zodResolver(getAddEditUserFormScheme(isEdit)),
        values: formValue,
        defaultValues: AddEditUserFormSchemeDefaultValues
    })

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
            <FieldGroup>
                <Controller
                    name="role"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="gap-0 font-bold">Role<span className="text-red-500">*</span></FieldLabel>
                            <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih role" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                                    <SelectItem value="CASHIER">CASHIER</SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />

                <Controller
                    name="username"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="gap-0 font-bold">Username<span className="text-red-500">*</span></FieldLabel>
                            <Input value={field.value} onChange={field.onChange} aria-invalid={fieldState.invalid} placeholder="Masukkan username..." />
                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />

                <div className="flex flex-row gap-4">
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="gap-0 font-bold">Password{!isEdit && <span className="text-red-500">*</span>}</FieldLabel>
                                <PasswordField value={field.value} onChange={field.onChange} aria-invalid={fieldState.invalid} placeholder="Masukkan password..." />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />

                    <Controller
                        name="confirmPassword"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="gap-0 font-bold">Konfirmasi Password{!isEdit && <span className="text-red-500">*</span>}</FieldLabel>
                                <PasswordField value={field.value} onChange={field.onChange} aria-invalid={fieldState.invalid} placeholder="Masukkan password lagi..." />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />
                </div>

                <Button type="submit" className="self-end">{isEdit ? "Ubah" : "Tambah"} Pengguna</Button>
            </FieldGroup>
        </form>
    )
}

function AddEditUserView({ isEdit = false, id }: { isEdit?: boolean, id?: string }) {
    const router = useRouter()
    const showLoadingOverlay = useContext(LoadingOverlayContext)
    const [formValue, setFormValue] = useState<AddEditUserFormSchemeType | undefined>(undefined)

    const handleSubmit = async (data: AddEditUserFormSchemeType) => {
        const [success, errorMessage] = await AddEditUserController.postSubmit(isEdit, id ?? "", data)

        if (success) {
            toast.success("Pengguna berhasil ditambahkan")
            router.push(Routes.USER_MANAGEMENT.GET)
        } else {
            toast.error(errorMessage)
        }
    }

    const fetchUser = async () => {
        showLoadingOverlay(true)
        const [success, data, errorMessage] = await AddEditUserController.getUser(id ?? "")

        if (success) {
            setFormValue(data)
        } else {
            toast.error(errorMessage)
        }
        showLoadingOverlay(false)
    }

    useEffect(() => {
        if (isEdit) {
            fetchUser()
        }
    }, [isEdit])

    return (
        <div>
            <HeaderWithBackButton title={`${isEdit ? "Ubah" : "Tambah"} Pengguna ${isEdit ? id : ""}`} />
            <div className="mx-3">
                <AddEditUserForm isEdit={isEdit} formValue={formValue} onSubmit={handleSubmit} />
            </div>
        </div>
    )
}

export default AddEditUserView;