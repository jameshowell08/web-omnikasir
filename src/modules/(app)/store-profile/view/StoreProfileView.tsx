import Image from "next/image";

function StoreProfileView() {
    return (
        <>
            <h1 className="text-2xl font-bold mb-6">Profil Toko</h1>
            <div className="flex justify-between items-center bg-black rounded-lg p-3">
                <h2 className="text-white text-lg font-bold">Profil Toko</h2>
                <span className="material-symbols-rounded filled text-white p-2 select-none rounded-lg hover:bg-white/20">edit</span>
            </div>
            <div className="flex flex-row mt-6">
                <Image
                    className="border border-black rounded-lg"
                    src="/assets/placeholder-image.png"
                    alt="Logo Toko"
                    width={240}
                    height={240}
                />
                <div className="flex flex-col gap-3 ml-6 justify-center">
                    <div>
                        <h5 className="text-xs">Nama Toko</h5>
                        <p className="font-bold text-lg">Toko Pelita Literasi</p>
                    </div>

                    <div>
                        <h5 className="text-xs">Kontak Toko</h5>
                        <p className="font-bold text-lg">+62 812 3456 7890</p>
                    </div>

                    <div>
                        <h5 className="text-xs">Alamat Toko</h5>
                        <p className="font-bold text-lg">Jl. Boulevard Palem Raya 15810, Klp. Dua, Kecamatan Kelapa Dua, Kabupaten Tangerang, Banten 15810</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StoreProfileView;