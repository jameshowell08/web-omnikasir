'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconX } from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { IMEIFormScheme } from "../model/IMEIFormScheme";

function IMEIForm({ imeiInputted, quantity, onAddImei }: { imeiInputted: string, quantity: string, onAddImei: (imei: string) => void }) {
    const form = useForm<z.infer<typeof IMEIFormScheme>>({
        resolver: zodResolver(IMEIFormScheme),
        defaultValues: {
            value: ""
        }
    })

    const handleSubmit = (data: z.infer<typeof IMEIFormScheme>) => {
        onAddImei(data.value)
        form.reset()
    }

    return (
        <form id="imei-form" onSubmit={(e) => {
            e.stopPropagation()
            form.handleSubmit(handleSubmit)(e)
        }}>
            <Controller
                name="value"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <div className="flex flex-row gap-2">
                            <div className="flex flex-col flex-1 gap-1">
                                <Input placeholder="Masukkan IMEI" {...field} />
                                <p className="self-end text-xs">{imeiInputted}/{quantity}</p>
                            </div>
                            <Button size="icon" form="imei-form"><IconPlus /></Button>
                        </div>
                        <FieldError errors={[fieldState.error]} />
                    </Field>
                )}
            />
        </form>
    )
}

function IMEIList({ imeis, onDeleteImei }: { imeis: string[], onDeleteImei: (imei: string) => void }) {
    return (
        <div className="flex flex-row gap-2 flex-wrap">
            {
                imeis.map((imei) => (
                    <Badge
                        key={imei}
                        variant="outline"
                        onClick={() => onDeleteImei(imei)}
                        className="flex flex-row items-center gap-2"
                    >
                        {imei}
                        <IconX />
                    </Badge>
                ))
            }
        </div>
    )
}

function ManageIMEIDialog({
    imeis,
    quantity,
    onAddImei,
    onDeleteImei
}: {
    imeis: string[],
    quantity: string,
    onAddImei: (imei: string) => void,
    onDeleteImei: (imei: string) => void
}) {
    const imeiInputted = BaseUtil.formatNumberV2(imeis.length)

    return (
        <Dialog>
            <DialogTrigger className="cursor-pointer">
                {imeiInputted}/{quantity}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Atur IMEI</DialogTitle>
                    <DialogDescription>
                        Atur IMEI untuk produk ini.
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                <IMEIForm imeiInputted={imeiInputted} quantity={quantity} onAddImei={onAddImei} />
                <IMEIList imeis={imeis} onDeleteImei={onDeleteImei} />
            </DialogContent>
        </Dialog>
    )
}

export default ManageIMEIDialog;