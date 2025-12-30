"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { toast, Toaster } from "sonner"
import Routes from "../model/Routes"

export const TRANSACTION_CREATED_EVENT = "transaction-created"

export default function TransactionListener() {
    const pathname = usePathname()
    const pathnameRef = useRef(pathname)

    // Keep the ref updated with the current pathname
    useEffect(() => {
        pathnameRef.current = pathname
    }, [pathname])

    useEffect(() => {
        const eventSource = new EventSource("/api/sse")

        eventSource.onopen = () => {
            console.log("SSE Connected")
        }

        eventSource.onmessage = (event) => {
            try {
                const parsedData = JSON.parse(event.data)

                if (parsedData.type === "connected") {
                    console.log("SSE Initialized")
                    return
                }

                if (parsedData.type === "transaction") {
                    // Check the current pathname using the ref
                    if (pathnameRef.current === Routes.SALES.DEFAULT) {
                        window.dispatchEvent(new Event(TRANSACTION_CREATED_EVENT))
                    }

                    toast.success("Transaksi online masuk!", {
                        description: parsedData.content
                    })
                }
            } catch (error) {
                console.error("Error parsing SSE data", error)
            }
        }

        eventSource.onerror = (error) => {
            // Only log if it's not a normal closure or if we really want to debug
            // readyState 0: connecting, 1: open, 2: closed
            console.error("SSE Error:", error, "readyState:", eventSource.readyState)
            eventSource.close()
        }

        return () => {
            eventSource.close()
        }
    }, []) // Empty dependency array ensures connection is created once

    return <Toaster position="top-right" />
}
