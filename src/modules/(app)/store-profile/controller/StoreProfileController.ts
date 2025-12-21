import Routes from "@/src/modules/shared/model/Routes";
import { StoreProfileFormSchemeType } from "../model/StoreProfileFormScheme";

class StoreProfileController {
    private static base64ToFile(base64String: string, filename: string): File {
        const arr = base64String.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    private static fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    }

    public static async getStoreProfile(): Promise<[boolean, StoreProfileFormSchemeType | undefined, string]> {
        try {
            const res = await fetch(Routes.STORE_PROFILE_API.GET, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const data = await res.json()
            let errorMessage = ""
            let storeProfile: StoreProfileFormSchemeType | undefined = undefined

            if (res.ok) {
                storeProfile = {
                    storeImage: this.base64ToFile(data.profilePicture, "store-profile.png"),
                    storeName: data.nama,
                    storePhone: data.noHp,
                    storeAddress: data.alamat,
                }
            } else {
                errorMessage = data.message || "Gagal mengambil profil toko."
            }

            return [res.ok, storeProfile, errorMessage]
        } catch (e) {
            return [false, undefined, "Terjadi kesalahan."]
        }
    }

    public static async updateStoreProfile(data: StoreProfileFormSchemeType): Promise<[boolean, string]> {
        try {
            let base64Image = "";
            if (data.storeImage instanceof File) {
                base64Image = await StoreProfileController.fileToBase64(data.storeImage);
            }

            const res = await fetch(Routes.STORE_PROFILE_API.UPDATE, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nama: data.storeName,
                    alamat: data.storeAddress,
                    noHp: data.storePhone,
                    profilePicture: base64Image
                })
            })

            const responseData = await res.json();
            if (res.ok) {
                return [true, ""];
            } else {
                return [false, responseData.error || "Gagal memperbarui profil toko."];
            }
        } catch (error) {
            return [false, "Terjadi kesalahan saat memperbarui profil."];
        }
    }
}

export default StoreProfileController;