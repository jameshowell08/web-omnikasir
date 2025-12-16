'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BackButton from "@/src/modules/shared/view/BackButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconDots, IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { Control, Controller, useForm } from "react-hook-form";
import z from "zod";
import { AddPurchaseFormScheme } from "../model/AddPurchaseFormScheme";
import { AddPurchaseItemFormScheme } from "../model/AddPurchaseItemFormScheme";
import AddPurchaseItemDialogContent from "./AddPurchaseItemDialogContent";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AddPurchaseController from "../controller/AddPurchaseController";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

function AddPurchaseHeader() {
    return (
        <div className="flex flex-row items-center gap-2">
            <BackButton />
            <h1 className="text-2xl font-bold">Tambah Pembelian</h1>
        </div>
    )
}

function PurchaseDetail({ control }: { control: Control<z.infer<typeof AddPurchaseFormScheme>> }) {
    return (
        <div className="flex flex-row mt-5 gap-5">
            <Field className="w-40 gap-2">
                <FieldLabel className="font-bold text-sm gap-0">ID Pembelian</FieldLabel>
                <Input
                    value="(Dibuat otomatis)"
                    disabled
                />
            </Field>
            <Field className="w-40 gap-2">
                <FieldLabel className="font-bold text-sm gap-0">Tanggal dibuat</FieldLabel>
                <Input
                    value="(Dibuat otomatis)"
                    disabled
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
                        <FieldError errors={[fieldState.error]} />
                    </Field>
                )}
            />
            <Controller
                name="supplier"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="w-70 gap-2">
                        <FieldLabel className="font-bold text-sm gap-0">Supplier<span className="text-red-500">*</span></FieldLabel>
                        <Input
                            {...field}
                            aria-invalid={fieldState.invalid}
                            placeholder="Masukkan supplier"
                        />
                        <FieldError errors={[fieldState.error]} />
                    </Field>
                )}
            />
        </div>
    )
}

function AddPurchaseDetailItemHeader({ isButtonDisabled, onAddPurchaseItem }: { isButtonDisabled: boolean, onAddPurchaseItem: (productItem: z.infer<typeof AddPurchaseItemFormScheme>) => void }) {
    const [dialogOpen, setDialogOpen] = useState(false)

    return (
        <div className="mt-3 flex flex-row justify-between items-center">
            <h1 className="text-lg font-bold">Item Pembelian</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <Button
                        disabled={isButtonDisabled}
                    >
                        <IconPlus />
                        Tambah Item
                    </Button>
                </DialogTrigger>
                <AddPurchaseItemDialogContent onAddPurchaseItem={(data) => {
                    onAddPurchaseItem(data)
                    setDialogOpen(false)
                }} />
            </Dialog>
        </div>
    )
}

function CustomTableHead({ children }: { children: React.ReactNode }) {
    return (
        <TableHead className="text-white font-bold">
            {children}
        </TableHead>
    )
}

function PurchaseItemTableBody({ purchaseItems }: { purchaseItems: z.infer<typeof AddPurchaseItemFormScheme>[] }) {
    return purchaseItems.map((item, index) => (
        <TableRow key={index}>
            <TableCell>{item.sku}</TableCell>
            <TableCell>{item.productName}</TableCell>
            <TableCell>{item.productBrand}</TableCell>
            <TableCell>{item.productCategory}</TableCell>
            <TableCell>{item.price}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>-</TableCell>
            <TableCell>{AddPurchaseController.calculateSubtotal(item.price, item.quantity)}</TableCell>
            <TableCell className="w-0 whitespace-nowrap">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" type="button">
                            <IconDots />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <IconEdit />
                            Ubah
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                            <IconTrash />
                            Hapus
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    ))
}

function PurchaseItemTable({ control }: { control: Control<z.infer<typeof AddPurchaseFormScheme>> }) {
    return (
        <div className="mt-3 rounded-lg border overflow-hidden">
            <Controller
                name="items"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <Table>
                            <TableHeader className="bg-black">
                                <TableRow>
                                    <CustomTableHead>SKU</CustomTableHead>
                                    <CustomTableHead>Nama</CustomTableHead>
                                    <CustomTableHead>Merek</CustomTableHead>
                                    <CustomTableHead>Kategori</CustomTableHead>
                                    <CustomTableHead>Harga</CustomTableHead>
                                    <CustomTableHead>Jumlah</CustomTableHead>
                                    <CustomTableHead>IMEI</CustomTableHead>
                                    <CustomTableHead>Subtotal</CustomTableHead>
                                    <TableHead className="w-0 whitespace-nowrap" />
                                </TableRow>
                            </TableHeader>
                            <TableBody className="overflow-auto">
                                {
                                    field.value.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center">
                                                Tidak ada data
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        <PurchaseItemTableBody purchaseItems={field.value} />
                                    )
                                }
                            </TableBody>
                        </Table>
                        <FieldError errors={[fieldState.error]} />
                    </Field>
                )}
            />
        </div>
    )
}

function AddPurchaseItemFooter({ isButtonDisabled }: { isButtonDisabled: boolean }) {
    return (
        <Button className="mt-3 self-end" disabled={isButtonDisabled}>Tambah Pembelian</Button>
    )
}

function AddPurchaseView() {
    const form = useForm<z.infer<typeof AddPurchaseFormScheme>>({
        resolver: zodResolver(AddPurchaseFormScheme),
        defaultValues: {
            status: "DRAFT",
            supplier: "",
            items: []
        },
        mode: "all"
    })

    const onAddPurchaseItem = (productItem: z.infer<typeof AddPurchaseItemFormScheme>) => {
        form.setValue("items", [...form.getValues("items"), productItem])
    }

    const isButtonDisabled = form.watch("supplier") === ""

    return (
        <div>
            <AddPurchaseHeader />
            <form className="mx-3 flex flex-col">
                <PurchaseDetail control={form.control} />
                <AddPurchaseDetailItemHeader isButtonDisabled={isButtonDisabled} onAddPurchaseItem={onAddPurchaseItem} />
                <PurchaseItemTable control={form.control} />
                <AddPurchaseItemFooter isButtonDisabled={!form.formState.isValid} />
            </form>
        </div>
    )
}

export default AddPurchaseView;