import BackButton from "./BackButton";

function HeaderWithBackButton({title}: {title: string}) {
    return (
        <header className="flex flex-row gap-2 items-center">
            <BackButton />
            <h1 className="text-xl font-bold">{title}</h1>
        </header>
    )
}

export default HeaderWithBackButton;