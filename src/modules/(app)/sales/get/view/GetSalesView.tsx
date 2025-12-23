'use client';
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import { DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { TableCell, TableRow } from "@/components/ui/table";
import Routes from "@/src/modules/shared/model/Routes";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import CustomTable from "@/src/modules/shared/view/CustomTable";
import Header from "@/src/modules/shared/view/Header";
import ItemAmountSelectSection from "@/src/modules/shared/view/ItemAmountSelectSection";
import { LoadingOverlayContext } from "@/src/modules/shared/view/LoadingOverlay";
import TablePagination from "@/src/modules/shared/view/TablePagination";
import TablePlaceholder from "@/src/modules/shared/view/TablePlaceholder";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@radix-ui/react-dialog";
import { IconDots, IconEdit, IconEye, IconFilter, IconSearch, IconTrash } from "@tabler/icons-react";
import { useContext, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import GetSalesController from "../controller/GetSalesController";
import PaymentMethodData from "../model/PaymentMethodData";
import SalesTableData from "../model/SalesTableData";
import { SalesTableFilterFormScheme, SalesTableFilterFormSchemeDefaultValues, SalesTableFilterFormSchemeType } from "../model/SalesTableFilterFormScheme";

function FilterDialogBody({ initialValues, formId, paymentMethods, handleFilter }: { initialValues: SalesTableFilterFormSchemeType | undefined, formId: string, paymentMethods: PaymentMethodData[], handleFilter: (data: SalesTableFilterFormSchemeType) => void }) {
    const form = useForm({
        resolver: zodResolver(SalesTableFilterFormScheme),
        values: initialValues,
        defaultValues: SalesTableFilterFormSchemeDefaultValues
    })

    const handleReset = () => {
        form.reset(SalesTableFilterFormSchemeDefaultValues)
    }

    return (
        <form id={formId} onSubmit={form.handleSubmit(handleFilter)} onReset={handleReset}>
            <FieldGroup>
                <Controller
                    name="paymentMethod"
                    control={form.control}
                    render={({ field }) => (
                        <Field>
                            <FieldLabel>Metode Pembayaran</FieldLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih metode pembayaran" />
                                </SelectTrigger>
                                <SelectContent>
                                    {paymentMethods.map((paymentMethod) => (
                                        <SelectItem key={paymentMethod.paymentMethodId} value={paymentMethod.paymentMethodId}>{paymentMethod.paymentName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    )}
                />
                <div className="flex flex-row gap-2">
                    <Controller
                        name="startDate"
                        control={form.control}
                        render={({ field }) => (
                            <Field>
                                <FieldLabel>Dari tanggal</FieldLabel>
                                <DatePicker date={field.value} setDate={field.onChange} />
                            </Field>
                        )}
                    />

                    <Controller
                        name="endDate"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Sampai tanggal</FieldLabel>
                                <DatePicker date={field.value} setDate={field.onChange} aria-invalid={fieldState.invalid} />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />
                </div>
            </FieldGroup>
        </form>
    )
}

function FilterSales({
    selectedAmount,
    isSearchLoading,
    filterFormValues,
    paymentMethods,
    onAmountChange,
    onQueryChange,
    setIsSearchLoading,
    handleFilter
}: {
    selectedAmount: number,
    isSearchLoading: boolean,
    filterFormValues: SalesTableFilterFormSchemeType | undefined,
    paymentMethods: PaymentMethodData[],
    onAmountChange: (amount: number) => void,
    onQueryChange: (query: string) => void,
    setIsSearchLoading: (isLoading: boolean) => void,
    handleFilter: (data: SalesTableFilterFormSchemeType) => void
}) {
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const debounce = useRef<NodeJS.Timeout | null>(null);
    const [isDialogShown, showDialog] = useState(false);

    const handleSearch = (query: string) => {
        setIsSearchLoading(true);
        setDebouncedSearchQuery(query);
        if (debounce.current) {
            clearTimeout(debounce.current);
        }

        debounce.current = setTimeout(() => {
            onQueryChange(query);
        }, 500);
    }

    return (
        <div className="mt-4 flex flex-row justify-between">
            <span className="flex flex-row gap-2 w-100">
                <InputGroup>
                    <InputGroupAddon>
                        <IconSearch />
                    </InputGroupAddon>

                    <InputGroupInput value={debouncedSearchQuery} onChange={(e) => handleSearch(e.target.value)} placeholder="Cari penjualan" />

                    {isSearchLoading && (
                        <InputGroupAddon align="inline-end">
                            <Spinner />
                        </InputGroupAddon>
                    )}
                </InputGroup>

                <Dialog open={isDialogShown} onOpenChange={showDialog}>
                    <DialogTrigger asChild>
                        <Button size="icon">
                            <IconFilter />
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogTitle>Filter penjualan</DialogTitle>
                        <DialogDescription>Filter penjualan berdasarkan metode transaksi, metode pembayaran, dan tanggal transaksi.</DialogDescription>

                        <FilterDialogBody initialValues={filterFormValues} formId="sales-filter-form" paymentMethods={paymentMethods} handleFilter={(data) => {
                            handleFilter(data)
                            showDialog(false)
                        }} />

                        <DialogFooter className="flex flex-row justify-end gap-2">
                            <Button variant="ghost" type="reset" form="sales-filter-form">Reset</Button>
                            <Button type="submit" form="sales-filter-form">Terapkan</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </span>

            <ItemAmountSelectSection selectedAmount={selectedAmount} onAmountChange={onAmountChange} />
        </div>
    )
}

function GetSalesTableCellAction() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon-sm" variant="ghost">
                    <IconDots />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem>
                    <IconEye />
                    Detail
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                    <IconEdit />
                    Edit
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem variant="destructive">
                    <IconTrash />
                    Hapus
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function GetSalesTable({ sales }: { sales: SalesTableData[] }) {
    return (
        <CustomTable headers={["ID", "Tanggal", "Metode Transaksi", "Status", "Metode Pembayaran", "Total"]} haveActions>
            {
                sales.map((sale) => (
                    <TableRow key={sale.transactionHeaderId}>
                        <TableCell>{sale.transactionHeaderId}</TableCell>
                        <TableCell>{BaseUtil.formatDate(sale.transactionDate)}</TableCell>
                        <TableCell>{sale.transactionMethod}</TableCell>
                        <TableCell>{sale.status}</TableCell>
                        <TableCell>{sale.paymentMethod}</TableCell>
                        <TableCell>{BaseUtil.formatRupiah(sale.totalAmount)}</TableCell>
                        <TableCell className="w-0">
                            <GetSalesTableCellAction />
                        </TableCell>
                    </TableRow>
                ))
            }
        </CustomTable>
    )
}

function GetSalesView() {
    const showLoadingOverlay = useContext(LoadingOverlayContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedAmount, setSelectedAmount] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sales, setSales] = useState<SalesTableData[] | undefined>(undefined);
    const [totalPage, setTotalPage] = useState(1);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [filterFormScheme, setFilterFormScheme] = useState<SalesTableFilterFormSchemeType | undefined>(undefined)
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>([])

    const fetchSales = async (currentPage: number, selectedAmount: number, searchQuery: string, filterFormScheme: SalesTableFilterFormSchemeType | undefined) => {
        const [success, salesData, errorMessage, totalPages] = await GetSalesController.getSales(currentPage, selectedAmount, searchQuery, filterFormScheme?.startDate, filterFormScheme?.endDate)

        if (success) {
            setSales(salesData)
            setTotalPage(totalPages)
        } else {
            toast.error(errorMessage)
        }
        setIsSearchLoading(false)
    }

    const fetchPaymentMethods = async () => {
        showLoadingOverlay(true)
        const [success, paymentMethodsData, errorMessage] = await GetSalesController.getPaymentMethods()
        if (success) {
            setPaymentMethods(paymentMethodsData)
        } else {
            toast.error(errorMessage)
        }
        showLoadingOverlay(false)
    }

    const handleFilter = (data: SalesTableFilterFormSchemeType) => {
        setFilterFormScheme(data)
    }

    useEffect(() => {
        fetchSales(currentPage, selectedAmount, searchQuery, filterFormScheme)
    }, [currentPage, selectedAmount, searchQuery, filterFormScheme])

    useEffect(() => {
        fetchPaymentMethods()
    }, [])

    return (
        <div>
            <Header title="Penjualan" buttonLabel="Tambah penjualan" buttonHref={Routes.SALES.ADD} />
            <FilterSales
                isSearchLoading={isSearchLoading}
                selectedAmount={selectedAmount}
                filterFormValues={filterFormScheme}
                paymentMethods={paymentMethods}
                onAmountChange={setSelectedAmount}
                setIsSearchLoading={setIsSearchLoading}
                onQueryChange={setSearchQuery}
                handleFilter={handleFilter}
            />
            {
                sales ? (
                    <GetSalesTable sales={sales} />
                ) : (<TablePlaceholder />)
            }
            <TablePagination currentPage={currentPage} maxPage={totalPage} onChangePage={setCurrentPage} />
        </div>
    )
}

export default GetSalesView;