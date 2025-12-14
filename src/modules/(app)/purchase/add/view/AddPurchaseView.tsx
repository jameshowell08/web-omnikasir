'use client';
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BackButton from "@/src/modules/shared/view/BackButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus } from "@tabler/icons-react";
import { Control, Controller, useForm } from "react-hook-form";
import z from "zod";
import { AddPurchaseHeaderFormScheme } from "../model/AddPurchaseHeaderFormScheme";

function AddPurchaseHeader() {
    return (
        <div className="flex flex-row items-center gap-2">
            <BackButton />
            <h1 className="text-2xl font-bold">Tambah Pembelian</h1>
        </div>
    )
}

function PurchaseDetail({ control }: { control: Control<z.infer<typeof AddPurchaseHeaderFormScheme>> }) {
    return (
        <div className="flex flex-col">
            <form className="flex flex-row mt-5 gap-5 items-center">
                <Field className="w-40 gap-2">
                    <FieldLabel className="font-bold text-sm gap-0">ID Pembelian</FieldLabel>
                    <Input
                        value={"(Dibuat otomatis)"}
                        readOnly
                    />
                </Field>
                <Field className="w-40 gap-2">
                    <FieldLabel className="font-bold text-sm gap-0">Tanggal dibuat</FieldLabel>
                    <Input
                        value={"(Dibuat otomatis)"}
                        readOnly
                    />
                </Field>
                <Controller
                    name="status"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="w-40 gap-2">
                            <FieldLabel className="font-bold text-sm gap-0">Status<span className="text-red-500">*</span></FieldLabel>
                            <Select
                                {...field}
                                aria-invalid={fieldState.invalid}
                                onValueChange={(value) => field.onChange(value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    )}
                />
                <Controller
                    name="supplierName"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="w-70 gap-2">
                            <FieldLabel className="font-bold text-sm gap-0">Supplier<span className="text-red-500">*</span></FieldLabel>
                            <Input
                                {...field}
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter supplier name"
                            />
                        </Field>
                    )}
                />
            </form>
        </div>
    )
}

function AddPurchaseDetailItemHeader({ isButtonDisabled }: { isButtonDisabled: boolean }) {
    return (
        <div className="mt-3 flex flex-row justify-between items-center">
            <h1 className="text-lg font-bold">Item Pembelian</h1>
            <Button
                disabled={isButtonDisabled}
            >
                <IconPlus />
                Tambah Item
            </Button>
        </div>
    )
}

function AddPurchaseView() {
    const form = useForm<z.infer<typeof AddPurchaseHeaderFormScheme>>({
        resolver: zodResolver(AddPurchaseHeaderFormScheme),
        defaultValues: {
            status: "DRAFT",
            supplierName: "",
        },
        mode: "all"
    })

    return (
        <div>
            <AddPurchaseHeader />
            <div className="mx-3">
                <PurchaseDetail control={form.control} />
                <AddPurchaseDetailItemHeader isButtonDisabled={!form.formState.isValid} />
            </div>
        </div>
    )
}

export default AddPurchaseView;