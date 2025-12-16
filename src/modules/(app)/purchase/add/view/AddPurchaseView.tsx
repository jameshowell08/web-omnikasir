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
import toast from "react-hot-toast";
import EditPurchaseItemDialogContent from "./EditPurchaseItemDialogContent";

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

function AddPurchaseDetailItemHeader({ isButtonDisabled, onAddPurchaseItem }: { isButtonDisabled: boolean, onAddPurchaseItem: (productItem: z.infer<typeof AddPurchaseItemFormScheme>) => boolean }) {
    const [dialogOpen, setDialogOpen] = useState(false)

    return (
        <div className="mt-3 flex flex-row justify-between items-center">
            <h1 className="text-lg font-bold">Item Pembelian</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <Button
                        type="button"
                        disabled={isButtonDisabled}
                    >
                        <IconPlus />
                        Tambah Item
                    </Button>
                </DialogTrigger>
                <AddPurchaseItemDialogContent onAddPurchaseItem={(data) => {
                    const isAddSuccessful = onAddPurchaseItem(data)
                    if (isAddSuccessful) setDialogOpen(false)
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

function PurchaseItemRow({ item, onEditPurchaseItem, onDeleteItem }: { item: z.infer<typeof AddPurchaseItemFormScheme>, onEditPurchaseItem: (item: z.infer<typeof AddPurchaseItemFormScheme>) => void, onDeleteItem: (sku: string) => void }) {
    const [open, setOpen] = useState(false)

    return (
        <TableRow>
            <TableCell>{item.sku}</TableCell>
            <TableCell>{item.productName}</TableCell>
            <TableCell>{item.productBrand}</TableCell>
            <TableCell>{item.productCategory}</TableCell>
            <TableCell>Rp{item.price}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>-</TableCell>
            <TableCell>Rp{AddPurchaseController.calculateSubtotalToString(item.price, item.quantity)}</TableCell>
            <TableCell className="w-0 whitespace-nowrap">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm" type="button">
                                <IconDots />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DialogTrigger asChild>
                                <DropdownMenuItem>
                                    <IconEdit />
                                    Ubah
                                </DropdownMenuItem>
                            </DialogTrigger>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={() => onDeleteItem(item.sku)}>
                                <IconTrash />
                                Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <EditPurchaseItemDialogContent item={item} onEditPurchaseItem={(data) => {
                        onEditPurchaseItem(data)
                        setOpen(false)
                    }} />
                </Dialog>
            </TableCell>
        </TableRow>
    )
}

function PurchaseItemTableBody({ purchaseItems, onEditPurchaseItem, onDeleteItem }: { purchaseItems: z.infer<typeof AddPurchaseItemFormScheme>[], onEditPurchaseItem: (item: z.infer<typeof AddPurchaseItemFormScheme>) => void, onDeleteItem: (sku: string) => void }) {
    return (
        <>
            {
                purchaseItems.map((item, index) => (
                    <PurchaseItemRow key={index} item={item} onEditPurchaseItem={onEditPurchaseItem} onDeleteItem={onDeleteItem} />
                ))
            }
            <TableRow>
                <TableCell colSpan={7} className="font-bold">
                    Total
                </TableCell>
                <TableCell>Rp{AddPurchaseController.calculateTotal(purchaseItems)}</TableCell>
                <TableCell />
            </TableRow>
        </>
    )
}

function PurchaseItemTable({ control }: { control: Control<z.infer<typeof AddPurchaseFormScheme>> }) {
    const onEditPurchaseItem = (item: z.infer<typeof AddPurchaseItemFormScheme>, value: z.infer<typeof AddPurchaseItemFormScheme>[], onChange: (value: z.infer<typeof AddPurchaseItemFormScheme>[]) => void) => {
        onChange(value.map((it) => it.sku === item.sku ? item : it))
    }

    const onDeleteItem = (sku: string, value: z.infer<typeof AddPurchaseItemFormScheme>[], onChange: (value: z.infer<typeof AddPurchaseItemFormScheme>[]) => void) => {
        onChange(value.filter((item) => item.sku !== sku))
    }

    return (
        <div className="mt-3">
            <Controller
                name="items"
                control={control}
                render={({ field, fieldState }) => (
                    <Field>
                        <div className="rounded-lg border overflow-hidden">
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
                                            <PurchaseItemTableBody purchaseItems={field.value} onEditPurchaseItem={(data) => onEditPurchaseItem(data, field.value, field.onChange)} onDeleteItem={(sku) => onDeleteItem(sku, field.value, field.onChange)} />
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </div>
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

    const isButtonDisabled = form.watch("supplier") === ""

    const onAddPurchaseItem = (productItem: z.infer<typeof AddPurchaseItemFormScheme>): boolean => {
        const currentItems = form.getValues("items")

        if (currentItems.some(item => item.sku === productItem.sku)) {
            toast.error("Item sudah ditambahkan sebelumnya.")
            return false
        }

        form.setValue("items", [...currentItems, productItem], { shouldValidate: true })
        return true
    }

    const handleSubmit = (data: z.infer<typeof AddPurchaseFormScheme>) => {
        console.log(data)
    }

    return (
        <div>
            <AddPurchaseHeader />
            <form className="mx-3 flex flex-col" onSubmit={form.handleSubmit(handleSubmit)}>
                <PurchaseDetail control={form.control} />
                <AddPurchaseDetailItemHeader isButtonDisabled={isButtonDisabled} onAddPurchaseItem={onAddPurchaseItem} />
                <PurchaseItemTable control={form.control} />
                <AddPurchaseItemFooter isButtonDisabled={!form.formState.isValid} />
            </form>
        </div>
    )
}

export default AddPurchaseView;