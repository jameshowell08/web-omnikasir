'use client';
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { StoreProfileFormScheme } from "../model/StoreProfileFormScheme";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { LoadingOverlayContext } from "@/src/modules/shared/view/LoadingOverlay";
import StoreProfileController from "../controller/StoreProfileController";
import toast from "react-hot-toast";
import { IconEdit } from "@tabler/icons-react";

function StoreProfileHeader() {
    return (
        <div>
            <h1 className="text-2xl font-bold">Profil toko</h1>
        </div>
    )
}

function StoreProfileForm({ storeProfile, refreshData }: { storeProfile: z.infer<typeof StoreProfileFormScheme> | undefined, refreshData: () => void }) {
    const showLoadingOverlay = useContext(LoadingOverlayContext);
    const [isEditMode, setIsEditMode] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const form = useForm({
        resolver: zodResolver(StoreProfileFormScheme),
        values: storeProfile,
        defaultValues: {
            storeImage: undefined,
            storeName: "",
            storePhone: "",
            storeAddress: "",
        }
    })

    const handleSubmit = async (data: z.infer<typeof StoreProfileFormScheme>) => {
        showLoadingOverlay(true)
        const [isSuccess, errorMessage] = await StoreProfileController.updateStoreProfile(data);
        if (isSuccess) {
            setIsEditMode(false)
            refreshData()
        } else {
            toast.error(errorMessage)
        }
        showLoadingOverlay(false)
    }

    const cancelEdit = () => {
        setIsEditMode(false)
        form.reset(storeProfile)
    }

    return (
        <form className="mt-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <FieldGroup className="flex flex-row items-center">
                <Controller
                    name="storeImage"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field className="w-fit" data-invalid={fieldState.invalid}>
                            <span className="rounded-lg overflow-clip" aria-invalid={fieldState.invalid}>
                                <Image
                                    src={field.value instanceof File ? URL.createObjectURL(field.value) : "/assets/placeholder-image.png"}
                                    alt="Logo toko"
                                    width={300}
                                    height={300}
                                    className="aspect-square object-contain"
                                />
                            </span>
                            {
                                isEditMode && (
                                    <Button variant="outline" type="button" aria-invalid={fieldState.invalid} onClick={() => fileInputRef.current?.click()}>Ubah Logo</Button>
                                )
                            }
                            <Input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                accept="image/*"
                                disabled={!isEditMode}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        field.onChange(file);
                                    }
                                }}
                            />
                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />

                <div className="flex flex-col flex-1 gap-4">
                    <Controller
                        name="storeName"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="gap-0 font-bold">Nama toko <span className="text-red-500">*</span></FieldLabel>
                                <Input
                                    type="text"
                                    disabled={!isEditMode}
                                    placeholder="Nama toko"
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />

                    <Controller
                        name="storePhone"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="gap-0 font-bold">Nomor telepon <span className="text-red-500">*</span></FieldLabel>
                                <FieldDescription>Dimulai dari angka setelah &apos;0&apos;. Contoh: 081234567890 ditulis menjadi 81234567890</FieldDescription>
                                <InputGroup>
                                    <InputGroupAddon>
                                        <InputGroupText>+62</InputGroupText>
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        placeholder="Nomor telepon"
                                        disabled={!isEditMode}
                                        value={field.value}
                                        onChange={(e) => {
                                            field.onChange(e.target.value.replace(/[^0-9]/g, ""))
                                        }}
                                        aria-invalid={fieldState.invalid}
                                    />
                                </InputGroup>
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />

                    <Controller
                        name="storeAddress"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="gap-0 font-bold">Alamat <span className="text-red-500">*</span></FieldLabel>
                                <Textarea
                                    disabled={!isEditMode}
                                    placeholder="Alamat"
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />

                    {
                        isEditMode ? (
                            <div className="flex flex-row justify-end gap-2">
                                <Button variant="outline" type="button" onClick={cancelEdit}>
                                    Batal
                                </Button>
                                <Button type="submit">
                                    Simpan
                                </Button>
                            </div>
                        ) : (
                            <Button type="button" className="self-end" onClick={() => setIsEditMode(true)}>
                                <IconEdit />
                                Ubah
                            </Button>
                        )
                    }
                </div>
            </FieldGroup>
        </form>
    )
}

function StoreProfileView() {
    const showLoadingOverlay = useContext(LoadingOverlayContext);
    const [storeProfile, setStoreProfile] = useState<z.infer<typeof StoreProfileFormScheme> | undefined>(undefined)

    const fetchStoreProfileData = useCallback(async () => {
        showLoadingOverlay(true)
        const [success, storeProfile, errorMessage] = await StoreProfileController.getStoreProfile()

        if (success) {
            setStoreProfile(storeProfile)
        } else {
            toast.error(errorMessage)
        }

        showLoadingOverlay(false)
    }, [showLoadingOverlay])

    useEffect(() => {
        fetchStoreProfileData()
    }, [fetchStoreProfileData])

    return (
        <div>
            <StoreProfileHeader />
            <StoreProfileForm storeProfile={storeProfile} refreshData={() => fetchStoreProfileData()} />
        </div>
    )
}

export default StoreProfileView;