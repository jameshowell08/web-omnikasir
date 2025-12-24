'use client';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { DefaultIMEIFormScheme, IMEIFormScheme, IMEIFormSchemeType } from "../../../purchase/add-edit/model/IMEIFormScheme";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconPlus, IconX } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";

function IMEIDialogForm({ quantity, imeisLength, onAddIMEI }: { quantity: string, imeisLength: number, onAddIMEI: (imei: IMEIFormSchemeType) => void }) {
    const form = useForm({
        resolver: zodResolver(IMEIFormScheme),
        defaultValues: DefaultIMEIFormScheme
    })

    return (
        <form onSubmit={(e) => {
            e.stopPropagation();
            form.handleSubmit(onAddIMEI)(e);
            form.reset(DefaultIMEIFormScheme);
        }}>
            <FieldGroup className="flex flex-row gap-2">
                <Controller
                    name="value"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="gap-2">
                            <Input
                                {...field}
                                placeholder="Masukkan IMEI"
                                aria-invalid={fieldState.invalid}
                            />
                            <p className="text-sm text-end">{BaseUtil.formatNumberV2(imeisLength)}/{quantity}</p>
                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />

                <Button size="icon">
                    <IconPlus />
                </Button>
            </FieldGroup>
        </form>
    )
}

function IMEIList({ imeis, onRemoveIMEI }: { imeis: IMEIFormSchemeType[], onRemoveIMEI: (imei: IMEIFormSchemeType) => void }) {
    return (
        <div className="flex flex-row flex-wrap gap-2">
            {
                imeis.map((imei) => (
                    <Badge key={imei.value} variant="outline" className="cursor-pointer" onClick={() => onRemoveIMEI(imei)}>
                        {imei.value}
                        <IconX />
                    </Badge>
                ))
            }
        </div>
    )
}

function IMEIDialogContent({ imeis, quantity, onAddIMEI, onRemoveIMEI }: { imeis: IMEIFormSchemeType[], quantity: string, onAddIMEI: (imei: IMEIFormSchemeType) => void, onRemoveIMEI: (imei: IMEIFormSchemeType) => void }) {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>IMEI</DialogTitle>
                <DialogDescription>Input IMEI untuk item ini</DialogDescription>
            </DialogHeader>

            <IMEIDialogForm imeisLength={imeis.length} onAddIMEI={onAddIMEI} quantity={quantity} />
            <IMEIList imeis={imeis} onRemoveIMEI={onRemoveIMEI} />
        </DialogContent>
    )
}

export default IMEIDialogContent;