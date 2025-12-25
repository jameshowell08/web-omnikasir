// Define the Mockoon URL (Inventory Update Endpoint)
const MOCKOON_API_URL =
  process.env.MOCKOON_URL || "http://localhost:3001/api/v1/inventory/sync"

export const SyncService = {
  /**
   * Sends sales data to Mockoon so the "Online Store" knows stock has dropped.
   * We fire-and-forget this so the POS UI stays fast.
   */
  async notifyEcommerce(transactionId: string, items: any[]) {
    try {
      // Transform your data to a generic event format
      const payload = {
        event: "POS_SALE",
        transactionId: transactionId,
        timestamp: new Date().toISOString(),
        items: items.map((item) => ({
          sku: item.sku,
          qty: item.quantity,
          imei: item.imeiCode || null,
        })),
      }

      // Send to Mockoon (don't await strictly if you want speed, but logging is good)
      fetch(MOCKOON_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((err) => console.error("⚠️ Background Sync Error:", err))
    } catch (error) {
      console.error("Failed to prepare sync payload", error)
    }
  },
}
