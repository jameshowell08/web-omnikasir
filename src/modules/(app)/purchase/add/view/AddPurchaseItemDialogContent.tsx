'use client';
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { BaseUtil } from "@/src/modules/shared/util/BaseUtil";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";

function AddPurchaseItemDialogContent() {
    const [sku, setSku] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productName, setProductName] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [productBrand, setProductBrand] = useState("");
    const [productQuantity, setProductQuantity] = useState("");

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Tambah Item</DialogTitle>
                <DialogDescription>
                    Tambahkan item baru ke dalam pembelian ini.
                </DialogDescription>
            </DialogHeader>

            <Separator />

            <form>
                <FieldGroup>
                    <Field>
                        <FieldLabel className="font-bold gap-0">SKU<span className="text-red-500">*</span></FieldLabel>
                        <div className="flex flex-row gap-2">
                            <Input
                                placeholder="Masukkan SKU"
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                            />
                            <Button
                                type="button"
                                size="icon"
                                onClick={() => {
                                    setProductName(`Produk dengan sku ${sku}`)
                                    setProductCategory(`Kategori ${sku}`)
                                    setProductBrand(`Merek ${sku}`)
                                }}
                            >
                                <IconSearch />
                            </Button>
                        </div>
                    </Field>

                    <Field>
                        <FieldLabel className="font-bold">Nama Produk</FieldLabel>
                        <Input
                            placeholder="Masukkan nama produk"
                            value={productName}
                            readOnly
                        />
                    </Field>

                    <div className="flex flex-row gap-2">
                        <Field>
                            <FieldLabel className="font-bold">Merek</FieldLabel>
                            <Input
                                placeholder="Masukkan merek"
                                value={productBrand}
                                readOnly
                            />
                        </Field>

                        <Field>
                            <FieldLabel className="font-bold">Kategori</FieldLabel>
                            <Input
                                placeholder="Masukkan kategori"
                                value={productCategory}
                                readOnly
                            />
                        </Field>
                    </div>

                    <div className="flex flex-row gap-2">
                        <Field>
                            <FieldLabel className="font-bold gap-0">Harga<span className="text-red-500">*</span></FieldLabel>
                            <InputGroup>
                                <InputGroupAddon>
                                    <InputGroupText className="font-bold">
                                        Rp
                                    </InputGroupText>
                                </InputGroupAddon>
                                <InputGroupInput
                                    placeholder="Masukkan harga satuan"
                                    value={productPrice}
                                    onChange={(e) => setProductPrice(e.target.value)}
                                    onBlur={(e) => setProductPrice(BaseUtil.formatNumberV2(parseFloat(e.target.value)))}
                                    onFocus={(e) => setProductPrice(BaseUtil.unformatNumberV2(e.target.value).toString())}
                                />
                            </InputGroup>
                        </Field>

                        <Field>
                            <FieldLabel className="font-bold gap-0">Jumlah<span className="text-red-500">*</span></FieldLabel>
                            <Input
                                placeholder="Masukkan jumlah"
                                value={productQuantity}
                                onChange={(e) => setProductQuantity(e.target.value)}
                            />
                        </Field>
                    </div>


                </FieldGroup>
            </form>

            <DialogFooter>
                <DialogClose asChild>
                    <Button>Tambah Item</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}

export default AddPurchaseItemDialogContent;