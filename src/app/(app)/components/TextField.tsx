import React from "react";

interface TextFieldProps {
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
}

export default function TextField({
  name,
  placeholder,
  value,
  onChange,
  error,
  type = "text",
}: TextFieldProps) {
  return (
    <div className="flex flex-col space-y-1 flex-1">
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`px-3 py-2 rounded-md border
          ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-black focus:border-black focus:ring-black"} 
          focus:outline-none focus:ring-1`}
      />

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
