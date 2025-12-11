'use client';
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import BackButton from "@/src/modules/shared/view/BackButton";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import AddEditPaymentMethodFormScheme from "../model/AddEditPaymentMethodFormScheme";
import { Input } from "@/components/ui/input";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import AddEditPaymentMethodController from "../controller/AddEditPaymentMethodController";
import { useContext } from "react";
import { LoadingOverlayContext } from "@/src/modules/shared/view/LoadingOverlay";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Routes from "@/src/modules/shared/model/Routes";

function AddEditPaymentMethodHeader() {
    return (
        <header className="flex items-center gap-3">
            <BackButton />
            <h1 className="text-xl font-bold">Tambah Metode Pembayaran</h1>
        </header>
    )
}

function AddEditPaymentMethodForm({form, onSubmit}: {form: UseFormReturn<z.infer<typeof AddEditPaymentMethodFormScheme>>, onSubmit: (data: z.infer<typeof AddEditPaymentMethodFormScheme>) => void}) {
    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 m-5">
            <FieldGroup>
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
            <Button type="submit" className="self-end">Tambah Metode Pembayaran</Button>
        </form>
    )
}

function AddEditPaymentMethodView() {
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
        const [isSuccess, errorMsg] = await AddEditPaymentMethodController.handleSubmitForm(data)
        showLoadingOverlay(false)
        
        if (isSuccess) {
            toast.success("Metode pembayaran berhasil ditambahkan")
            router.push(Routes.PAYMENT_METHOD.GET)
        } else {
            toast.error(errorMsg)
        }
    }

    return (
        <div>
            <AddEditPaymentMethodHeader />
            <AddEditPaymentMethodForm form={form} onSubmit={(data) => handleSubmit(data)} />
        </div>
    )
}

export default AddEditPaymentMethodView;