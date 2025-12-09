'use client';

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowBackUp } from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";
import AddEditProductCategoryFormScheme from "../model/AddEditProductCategoryFormScheme";
import z from "zod";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AddEditProductCategoryController from "../controller/AddEditProductCategoryController";
import { AddEditProductCategoryCallback, NavigateTo, ShowErrorToast } from "../model/AddEditProductCategoryCallback";
import toast from "react-hot-toast";

function BackButton() {
    const router = useRouter();

    return (
        <div className="p-2 cursor-pointer hover:bg-accent w-fit rounded-lg">
            <IconArrowBackUp size={20} onClick={() => router.back()} />
        </div>
    )
}

function AddEditProductCategoryHeader() {
    return (
        <header className="flex items-center gap-3">
            <BackButton />
            <h1 className="text-xl font-bold">Tambah Kategori</h1>
        </header>
    )
}

function AddEditProductCategoryForm(props: { onSubmit: (data: z.infer<typeof AddEditProductCategoryFormScheme>) => void }) {

    const form = useForm({
        resolver: zodResolver(AddEditProductCategoryFormScheme),
        defaultValues: {
            categoryName: "",
            categoryDescription: "",
        },
    });

    return (
        <form className="p-5 flex flex-col gap-5" onSubmit={form.handleSubmit(props.onSubmit)}>
            <FieldGroup>
                <Controller
                    name="categoryName"
                    control={form.control}
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
                    control={form.control}
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
            <Button type="submit" className="self-end">Tambah Kategori</Button>
        </form>
    )
}

function AddEditProductCategoryView() {
    const router = useRouter();

    function eventCallback(e: AddEditProductCategoryCallback) {
        if (e instanceof ShowErrorToast) {
            toast.error(e.message)
        } else if (e instanceof NavigateTo) {
            router.replace(e.url)
        }
    }

    const [controller] = useState(() => new AddEditProductCategoryController(eventCallback));

    return (
        <div>
            <AddEditProductCategoryHeader />
            <AddEditProductCategoryForm onSubmit={(data) => controller.createCategory(data)} />
        </div>
    )
}

export default AddEditProductCategoryView;