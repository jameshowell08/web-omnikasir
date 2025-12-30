'use client';

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import BackButton from "@/src/modules/shared/view/BackButton";
import { LoadingOverlayContext } from "@/src/modules/shared/view/LoadingOverlay";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import AddEditProductCategoryController from "../controller/AddEditProductCategoryController";
import { AddEditProductCategoryCallback, NavigateTo, ShowErrorToast, ShowHideLoadingOverlay, UpdateCategoryData } from "../model/AddEditProductCategoryCallback";
import AddEditProductCategoryFormScheme from "../model/AddEditProductCategoryFormScheme";

function AddEditProductCategoryHeader({isEdit}: {isEdit: boolean}) {
    return (
        <header className="flex items-center gap-3">
            <BackButton />
            <h1 className="text-xl font-bold">{isEdit ? "Ubah" : "Tambah"} Kategori</h1>
        </header>
    )
}

function AddEditProductCategoryForm(props: { isEdit: boolean,  form: UseFormReturn<z.infer<typeof AddEditProductCategoryFormScheme>>, onSubmit: (data: z.infer<typeof AddEditProductCategoryFormScheme>) => void }) {

    return (
        <form className="p-5 flex flex-col gap-5" onSubmit={props.form.handleSubmit(props.onSubmit)}>
            <FieldGroup>
                <Controller
                    name="categoryName"
                    control={props.form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel className="flex items-center font-bold gap-0">Nama Kategori<span className="text-red-500">*</span></FieldLabel>
                            <Input
                                {...field}
                                aria-invalid={fieldState.invalid}
                                placeholder="Masukkan nama kategori..."
                            />
                            {fieldState.error && (
                                <FieldError>{fieldState.error.message}</FieldError>
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="categoryDescription"
                    control={props.form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel className="flex items-center font-bold gap-0">Deskripsi</FieldLabel>
                            <Textarea
                                {...field}
                                aria-invalid={fieldState.invalid}
                                className="min-h-30"
                                placeholder="Masukkan deskripsi..."
                            />
                            {fieldState.error && (
                                <FieldError>{fieldState.error.message}</FieldError>
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>
            <Button type="submit" className="self-end">{props.isEdit ? "Ubah" : "Tambah"} Kategori</Button>
        </form>
    )
}

function AddEditProductCategoryView({ isEdit, sku = "" }: { isEdit: boolean, sku?: string }) {
    const router = useRouter();
    const showLoadingOverlay = useContext(LoadingOverlayContext)

    function eventCallback(e: AddEditProductCategoryCallback) {
        if (e instanceof ShowErrorToast) {
            toast.error(e.message)
        } else if (e instanceof NavigateTo) {
            router.replace(e.url)
        } else if (e instanceof UpdateCategoryData) {
            form.setValue("categoryName", e.categoryName)
            form.setValue("categoryDescription", e.categoryDescription)
        } else if (e instanceof ShowHideLoadingOverlay) {
            showLoadingOverlay(e.show)
        }
    }

    const [controller] = useState(() => new AddEditProductCategoryController(eventCallback));
    const form = useForm({
        resolver: zodResolver(AddEditProductCategoryFormScheme),
        defaultValues: {
            categoryName: "",
            categoryDescription: "",
        },
    });

    useEffect(() => {
        if (isEdit) {
            controller.getCategoryData(sku)
        }
    }, [controller, isEdit, sku])

    return (
        <div>
            <AddEditProductCategoryHeader isEdit={isEdit} />
            <AddEditProductCategoryForm isEdit={isEdit} form={form} onSubmit={(data) => isEdit ? controller.updateCategory(data, sku) : controller.createCategory(data)} />
        </div>
    )
}

export default AddEditProductCategoryView;