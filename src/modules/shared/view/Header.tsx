import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

function Header({ title, buttonLabel, buttonHref }: { title: string, buttonLabel: string, buttonHref: string }) {
    return (
        <header className="flex flex-row justify-between items-center">
            <h1 className="font-bold text-2xl">{title}</h1>
            <Button size="sm" variant="ghost" className="font-bold" asChild>
                <Link href={buttonHref}>
                    <IconPlus />
                    {buttonLabel}
                </Link>
            </Button>
        </header>
    )
}

export default Header;