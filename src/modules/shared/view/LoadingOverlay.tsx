'use client'
import Image from "next/image"
import { createContext, useState } from "react"

export const LoadingOverlayContext = createContext<(showLoadingOverlay: boolean) => void>((_: boolean) => {})

export default function LoadingOverlay({children}: {children: React.ReactNode}) {
    const [showLoadingOverlay, setShowLoadingOverlay] = useState(false)

    return (
        <LoadingOverlayContext.Provider value = { setShowLoadingOverlay }>
          {
            showLoadingOverlay && 
            <div className="fixed flex justify-center items-center h-screen w-screen bg-black/30 z-[100]">
              <div className="rounded-lg bg-white flex justify-center items-center p-5 shadow">
                <Image 
                  src="/assets/loading-animation.gif"
                  alt="Loading indicator"
                  width={48}
                  height={48}
                />
              </div>
            </div>
          }
          {children}
        </LoadingOverlayContext.Provider>
    )
}