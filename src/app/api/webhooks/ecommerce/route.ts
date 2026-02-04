import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../../modules/shared/util/db"
import { pusherServer } from "@/src/modules/shared/util/pusher"
import { POST as createTransaction } from "@/src/app/api/transaction/route"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { externalOrderId, items } = body.data

    console.log(`📦 Relaying Online Order: ${externalOrderId}`)

    // 1. Random IMEI Logic: Match items with available IMEIs before hitting API
    const processedItems = await Promise.all(
      items.map(async (item: any) => {
        const product = await db.product.findUnique({
          where: { sku: item.sku },
        })

        if (!product) throw new Error(`Product not found: ${item.sku}`)

        // CHANGE: Use 'undefined' instead of 'null'
        let imeiCode = undefined

        if (product.isNeedImei) {
          const availableImei = await db.imei.findFirst({
            where: { sku: item.sku, isSold: false },
          })

          if (!availableImei) {
            throw new Error(`Insufficient IMEI stock for: ${item.sku}`)
          }
          imeiCode = availableImei.imei
        }

        return {
          sku: item.sku,
          quantity: item.qty,
          price: Number(product.sellingPrice),
          imeiCode: imeiCode, // Zod will now accept this as 'optional'
        }
      }),
    )
    // 2. Prepare the payload for your existing Transaction API
    const apiPayload = {
      customerId: "cust-002",
      paymentId: "pay-001",
      transactionMethod: "ONLINE",
      items: processedItems,
    }

    // 3. INTERNAL HIT: Pass the request AND headers (including your Admin Cookie)
    const internalReq = new NextRequest(new URL(req.url), {
      method: "ONLINE",
      headers: req.headers, // This sends your Admin cookie so Auth passes
      body: JSON.stringify(apiPayload),
    })

    // Execute your existing Transaction API POST function
    const apiResponse = await createTransaction(internalReq)
    const result = await apiResponse.json()

    // If the Transaction API returned an error (like 401 or 400)
    if (!result.success) {
      console.error("❌ Transaction API Error:", result.error)
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 },
      )
    }
    console.log("🔍 DEBUG ENV VARS:")
    console.log("Key:", process.env.PUSHER_KEY)
    console.log("Secret exists?", !!process.env.PUSHER_SECRET) // Should be true
    console.log("App ID:", process.env.PUSHER_APP_ID)
    await pusherServer.trigger("ONLINE_ECOMMERCE", "new-transaction", {
      message: "New Transaction!",
    })
    console.log("PUSHER_KEY:", process.env.PUSHER_KEY)
    return NextResponse.json({ success: true, id: externalOrderId })
  } catch (error: any) {
    console.error("Webhook Failed:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    )
  }
}
