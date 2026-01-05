// app/api/sse/route.ts
import { NextRequest } from "next/server"
import { transactionStream } from "../../../modules/shared/util/stream"

export const runtime = "edge" // Must be nodejs to use EventEmitter

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      // Send initial connection message
      const initData = `data: ${JSON.stringify({ type: "connected" })}\n\n`
      controller.enqueue(encoder.encode(initData))

      // Define the listener function
      const onNewTransaction = (data: any) => {
        const payload = JSON.stringify({
          type: "transaction",
          content: data,
        })
        // Write to the stream
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`))
      }

      // Subscribe to the event
      transactionStream.on("new-transaction", onNewTransaction)

      // Cleanup when the connection closes
      request.signal.addEventListener("abort", () => {
        transactionStream.off("new-transaction", onNewTransaction)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
