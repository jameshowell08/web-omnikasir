'use client';
import { Button } from "@/components/ui/button";

function ItemButton({amount, isSelected, onAmountChange}: {amount: number, isSelected: boolean, onAmountChange: (amount: number) => void}) {
    return (
        <Button variant={isSelected ? "default" : "outline"} size="sm" onClick={() => onAmountChange(amount)}>{amount} item</Button>
    )
}

function ItemAmountSelectSection({selectedAmount, onAmountChange}: {selectedAmount: number, onAmountChange: (amount: number) => void}) {
    return (
        <div className="flex flex-row gap-2 items-center">
            <span>Item per halaman</span>
            <ItemButton amount={10} isSelected={selectedAmount === 10} onAmountChange={onAmountChange}/>
            <ItemButton amount={20} isSelected={selectedAmount === 20} onAmountChange={onAmountChange}/>
            <ItemButton amount={50} isSelected={selectedAmount === 50} onAmountChange={onAmountChange}/>
        </div>
    )
}

export default ItemAmountSelectSection;