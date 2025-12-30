import GetPurchaseDetailView from "@/src/modules/(app)/purchase/detail/view/GetPurchaseDetailView";

async function GetPurchaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <GetPurchaseDetailView id={id} />
}

export default GetPurchaseDetailPage;