import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import { useState } from "react";

function PasswordField({ "aria-invalid": ariaInvalid, placeholder, value, onChange }: { "aria-invalid": boolean, placeholder: string, value: string, onChange: (value: string) => void }) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <InputGroup>
            <InputGroupInput type={showPassword ? "text" : "password"} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={ariaInvalid} />
            <InputGroupAddon align="inline-end">
                <InputGroupButton size="icon-xs" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <IconEyeClosed /> : <IconEye />}
                </InputGroupButton>
            </InputGroupAddon>
        </InputGroup>
    )
}

export default PasswordField;