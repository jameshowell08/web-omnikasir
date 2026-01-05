"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { toast, Toaster } from "sonner"
import Pusher from "pusher-js"
import Routes from "../model/Routes"

export const TRANSACTION_CREATED_EVENT = "transaction-created"

export default function TransactionListener() {
  const pathname = usePathname()
  const pathnameRef = useRef(pathname)

  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  useEffect(() => {
    // 1. Safety Check: Ensure Keys Exist
    if (
      !process.env.NEXT_PUBLIC_PUSHER_KEY ||
      !process.env.NEXT_PUBLIC_PUSHER_CLUSTER
    ) {
      console.error("❌ Pusher Error: Missing Environment Variables!")
      return
    }

    // Enable Pusher logging to see detailed debug info in Console
    Pusher.logToConsole = true

    let pusher: Pusher | null = null

    try {
      console.log("🔌 Initializing Pusher...")

      pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      })

      // --- DEBUGGING: Listen for Connection Errors ---
      pusher.connection.bind("error", (err: any) => {
        console.error("❌ Pusher Connection Error:", err)
        // Optional: Show toast if connection fails completely
        // toast.error("Connection lost to notification server")
      })

      // --- DEBUGGING: Listen for State Changes (Connecting -> Connected) ---
      pusher.connection.bind("state_change", (states: any) => {
        console.log(`📡 Pusher State: ${states.current}`, states)
      })

      // 2. Subscribe
      const channel = pusher.subscribe("ONLINE_ECOMMERCE")

      // --- DEBUGGING: Listen for Subscription Success/Fail ---
      channel.bind("pusher:subscription_succeeded", () => {
        console.log("✅ Successfully subscribed to ONLINE_ECOMMERCE")
      })

      channel.bind("pusher:subscription_error", (status: any) => {
        console.error("❌ Subscription Error (Auth?):", status)
      })

      // 3. Bind to Event
      channel.bind("new-transaction", (data: any) => {
        console.log("🔔 WebSocket Event Received:", data)

        try {
          // A. Logic to refresh table
          if (pathnameRef.current === Routes.SALES.DEFAULT) {
            window.dispatchEvent(new Event(TRANSACTION_CREATED_EVENT))
            console.log("🔄 UI Refresh Triggered")
          }

          // B. UI Notification
          toast.success("Transaksi Online Masuk!", {
            description: data.message,
          })
        } catch (innerError) {
          console.error("❌ Error inside event handler:", innerError)
        }
      })
    } catch (error) {
      console.error("❌ Critical Pusher Setup Error:", error)
    }

    // 4. Cleanup
    return () => {
      if (pusher) {
        console.log("🔌 Disconnecting Pusher...")
        pusher.unsubscribe("ONLINE_ECOMMERCE")
        pusher.disconnect()
      }
    }
  }, [])

  return <Toaster position="top-right" />
}
