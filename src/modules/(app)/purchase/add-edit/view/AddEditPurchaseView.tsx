'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddEditItemFormSchemeType } from "@/src/modules/shared/component/add_edit_item_dialog/model/AddEditItemFormScheme";
import Routes from "@/src/modules/shared/model/Routes";
import BackButton from "@/src/modules/shared/view/BackButton";
import { LoadingOverlayContext } from "@/src/modules/shared/view/LoadingOverlay";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconDots, IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Control, Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import AddEditPurchaseController from "../controller/AddEditPurchaseController";
import { AddPurchaseFormScheme } from "../model/AddPurchaseFormScheme";
import AddEditPurchaseItemDialogContent from "./AddEditPurchaseItemDialogContent";
import ManageIMEIDialog from "./ManageIMEIDialog";

function AddEditPurchaseHeader({ isEdit = false }: { isEdit?: boolean }) {
    return (
        <div className="flex flex-row items-center gap-2">
            <BackButton />
            <h1 className="text-2xl font-bold">{isEdit ? "Ubah" : "Tambah"} Pembelian</h1>
        </div>
    )
}

function PurchaseDetail({ control, clearAllImeis }: { control: Control<z.infer<typeof AddPurchaseFormScheme>>, clearAllImeis: () => void }) {
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
                            onValueChange={(newValue) => {
                                const oldValue = field.value
                                field.onChange(newValue)
                                if (oldValue === "COMPLETED" && newValue !== "COMPLETED") {
                                    clearAllImeis()
                                }
                            }}
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

function AddEditPurchaseDetailItemHeader({
    isButtonDisabled,
    onAddPurchaseItem
}: {
    isButtonDisabled: boolean,
    onAddPurchaseItem: (productItem: AddEditItemFormSchemeType) => boolean
}) {
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
                <AddEditPurchaseItemDialogContent onSubmit={(data) => {
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

function PurchaseItemRow({
    item,
    status,
    onAddImei,
    onDeleteImei,
    onEditPurchaseItem,
    onDeleteItem
}: {
    item: AddEditItemFormSchemeType,
    status: string,
    onAddImei: (imei: string) => void,
    onDeleteImei: (imei: string) => void,
    onEditPurchaseItem: (item: AddEditItemFormSchemeType) => void,
    onDeleteItem: (sku: string) => void
}) {
    const [open, setOpen] = useState(false)
    const isImeiBadgeError = AddEditPurchaseController.isImeiBadgeError(item)

    return (
        <TableRow>
            <TableCell>{item.sku}</TableCell>
            <TableCell>{item.productName}</TableCell>
            <TableCell>{item.productBrand}</TableCell>
            <TableCell>{item.productCategory}</TableCell>
            <TableCell>Rp{item.price}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell align="center" className="w-0">
                <Badge variant="outline" className={clsx(isImeiBadgeError && "text-destructive border-destructive")}>
                    {item.isNeedImei ?
                        <ManageIMEIDialog
                            disableDialog={status !== "COMPLETED"}
                            quantity={item.quantity}
                            onAddImei={onAddImei}
                            onDeleteImei={onDeleteImei}
                            imeis={item.imeis.map((imei) => imei.value)}
                        />
                        : "-"
                    }
                </Badge>
            </TableCell>
            <TableCell>Rp{AddEditPurchaseController.calculateSubtotalToString(item.price, item.quantity)}</TableCell>
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

                    <AddEditPurchaseItemDialogContent item={item} onSubmit={(data) => {
                        onEditPurchaseItem(data)
                        setOpen(false)
                    }} />
                </Dialog>
            </TableCell>
        </TableRow>
    )
}

function PurchaseItemTableBody({
    purchaseItems,
    status,
    onAddImei,
    onDeleteImei,
    onEditPurchaseItem,
    onDeleteItem
}: {
    purchaseItems: AddEditItemFormSchemeType[],
    status: string,
    onAddImei: (sku: string, imei: string) => void,
    onDeleteImei: (sku: string, imei: string) => void,
    onEditPurchaseItem: (item: AddEditItemFormSchemeType) => void,
    onDeleteItem: (sku: string) => void
}) {
    return (
        <>
            {
                purchaseItems.map((item) => (
                    <PurchaseItemRow
                        key={item.sku}
                        onAddImei={(imei) => onAddImei(item.sku, imei)}
                        onDeleteImei={(imei) => onDeleteImei(item.sku, imei)}
                        item={item}
                        status={status}
                        onEditPurchaseItem={onEditPurchaseItem}
                        onDeleteItem={onDeleteItem}
                    />
                ))
            }
            <TableRow>
                <TableCell colSpan={7} className="font-bold">
                    Total
                </TableCell>
                <TableCell>Rp{AddEditPurchaseController.calculateTotal(purchaseItems)}</TableCell>
                <TableCell />
            </TableRow>
        </>
    )
}

function PurchaseItemTable({ control, status }: { control: Control<z.infer<typeof AddPurchaseFormScheme>>, status: string }) {
    const onEditPurchaseItem = (item: AddEditItemFormSchemeType, value: AddEditItemFormSchemeType[], onChange: (value: AddEditItemFormSchemeType[]) => void) => {
        onChange(value.map((it) => it.sku === item.sku ? item : it))
    }

    const onDeleteItem = (
        sku: string,
        value: AddEditItemFormSchemeType[],
        onChange: (value: AddEditItemFormSchemeType[]) => void
    ) => {
        onChange(value.filter((item) => item.sku !== sku))
    }

    const onAddImei = (sku: string, imei: string, items: AddEditItemFormSchemeType[], onChange: (value: AddEditItemFormSchemeType[]) => void) => {
        const newItems = items.map((item) => {
            if (item.sku === sku) {
                if (!item.imeis.some((it) => it.value === imei)) {
                    item.imeis.push({ value: imei })
                } else {
                    toast.error("IMEI sudah dimasukkan.")
                }
            }
            return item
        })
        onChange(newItems)
    }

    const onDeleteImei = (sku: string, imei: string, items: AddEditItemFormSchemeType[], onChange: (value: AddEditItemFormSchemeType[]) => void) => {
        const newItems = items.map((item) => {
            if (item.sku === sku) {
                item.imeis = item.imeis.filter((it) => it.value !== imei)
            }
            return item
        })
        onChange(newItems)
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
                                            <PurchaseItemTableBody
                                                status={status}
                                                purchaseItems={field.value}
                                                onAddImei={(sku, imei) => onAddImei(sku, imei, field.value, field.onChange)}
                                                onDeleteImei={(sku, imei) => onDeleteImei(sku, imei, field.value, field.onChange)}
                                                onEditPurchaseItem={(data) => onEditPurchaseItem(data, field.value, field.onChange)}
                                                onDeleteItem={(sku) => onDeleteItem(sku, field.value, field.onChange)}
                                            />
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

function AddEditPurchaseItemFooter({ formId, isButtonDisabled, isEdit }: { formId: string, isButtonDisabled: boolean, isEdit: boolean }) {
    return (
        <Button className="mt-3 self-end" disabled={isButtonDisabled} form={formId}>{isEdit ? "Ubah" : "Tambah"} Pembelian</Button>
    )
}

function AddEditPurchaseView({ id = "", isEdit = false }: { id?: string, isEdit?: boolean }) {
    const router = useRouter();
    const showLoadingOverlay = useContext(LoadingOverlayContext);

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
    const status = form.watch("status")

    const clearAllImeis = () => {
        const items = form.getValues("items")

        form.setValue("items", items.map((item) => {
            item.imeis = []
            return item
        }), { shouldValidate: true })
    }

    const onAddPurchaseItem = (productItem: AddEditItemFormSchemeType): boolean => {
        const currentItems = form.getValues("items")

        if (currentItems.some(item => item.sku === productItem.sku)) {
            toast.error("Item sudah ditambahkan sebelumnya.")
            return false
        }

        form.setValue("items", [...currentItems, productItem], { shouldValidate: true })
        return true
    }

    const handleSubmit = async (data: z.infer<typeof AddPurchaseFormScheme>) => {
        const [isSuccess, errorMessage] = await AddEditPurchaseController.postPurchase(data, isEdit, id)
        if (isSuccess) {
            toast.success("Pembelian berhasil ditambahkan.")
            router.replace(Routes.PURCHASE.GET)
        } else {
            toast.error(errorMessage)
        }
    }

    useEffect(() => {
        if (isEdit) {
            const fetchPurchaseDetail = async (id: string) => {
                showLoadingOverlay(true)
                const [isSuccess, data, errorMessage] = await AddEditPurchaseController.getPurchaseById(id)
                if (isSuccess) {
                    form.reset(data)
                } else {
                    toast.error(errorMessage)
                }
                showLoadingOverlay(false)
            }

            fetchPurchaseDetail(id)
        }
    }, [isEdit, id, form, showLoadingOverlay])

    return (
        <div>
            <AddEditPurchaseHeader isEdit={isEdit} />
            <form id="add-purchase-form" className="mx-3 flex flex-col" onSubmit={form.handleSubmit((data) => { handleSubmit(data) })}>
                <PurchaseDetail control={form.control} clearAllImeis={clearAllImeis} />
                <AddEditPurchaseDetailItemHeader isButtonDisabled={isButtonDisabled} onAddPurchaseItem={onAddPurchaseItem} />
                <PurchaseItemTable control={form.control} status={status} />
                <AddEditPurchaseItemFooter formId="add-purchase-form" isButtonDisabled={!form.formState.isValid} isEdit={isEdit} />
            </form>
        </div>
    )
}

export default AddEditPurchaseView;