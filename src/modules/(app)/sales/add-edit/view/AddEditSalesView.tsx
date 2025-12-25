'use client';
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Routes from "@/src/modules/shared/model/Routes";
import HeaderWithBackButton from "@/src/modules/shared/view/HeaderWithBackButton";
import { LoadingOverlayContext } from "@/src/modules/shared/view/LoadingOverlay";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IMEIFormSchemeType } from "../../../purchase/add-edit/model/IMEIFormScheme";
import AddEditSalesController from "../controller/AddEditSalesController";
import { AddEditSalesFormScheme, AddEditSalesFormSchemeType } from "../model/AddEditSalesFormScheme";
import { AddEditSalesItemFormSchemeType } from "../model/AddEditSalesItemFormScheme";
import CustomerData from "../model/CustomerData";
import PaymentMethodData from "../model/PaymentMethodData";
import AddEditSalesItemSection from "./AddEditSalesItemSection";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";

function SalesHeaderItem({ label, value = "(Dibuat Otomatis)" }: { label: string, value?: string }) {
    return (
        <Field className="gap-2">
            <FieldLabel className="font-bold">{label}</FieldLabel>
            <Input value={value} disabled />
        </Field>
    )
}

function AddEditSalesForm({ isEdit, customers, paymentMethods, sales }: { isEdit: boolean, customers: CustomerData[], paymentMethods: PaymentMethodData[], sales?: AddEditSalesFormSchemeType }) {
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(AddEditSalesFormScheme),
        values: sales,
        defaultValues: {
            customerId: "",
            paymentId: "",
            items: [],
        }
    });

    const disableButton = form.watch("customerId").length === 0 || form.watch("paymentId").length === 0;
    const salesItems = form.watch("items");

    const handleAddItem = (item: AddEditSalesItemFormSchemeType) => {
        if (salesItems.some((saleItem) => saleItem.sku === item.sku)) {
            toast.error("Item dengan SKU yang sama sudah ada");
        } else {
            form.setValue("items", [...salesItems, item], {
                shouldValidate: true,
            });
        }
    }

    const handleChangeItem = (item: AddEditSalesItemFormSchemeType) => {
        form.setValue("items", salesItems.map((saleItem) =>
            saleItem.sku === item.sku ?
                { ...item, subtotal: AddEditSalesController.calculateSubtotalToString(item) }
                : saleItem), {
            shouldValidate: true,
        });
    }

    const handleRemoveItem = (item: AddEditSalesItemFormSchemeType) => {
        form.setValue("items", salesItems.filter((saleItem) => saleItem.sku !== item.sku), {
            shouldValidate: true,
        });
    }

    const handleAddIMEI = (sku: string, imei: IMEIFormSchemeType) => {
        const item = salesItems.find((saleItem) => saleItem.sku === sku);

        if (item?.imeis.some((saleIMEI) => saleIMEI.value === imei.value)) {
            toast.error("IMEI dengan nomor yang sama sudah ada");
        } else {
            form.setValue("items", salesItems.map((saleItem) =>
                saleItem.sku === sku ? { ...saleItem, imeis: [...saleItem.imeis, imei] } : saleItem
            ), {
                shouldValidate: true,
            });
        }
    }

    const handleRemoveIMEI = (sku: string, imei: IMEIFormSchemeType) => {
        form.setValue("items", salesItems.map((saleItem) =>
            saleItem.sku === sku ? { ...saleItem, imeis: saleItem.imeis.filter((saleIMEI) => saleIMEI.value !== imei.value) } : saleItem
        ), {
            shouldValidate: true,
        });
    }

    const handleSubmit = async (data: AddEditSalesFormSchemeType) => {
        const [success, errorMessage] = await AddEditSalesController.postSales(isEdit, data);

        if (success) {
            toast.success(`Penjualan berhasil ${isEdit ? "diperbarui" : "ditambahkan"}`);
            router.replace(Routes.SALES.DEFAULT);
        } else {
            toast.error(errorMessage);
        }
    }

    return (
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col mx-3">
            <FieldGroup className="flex flex-col gap-4 mt-3">
                {isEdit &&
                    <div className="flex flex-row gap-4">
                        <SalesHeaderItem label="ID Transaksi" value={sales?.transactionId} />
                        <SalesHeaderItem label="Tanggal Transaksi" value={sales ? BaseUtil.formatDate(sales.transactionDate!) : undefined} />
                        <SalesHeaderItem label="Metode Transaksi" value={sales?.transactionMethod} />
                        <SalesHeaderItem label="Status Transaksi" value={sales?.transactionStatus} />
                    </div>
                }

                <div className="flex flex-row gap-4">
                    <Controller
                        name="customerId"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="gap-2">
                                <FieldLabel className="font-bold gap-0">Nama Pelanggan<span className="text-red-500">*</span></FieldLabel>
                                <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger aria-invalid={fieldState.invalid}>
                                        <SelectValue placeholder="Pilih Pelanggan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            customers.map((customer) => (
                                                <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />

                    <Controller
                        name="paymentId"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="gap-2">
                                <FieldLabel className="font-bold gap-0">Metode Pembayaran<span className="text-red-500">*</span></FieldLabel>
                                <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger aria-invalid={fieldState.invalid}>
                                        <SelectValue placeholder="Pilih Metode Pembayaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            paymentMethods.map((paymentMethod) => (
                                                <SelectItem key={paymentMethod.id} value={paymentMethod.id}>{paymentMethod.name}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />
                </div>

                <Controller
                    name="items"
                    control={form.control}
                    render={({ fieldState }) => (
                        <Field>
                            <AddEditSalesItemSection
                                disableAddItemBtn={disableButton}
                                salesItems={salesItems}
                                onAddItem={handleAddItem}
                                onChangeItem={handleChangeItem}
                                onRemoveItem={handleRemoveItem}
                                onAddIMEI={handleAddIMEI}
                                onRemoveIMEI={handleRemoveIMEI} />
                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />
            </FieldGroup>

            <Button className="self-end mt-5" disabled={!form.formState.isValid}>{isEdit ? "Ubah" : "Tambah"} Penjualan</Button>
        </form>
    )
}

function AddEditSalesView({ isEdit = false, id = "" }: { isEdit?: boolean, id?: string }) {
    const showLoadingOverlay = useContext(LoadingOverlayContext);
    const [customers, setCustomers] = useState<CustomerData[]>([])
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>([])
    const [sales, setSales] = useState<AddEditSalesFormSchemeType | undefined>(undefined)

    const fetchCustomers = async () => {
        const [success, customers, errorMessage] = await AddEditSalesController.getCustomer()
        if (success) {
            setCustomers(customers)
        } else {
            toast.error(errorMessage)
        }
    }

    const fetchPaymentMethods = async () => {
        const [success, paymentMethods, errorMessage] = await AddEditSalesController.getPaymentMethod()
        if (success) {
            setPaymentMethods(paymentMethods)
        } else {
            toast.error(errorMessage)
        }
    }

    const fetchSales = async () => {
        if (isEdit) {
            const [success, sales, errorMessage] = await AddEditSalesController.getSales(id)
            if (success) {
                setSales(sales)
            } else {
                toast.error(errorMessage)
            }
        }
    }

    const initializePage = async () => {
        showLoadingOverlay(true)
        await Promise.all([fetchCustomers(), fetchPaymentMethods(), fetchSales()])
        showLoadingOverlay(false)
    }

    useEffect(() => {
        initializePage()
    }, [])

    return (
        <div>
            <HeaderWithBackButton title={`${isEdit ? "Ubah" : "Tambah"} Penjualan`} />
            <AddEditSalesForm customers={customers} paymentMethods={paymentMethods} isEdit={isEdit} sales={sales} />
        </div>
    )
}

export default AddEditSalesView;