import clsx from "clsx";

function ItemButton(
    {
        text,
        isSelected = false,
        onClick = () => {}
    }: {
        text: string,
        isSelected?: boolean,
        onClick?: () => void
    }
) {
    return (
        <span 
            className={clsx(
                "px-2 py-1 rounded-lg text-xs select-none",
                isSelected ? "bg-black text-white hover:bg-black/85" : "border border-black hover:bg-black/10"
            )}
            onClick={onClick}>
            {text}
        </span>
    )
}

export default ItemButton;