'use client';
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Routes from "@/src/modules/shared/model/Routes";
import BackButton from "@/src/modules/shared/view/BackButton";
import { LoadingOverlayContext } from "@/src/modules/shared/view/LoadingOverlay";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import AddEditPaymentMethodController from "../controller/AddEditPaymentMethodController";
import AddEditPaymentMethodFormScheme from "../model/AddEditPaymentMethodFormScheme";

function AddEditPaymentMethodHeader({ isEdit }: { isEdit: boolean }) {
    return (
        <header className="flex items-center gap-3">
            <BackButton />
            <h1 className="text-xl font-bold">{isEdit ? "Ubah" : "Tambah"} Metode Pembayaran</h1>
        </header>
    )
}

function AddEditPaymentMethodForm({ isEdit, form, onSubmit }: { isEdit: boolean, form: UseFormReturn<z.infer<typeof AddEditPaymentMethodFormScheme>>, onSubmit: (data: z.infer<typeof AddEditPaymentMethodFormScheme>) => void }) {
    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 m-5">
            <FieldGroup className="gap-2">
                <Controller
                    name="paymentName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel className="flex items-center font-bold gap-0">Nama<span className="text-red-500">*</span></FieldLabel>
                            <Input
                                {...field}
                                aria-invalid={fieldState.invalid}
                                placeholder="Masukkan nama metode pembayaran..."
                            />
                            {fieldState.error && (
                                <FieldError>{fieldState.error.message}</FieldError>
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>
            <Button type="submit" className="self-end">{isEdit ? "Ubah" : "Tambah"} Metode Pembayaran</Button>
        </form>
    )
}

function AddEditPaymentMethodView({ isEdit = false, id = "" }: { isEdit?: boolean, id?: string }) {
    const router = useRouter();
    const showLoadingOverlay = useContext(LoadingOverlayContext)
    const form = useForm<z.infer<typeof AddEditPaymentMethodFormScheme>>({
        resolver: zodResolver(AddEditPaymentMethodFormScheme),
        defaultValues: {
            paymentName: "",
        },
    })

    const handleSubmit = async (data: z.infer<typeof AddEditPaymentMethodFormScheme>) => {
        showLoadingOverlay(true)
        const [isSuccess, errorMsg] = isEdit ? await AddEditPaymentMethodController.handleEditPaymentMethod(id, data) : await AddEditPaymentMethodController.handleAddPaymentMethod(data);
        showLoadingOverlay(false)

        if (isSuccess) {
            toast.success(`Metode pembayaran berhasil ${isEdit ? "diubah" : "ditambahkan"}`)
            router.push(Routes.PAYMENT_METHOD.GET)
        } else {
            toast.error(errorMsg)
        }
    }

    const fetchInitialData = async () => {
        const [res, paymentMethodName, errorMsg] = await AddEditPaymentMethodController.getPaymentMethodById(id)

        if (!res.ok) {
            toast.error(errorMsg)
        } else {
            form.setValue("paymentName", paymentMethodName)
        }
    }

    useEffect(() => {
        if (isEdit) {
            fetchInitialData()
        }
    }, [])

    return (
        <div>
            <AddEditPaymentMethodHeader isEdit={isEdit} />
            <AddEditPaymentMethodForm isEdit={isEdit} form={form} onSubmit={(data) => handleSubmit(data)} />
        </div>
    )
}

export default AddEditPaymentMethodView;