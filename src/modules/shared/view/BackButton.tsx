'use client';
import { IconArrowBackUp } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

function BackButton() {
    const router = useRouter();

    return (
        <div className="p-2 cursor-pointer hover:bg-accent w-fit rounded-lg">
            <IconArrowBackUp size={20} onClick={() => router.back()} />
        </div>
    )
}

export default BackButton;