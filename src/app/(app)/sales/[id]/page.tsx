import GetSalesDetailView from "@/src/modules/(app)/sales/detail/view/GetSalesDetailView";

async function GetSalesDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    return <GetSalesDetailView id={id} />
}

export default GetSalesDetailPage;