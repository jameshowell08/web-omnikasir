'use client';
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import HeaderWithBackButton from "@/src/modules/shared/view/HeaderWithBackButton";
import { LoadingOverlayContext } from "@/src/modules/shared/view/LoadingOverlay";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import AddEditSalesController from "../controller/AddEditSalesController";
import { AddEditSalesFormScheme, AddEditSalesFormSchemeType } from "../model/AddEditSalesFormScheme";
import CustomerData from "../model/CustomerData";
import PaymentMethodData from "../model/PaymentMethodData";
import AddEditSalesItemSection from "./AddEditSalesItemSection";
import { Button } from "@/components/ui/button";
import { AddEditSalesItemFormSchemeType } from "../model/AddEditSalesItemFormScheme";

function SalesHeaderItem({ label, value = "(Dibuat Otomatis)" }: { label: string, value?: string }) {
    return (
        <Field className="gap-2">
            <FieldLabel className="font-bold">{label}</FieldLabel>
            <Input value={value} disabled />
        </Field>
    )
}

function AddEditSalesForm({ isEdit, customers, paymentMethods }: { isEdit: boolean, customers: CustomerData[], paymentMethods: PaymentMethodData[] }) {    
    const form = useForm({
        resolver: zodResolver(AddEditSalesFormScheme),
        defaultValues: {
            customerName: "",
            paymentMethod: "",
            items: [],
        }
    });

    const disableButton = form.watch("customerName").length === 0 || form.watch("paymentMethod").length === 0;
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
                : saleItem),{
                    shouldValidate: true,
                });
    }

    const handleRemoveItem = (item: AddEditSalesItemFormSchemeType) => {
        form.setValue("items", salesItems.filter((saleItem) => saleItem.sku !== item.sku), {
            shouldValidate: true,
        });
    }

    const handleSubmit = (data: AddEditSalesFormSchemeType) => {
        console.log(data);
    }

    return (
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col mx-3">
            <FieldGroup className="flex flex-col gap-4 mt-3">
                {isEdit &&
                    <div className="flex flex-row gap-4">
                        <SalesHeaderItem label="ID Transaksi" />
                        <SalesHeaderItem label="Tanggal Transaksi" />
                        <SalesHeaderItem label="Metode Transaksi" />
                        <SalesHeaderItem label="Status Transaksi" />
                    </div>
                }

                <div className="flex flex-row gap-4">
                    <Controller
                        name="customerName"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="gap-2">
                                <FieldLabel className="font-bold gap-0">Nama Pelanggan<span className="text-red-500">*</span></FieldLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
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
                        name="paymentMethod"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="gap-2">
                                <FieldLabel className="font-bold gap-0">Metode Pembayaran<span className="text-red-500">*</span></FieldLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
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
            </FieldGroup>

            <AddEditSalesItemSection disableAddItemBtn={disableButton} salesItems={salesItems} onAddItem={handleAddItem} onChangeItem={handleChangeItem} onRemoveItem={handleRemoveItem} />

            <Button className="self-end mt-5" disabled={!form.formState.isValid}>Buat Penjualan</Button>
        </form>
    )
}

function AddEditSalesView() {
    const showLoadingOverlay = useContext(LoadingOverlayContext);
    const [customers, setCustomers] = useState<CustomerData[]>([])
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>([])

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

    const initializePage = async () => {
        showLoadingOverlay(true)
        await Promise.all([fetchCustomers(), fetchPaymentMethods()])
        showLoadingOverlay(false)
    }

    useEffect(() => {
        initializePage()
    }, [])

    return (
        <div>
            <HeaderWithBackButton title="Tambah Penjualan" />
            <AddEditSalesForm customers={customers} paymentMethods={paymentMethods} isEdit={false} />
        </div>
    )
}

export default AddEditSalesView;