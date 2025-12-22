import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IconDots } from "@tabler/icons-react";

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
                        {haveActions && <TableHead />}
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