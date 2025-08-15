export default class SettingsController {
    constructor() {}

    public static async fetchStoreProfile(id: string): Promise<{
        storeName: string,
        address: string,
        phoneNumber: string,
        profilePictureUrl: string
    }> {
        return await fetch("/api/store/get/" + id).then((res) => res.json());
    }

    public static isEquals<T extends Record<string, string | undefined>>(obj1: T, obj2: T) {
        return Object.keys(obj1).every((key) => obj1[key] === obj2[key]);
    }
}