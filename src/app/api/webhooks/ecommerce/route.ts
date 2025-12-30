import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../../modules/shared/util/db"
import { transactionStream } from "@/src/modules/shared/util/stream"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // 1. Basic Validation (Check if it's the right event)
    // if (body.event !== "ONLINE_ORDER_CREATED") {
    //   return NextResponse.json({ message: "Ignored event" }, { status: 200 })
    // }

    const { externalOrderId, items } = body.data

    console.log(`📦 Processing Online Order: ${externalOrderId}`)
    console.log("📥 Received Webhook Body:", JSON.stringify(body, null, 2))

    // 2. Run Database Transaction
    await db.$transaction(async (tx) => {
      // A. Generate Transaction ID (Reuse your sequence logic or specialized one)
      let seqRecord = await tx.seqNo.findUnique({
        where: { name: "TRANSACTION" },
      })
      if (!seqRecord) {
        seqRecord = await tx.seqNo.create({
          data: { name: "TRANSACTION", format: "TRX-", seqno: 0 },
        })
      }
      const nextSeq = seqRecord.seqno + 1
      const trxId = `${seqRecord.format}${String(nextSeq).padStart(5, "0")}`

      await tx.seqNo.update({
        where: { name: "TRANSACTION" },
        data: { seqno: nextSeq },
      })

      // B. Create Transaction Header (Method = ECOMMERCE)
      // Note: You might need a dummy "Online User" ID or make createdById optional/nullable if system generated
      // For now, assuming you have a system user or using the first admin
      const systemUser = await tx.users.findFirst({ where: { role: "ADMIN" } })

      const header = await tx.transactionHeader.create({
        data: {
          transactionHeaderId: trxId,
          transactionDate: new Date(),
          transactionMethod: "ONLINE", // <--- Mark as Online
          customerId: "cust-002", // Could map to a customer if you store them
          status: "SUCCESS",
          paymentId: "pay-001", // Ensure you have a generic online payment method in DB
          userId: systemUser?.userId || "SYSTEM",
          createdById: systemUser?.userId || "SYSTEM",
          // Map mock customer data if you want, or leave null
        },
      })

      // C. Process Items & Deduct Stock
      for (const item of items) {
        // Check Stock
        const product = await tx.product.findUnique({
          where: { sku: item.sku },
        })
        if (!product || product.quantity < item.qty) {
          throw new Error(`Online Order Error: OOS for ${item.sku}`)
        }

        // Handle IMEI if needed (Mockoon must send specific IMEI if product requires it)
        if (item.imei) {
          await tx.imei.update({
            where: { imei: item.imei },
            data: { isSold: true },
          })
        }

        // Create Detail
        await tx.transactionDetail.create({
          data: {
            transactionHeaderId: header.transactionHeaderId,
            sku: item.sku,
            quantity: item.qty,
            price: product.sellingPrice, // Use current price or price from webhook
            imeiCode: item.imei || null,
          },
        })

        // Update Product Quantity
        await tx.product.update({
          where: { sku: item.sku },
          data: { quantity: { decrement: item.qty } },
        })
      }
    })
    transactionStream.emit("new-transaction", "Transaksi online telah dibuat.")
    return NextResponse.json({ success: true, id: externalOrderId })
  } catch (error: any) {
    console.error("Webhook Failed:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
