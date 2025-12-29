'use client';
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { IconSearch } from "@tabler/icons-react";
import { useRef, useState } from "react"

function SearchField({
    placeholder,
    isLoading,
    showLoading,
    onSearch
}: {
    placeholder: string,
    isLoading: boolean,
    showLoading: () => void,
    onSearch: (searchField: string) => void
}) {
    const [searchField, setSearchField] = useState("")
    const debounceTimer = useRef<NodeJS.Timeout | null>(null)

    const onSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        showLoading()
        setSearchField(e.target.value)

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current)
        }

        debounceTimer.current = setTimeout(() => {
            onSearch(e.target.value)
        }, 500)
    }

    return (
        <InputGroup>
            <InputGroupAddon>
                <IconSearch />
            </InputGroupAddon>
            <InputGroupInput placeholder={placeholder} value={searchField} onChange={onSearchFieldChange} />
            {
                isLoading && (
                    <InputGroupAddon align="inline-end">
                        <Spinner />
                    </InputGroupAddon>
                )
            }
        </InputGroup>
    )
}

export default SearchField;