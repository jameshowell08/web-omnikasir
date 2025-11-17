'use client';
import { createContext, Dispatch, SetStateAction, useState } from "react"
import { DialogData } from "../model/DialogData";
import { IconX } from "@tabler/icons-react";

export const DialogHostContext = createContext<Dispatch<SetStateAction<DialogData | null>>>(() => { })

function DialogHost({ children }: { children: React.ReactNode }) {
    const [dialog, setDialog] = useState<DialogData | null>(null)

    return (
        <DialogHostContext.Provider value={setDialog}>
            {
                dialog &&
                <div 
                    className="fixed flex justify-center items-center h-screen w-screen bg-black/30 z-[100]" 
                    onClick={
                        () => {
                            if (dialog.dismissOnClickOutside) {
                                setDialog(null)
                            }
                        }
                    }
                >
                    <div 
                        className="rounded-lg bg-white flex flex-col justify-center items-center p-6 shadow"
                        onClick={(e) => {e.stopPropagation()}}
                    >
                        <header className="flex flex-row justify-between items-center w-full mb-2">
                            <h1 className="font-bold text-ellipsis">{dialog.title}</h1>
                            <div className="p-1 hover:bg-black/10 rounded-lg">
                                <IconX onClick={() => setDialog(null)}/>
                            </div>
                        </header>
                        {dialog.content}
                    </div>
                </div>
            }
            {children}
        </DialogHostContext.Provider>
    )
}

export default DialogHost;