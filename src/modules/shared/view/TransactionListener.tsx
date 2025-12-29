"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import toast from "react-hot-toast"
import Routes from "../model/Routes"

export const TRANSACTION_CREATED_EVENT = "transaction-created"

export default function TransactionListener() {
    const pathname = usePathname()

    useEffect(() => {
        const eventSource = new EventSource("/api/sse")

        eventSource.onmessage = (event) => {
            try {
                const parsedData = JSON.parse(event.data)

                if (parsedData.type === "connected") {
                    console.log("SSE Connected")
                    return
                }

                if (parsedData.type === "transaction") {
                    // If we are on the sales page, we dispatch an event to refresh the table
                    // Otherwise show a toast
                    if (pathname === Routes.SALES.DEFAULT) {
                        window.dispatchEvent(new Event(TRANSACTION_CREATED_EVENT))
                    } else {
                        toast.success(parsedData.content)
                    }
                }
            } catch (error) {
                console.error("Error parsing SSE data", error)
            }
        }

        eventSource.onerror = (error) => {
            console.error("SSE Error:", error)
            eventSource.close()
        }

        return () => {
            eventSource.close()
        }
    }, [pathname])

    return null
}
