import { FormEvent, useEffect, useMemo, useState } from "react";
import TextField from "../../components/TextField";
import Image from "next/image";
import LoadingOverlay from "../../components/LoadingOverlay";
import SettingsController from "../controller/SettingsController";

function SettingsView() {
    const [isLoading, setIsLoading] = useState(true)
    const [initialFormData, setInitialFormData] = useState<
        {
            storeName: string,
            address: string,
            phoneNumber: string,
            profilePictureUrl?: string
        }
    >({
        storeName: "",
        address: "",
        phoneNumber: ""
    })
    const [formData, setFormData] = useState<
        {
            storeName: string,
            address: string,
            phoneNumber: string,
            profilePictureUrl?: string
        }
    >({
        storeName: "",
        address: "",
        phoneNumber: ""
    })
    const saved = useMemo(() => SettingsController.isEquals(initialFormData, formData), [initialFormData, formData])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // stop page reload
        console.log(JSON.stringify(formData)); // handle success/fail here
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        setIsLoading(true)
        SettingsController.fetchStoreProfile("dummy-store-1").then((data) => {
            setInitialFormData(data)
            setFormData(data)
            setIsLoading(false)
        })
    }, [])

    return (
        <div className="w-full h-full">
            <div className="w-full h-full flex flex-col">
                <header className="w-full h-fit p-4 flex justify-center bg-off-black text-white font-bold">
                    Pengaturan
                </header>
                <div className="p-8">
                    <p className="font-bold text-xl">Profil Toko</p>

                    <div className="flex flex-row w-full">
                        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
                            <div className="flex flex-row py-4">
                                <label className="min-w-32" htmlFor="storeName">
                                    Nama Toko<span className="text-red-500">*</span>
                                </label>

                                <TextField
                                    name="storeName"
                                    placeholder="Nama Toko"
                                    value={formData.storeName}
                                    onChange={handleChange}
                                    error={!isLoading && formData.storeName === "" ? "Nama Toko tidak boleh kosong" : ""}
                                    type="text"
                                />
                            </div>

                            <div className="flex flex-row py-4">
                                <label className="min-w-32" htmlFor="address">
                                    Alamat<span className="text-red-500">*</span>
                                </label>

                                <TextField
                                    name="address"
                                    placeholder="Alamat"
                                    value={formData.address}
                                    onChange={handleChange}
                                    error={!isLoading && formData.address === "" ? "Alamat tidak boleh kosong" : ""}
                                    type="text"
                                />
                            </div>

                            <div className="flex flex-row py-4">
                                <label className="min-w-32" htmlFor="phoneNumber">
                                    No. Telepon<span className="text-red-500">*</span>
                                </label>

                                <TextField
                                    name="phoneNumber"
                                    placeholder="No. Telepon"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    error={!isLoading && formData.phoneNumber === "" ? "No. Telepon tidak boleh kosong" : ""}
                                    type="text"
                                />
                            </div>

                            <button
                                type="submit"
                                className="ml-auto py-2 px-4 text-white rounded-md bg-black cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                disabled={saved}
                            >
                                {saved ? "Tersimpan" : "Simpan"}
                            </button>
                        </form>

                        <div className="flex flex-col justify-center ml-8">
                            <div className="relative h-48 aspect-square bg-light-gray rounded-md">
                                <Image
                                    src={formData.profilePictureUrl ?? "/assets/logo-omnikasir.png"}
                                    fill
                                    unoptimized
                                    className="object-contain"
                                    alt="logo toko"
                                />
                            </div>

                            <button
                                type="button"
                                className="bg-off-black text-white mt-4 px-4 py-2 rounded-md cursor-pointer"
                                onClick={() => { console.log("Upload logo clicked") }}
                            >
                                Upload Logo Toko
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <LoadingOverlay isLoading={isLoading} />
        </div>
    )
}

export default SettingsView;