// lib/stream.ts
import { EventEmitter } from "events"

declare global {
  var transactionEmitter: EventEmitter | undefined
}

// Check if we already have an emitter (prevents resetting on hot-reloads in dev)
const emitter = global.transactionEmitter || new EventEmitter()

if (process.env.NODE_ENV !== "production") {
  global.transactionEmitter = emitter
}

export const transactionStream = emitter
