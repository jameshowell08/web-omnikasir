import z from "zod";

const NumberType = z.string()
    .nullable()
    .transform((val) => {
        if (val && val != "") return Number(val.replace(/\./g, ""))
        return null
    })

const StringType = z.string().nullable().transform((val) => {
    if (val && val != "") return val
    return null
})

export const ProductFilterFormScheme = z.object({
    category: StringType,
    minPrice: NumberType,
    maxPrice: NumberType,
    minStock: NumberType,
    maxStock: NumberType,
})