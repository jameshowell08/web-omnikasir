'use client';

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import PurchaseFilterFormScheme from "../model/PurchaseFilterFormScheme";

function FilterDialogBody({
    appliedFilters = {
        supplier: "",
        status: "ALL",
        dateFrom: undefined,
        dateTo: undefined,
    },
    handleSubmitFilter,
    dismissDialog
}: {
    appliedFilters?: z.infer<typeof PurchaseFilterFormScheme>,
    handleSubmitFilter: (data: z.infer<typeof PurchaseFilterFormScheme>) => void,
    dismissDialog: () => void
}) {

    const form = useForm<z.infer<typeof PurchaseFilterFormScheme>>({
        resolver: zodResolver(PurchaseFilterFormScheme),
        defaultValues: appliedFilters
    })

    const handleResetForm = () => {
        form.setValue("supplier", "")
        form.setValue("status", "ALL")
        form.setValue("dateFrom", undefined)
        form.setValue("dateTo", undefined)
    }

    return (
        <section>
            <form onSubmit={form.handleSubmit(handleSubmitFilter)} onReset={handleResetForm}>
                <FieldGroup>
                    <div className="flex flex-row gap-2 items-center">
                        <Controller
                            name="supplier"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name} className="gap-0">Supplier</FieldLabel>
                                    <Input
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Ketik nama supplier"
                                    />
                                    {
                                        fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )
                                    }
                                </Field>
                            )}
                        />
                        <Controller
                            name="status"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name} className="gap-0">Status</FieldLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">Semua</SelectItem>
                                            <SelectItem value="DRAFT">Draft</SelectItem>
                                            <SelectItem value="COMPLETED">Completed</SelectItem>
                                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {
                                        fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )
                                    }
                                </Field>
                            )}
                        />
                    </div>

                    <div className="flex flex-row gap-2 items-center">
                        <Controller
                            name="dateFrom"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name} className="gap-0">Dari Tanggal</FieldLabel>
                                    <DatePicker
                                        date={field.value}
                                        setDate={field.onChange}
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {
                                        fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )
                                    }
                                </Field>
                            )}
                        />
                        <Controller
                            name="dateTo"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name} className="gap-0">Hingga Tanggal</FieldLabel>
                                    <DatePicker
                                        date={field.value}
                                        setDate={field.onChange}
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {
                                        fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )
                                    }
                                </Field>
                            )}
                        />
                    </div>

                    <div className="flex flex-row gap-2 justify-end">
                        <Button type="reset" variant="link">Reset</Button>
                        <Button type="submit" onClick={dismissDialog}>Terapkan</Button>
                    </div>
                </FieldGroup>
            </form>
        </section>
    )
}

export default FilterDialogBody;