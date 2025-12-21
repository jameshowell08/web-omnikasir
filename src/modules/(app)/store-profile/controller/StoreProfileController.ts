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
        } catch(e) {
            return [false, undefined, "Terjadi kesalahan."]
        }
    }
}

export default StoreProfileController;