import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function CustomTableHead({heading}: {heading: string}) {
    return (
        <TableHead className="text-white font-bold">{heading}</TableHead>
    )
}

function CustomTable({headers, haveActions = false, children}: {headers: string[], haveActions?: boolean, children: React.ReactNode}) {
    return (
        <div className="rounded-lg overflow-hidden border mt-4">
            <Table>
                <TableHeader className="bg-black">
                    <TableRow>
                        {headers.map((header, index) => (
                            <CustomTableHead key={index} heading={header} />
                        ))}
                        {haveActions && <TableHead className="w-0" />}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {children}
                </TableBody>
            </Table>
        </div>
    )
}

export default CustomTable;