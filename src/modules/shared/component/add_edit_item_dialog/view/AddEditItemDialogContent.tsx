import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { IconArrowRight } from "@tabler/icons-react";
import { useState } from "react";
import AddEditItemForm from "./AddEditItemForm";
import SelectProductSection from "./SelectProductSection";
import { AddEditItemFormSchemeType } from "../model/AddEditItemFormScheme";

const selectProductFormId = "select-product-form"
const addEditItemFormId = "add-edit-item-form"

function AddEditItemDialogBody({
    dialogTitle,
    dialogDescription,
    item,
    mode,
    onSubmit
}: {
    dialogTitle: string,
    dialogDescription?: string,
    item?: AddEditItemFormSchemeType,
    mode: "BUY" | "SELL",
    onSubmit: (data: AddEditItemFormSchemeType) => void
}) {
    const [selectedSku, setSelectedSku] = useState(item?.sku || "")
    const [step, setStep] = useState(item ? 2 : 1)

    return (
        <div>
            <DialogHeader>
                <DialogTitle>{dialogTitle}</DialogTitle>
                {dialogDescription && <DialogDescription>{dialogDescription}</DialogDescription>}

                <Progress value={step * 50} className="mt-5" />
                <span className="self-end text-sm">Langkah {step}/2</span>
            </DialogHeader>

            {
                step === 1 ? (
                    <SelectProductSection
                        formId={selectProductFormId}
                        initialSelectedSku={selectedSku}
                        onSubmit={(sku) => {
                            setSelectedSku(sku)
                            setStep(2)
                        }} />
                ) : (
                    <AddEditItemForm formId={addEditItemFormId} item={item} sku={selectedSku} onSubmit={onSubmit} mode={mode} />
                )
            }

            <DialogFooter className="mt-5">
                {
                    step === 2 && !item &&
                    <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                        Kembali
                    </Button>
                }
                <Button form={step === 1 ? selectProductFormId : addEditItemFormId}>
                    {step === 1 ? (
                        <>
                            Lanjut
                            <IconArrowRight />
                        </>
                    ) : "Simpan"}
                </Button>
            </DialogFooter>
        </div>
    )
}

function AddEditItemDialogContent({
    dialogTitle,
    dialogDescription,
    item,
    mode,
    onSubmit
}: {
    dialogTitle: string,
    dialogDescription?: string,
    item?: AddEditItemFormSchemeType,
    mode: "BUY" | "SELL",
    onSubmit: (data: AddEditItemFormSchemeType) => void
}) {
    return (
        <DialogContent className="block">
            <AddEditItemDialogBody
                dialogTitle={dialogTitle}
                dialogDescription={dialogDescription}
                item={item}
                mode={mode}
                onSubmit={onSubmit}
            />
        </DialogContent>
    )
}

export default AddEditItemDialogContent;