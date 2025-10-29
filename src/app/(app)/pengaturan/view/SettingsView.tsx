import { useState } from "react";
import TextField from "../../components/TextField";

function SettingsView() {

    const [storeName, setStoreName] = useState("")

    return (
        <div className="w-full h-full flex flex-col">
            <header className="w-full h-fit p-4 flex justify-center bg-off-black text-white font-bold">
                Pengaturan
            </header>
            <div className="p-8">
                <p className="font-bold text-xl">Profil Toko</p>
                <TextField label="Nama Toko" placeholder="testing" value={storeName} onChange={ e => {setStoreName(e.target.value)} } error={storeName === "" ? "Nama Toko tidak boleh kosong" : ""} type="text"/>
                
            </div>
        </div>
    )
}

export default SettingsView;