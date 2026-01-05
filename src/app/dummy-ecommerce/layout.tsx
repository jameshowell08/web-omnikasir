import DummyEcommerceLayout from "@/src/modules/dummy-ecommerce/layout/view/DummyEcommerceLayout";

function DummyEcommerceLayoutPage({ children }: { children: React.ReactNode }) {
    return (
        <DummyEcommerceLayout>
            {children}
        </DummyEcommerceLayout>
    )
}

export default DummyEcommerceLayoutPage;