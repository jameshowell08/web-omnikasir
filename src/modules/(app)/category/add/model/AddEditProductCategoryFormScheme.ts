import z from "zod";

const AddEditProductCategoryFormScheme = z.object({
    categoryName: z.string().min(1, "Nama kategori tidak boleh kosong"),
    categoryDescription: z.string().optional(),
})

export default AddEditProductCategoryFormScheme