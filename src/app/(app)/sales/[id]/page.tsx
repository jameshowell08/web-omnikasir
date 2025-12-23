import GetTransactionDetailView from "@/src/modules/(app)/sales/detail/view/GetTransactionDetailView";

async function GetTransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    return <GetTransactionDetailView id={id} />
}

export default GetTransactionDetailPage;