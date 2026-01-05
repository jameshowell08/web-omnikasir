import { IconShoppingBag } from "@tabler/icons-react"

function DummyEcommerceLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen">
            <header className="sticky top-0 p-3 z-99">
                <div className="flex flex-row justify-between items-center p-2 rounded-lg bg-white shadow-sm">
                    <div className="flex flex-row items-center gap-2">
                        <IconShoppingBag size={24} />
                        <h1 className="text-xl font-bold">Shopedia</h1>
                    </div>
                </div>
            </header>
            <div className="mx-5 flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    )
}

export default DummyEcommerceLayout