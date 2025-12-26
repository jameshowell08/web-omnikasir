'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconDots, IconFilter } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Header from "../../../shared/view/Header";
import ItemAmountSelectSection from "../../../shared/view/ItemAmountSelectSection";
import SearchField from "../../../shared/view/SearchField";
import { UserManagementFilterFormScheme, UserManagementFilterFormSchemeDefaultValues, UserManagementFilterFormSchemeType } from "../model/UserManagementFilterFormScheme";
import CustomTable from "../../../shared/view/CustomTable";
import { TableCell, TableRow } from "@/components/ui/table";
import UserData from "../model/UserData";
import UserManagementController from "../controller/UserManagementController";
import toast from "react-hot-toast";
import TablePlaceholder from "@/src/modules/shared/view/TablePlaceholder";
import TablePagination from "@/src/modules/shared/view/TablePagination";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function UserManagementFilterForm({
    formId,
    dataValue,
    onSubmit
}: {
    formId: string,
    dataValue: UserManagementFilterFormSchemeType,
    onSubmit: (data: UserManagementFilterFormSchemeType) => void
}) {
    const form = useForm<UserManagementFilterFormSchemeType>({
        resolver: zodResolver(UserManagementFilterFormScheme),
        values: dataValue,
        defaultValues: dataValue
    })

    const onReset = () => {
        form.reset(UserManagementFilterFormSchemeDefaultValues)
    }

    return (
        <form id={formId} onSubmit={form.handleSubmit(onSubmit)} onReset={onReset}>
            <FieldGroup>
                <Controller
                    name="role"
                    control={form.control}
                    render={({ field }) => (
                        <Field>
                            <FieldLabel>Role</FieldLabel>
                            <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih role" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="ALL">Semua</SelectItem>
                                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                                    <SelectItem value="CASHIER">CASHIER</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    )}
                />
            </FieldGroup>
        </form>
    )
}

function UserManagementFilterDialogContent({ dataValue, onFilter }: { dataValue: UserManagementFilterFormSchemeType, onFilter: (data: UserManagementFilterFormSchemeType) => void }) {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Filter Pengguna</DialogTitle>
                <DialogDescription>Filter pengguna berdasarkan rolenya.</DialogDescription>
            </DialogHeader>

            <UserManagementFilterForm formId="user-management-filter-form" dataValue={dataValue} onSubmit={onFilter} />

            <DialogFooter>
                <Button variant="outline" type="reset" form="user-management-filter-form">Reset</Button>
                <Button type="submit" form="user-management-filter-form">Filter</Button>
            </DialogFooter>
        </DialogContent>
    )
}

function UserManagementFilterDialog({ dataValue, onFilter }: { dataValue: UserManagementFilterFormSchemeType, onFilter: (data: UserManagementFilterFormSchemeType) => void }) {
    const [showDialog, setShowDialog] = useState(false)
    return (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
                <Button size="icon">
                    <IconFilter />
                </Button>
            </DialogTrigger>

            <UserManagementFilterDialogContent dataValue={dataValue} onFilter={(data) => {
                onFilter(data)
                setShowDialog(false)
            }} />
        </Dialog>
    )
}

function UserManagementFilter({
    searchLoading,
    pageLimit,
    formValue,
    setPageLimit,
    showSearchLoading,
    onSearch,
    onFilter
}: {
    searchLoading: boolean,
    pageLimit: number,
    formValue: UserManagementFilterFormSchemeType,
    setPageLimit: (amount: number) => void,
    showSearchLoading: () => void,
    onSearch: (value: string) => void,
    onFilter: (data: UserManagementFilterFormSchemeType) => void
}) {
    return (
        <div className="flex flex-row items-center justify-between mt-4">
            <div className="w-100 flex flex-row gap-2">
                <SearchField
                    placeholder="Cari pengguna..."
                    isLoading={searchLoading}
                    showLoading={showSearchLoading}
                    onSearch={onSearch}
                />

                <UserManagementFilterDialog dataValue={formValue} onFilter={onFilter} />
            </div>
            <ItemAmountSelectSection selectedAmount={pageLimit} onAmountChange={setPageLimit} />
        </div>
    )
}

function UserManagementTable({ users, currentPage, maxPage, onChangePage }: { users: UserData[], currentPage: number, maxPage: number, onChangePage: (page: number) => void }) {
    return (
        <div>
            <CustomTable headers={["ID", "Username", "Role"]} haveActions>
                {
                    users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell className="w-0">
                                <Button size="icon-sm" variant="ghost">
                                    <IconDots />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </CustomTable>
            <TablePagination currentPage={currentPage} onChangePage={onChangePage} maxPage={maxPage} />
        </div>
    )
}

function UserManagementView() {
    const [users, setUsers] = useState<UserData[] | undefined>(undefined)
    const [searchValue, setSearchValue] = useState("")
    const [isSearchLoading, setIsSearchLoading] = useState(false)
    const [pageLimit, setPageLimit] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [filterData, setFilterData] = useState<UserManagementFilterFormSchemeType>(UserManagementFilterFormSchemeDefaultValues)

    const handleFilter = (data: UserManagementFilterFormSchemeType) => {
        setFilterData(data)
    }

    const fetchUsers = async (currentPage: number, pageLimit: number, searchValue: string, filterData: UserManagementFilterFormSchemeType) => {
        const [success, users, maxPage, errorMessage] = await UserManagementController.getUsers(currentPage, pageLimit, searchValue, filterData)

        if (success) {
            setUsers(users)
            setMaxPage(maxPage)
        } else {
            toast.error(errorMessage)
        }
        setIsSearchLoading(false)
    }

    useEffect(() => {
        fetchUsers(currentPage, pageLimit, searchValue, filterData)
    }, [currentPage, pageLimit, searchValue, filterData])

    return (
        <div>
            <Header title="Manajemen Pengguna" buttonLabel="Tambah Pengguna" buttonHref="" />
            <UserManagementFilter
                searchLoading={isSearchLoading}
                pageLimit={pageLimit}
                formValue={filterData}
                setPageLimit={setPageLimit}
                showSearchLoading={() => setIsSearchLoading(true)}
                onSearch={setSearchValue}
                onFilter={handleFilter}
            />
            {users ? <UserManagementTable users={users!} currentPage={currentPage} maxPage={maxPage} onChangePage={setCurrentPage} /> : <TablePlaceholder />}
        </div>
    )
}

export default UserManagementView;