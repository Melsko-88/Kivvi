import { db } from './index'

const SYNC_TABLES = ['sales', 'products', 'clients', 'debts', 'debtPayments'] as const
const RETRY_INTERVAL = 30_000
const LAST_SYNC_KEY = 'kivvi-last-sync'

let retryTimer: ReturnType<typeof setInterval> | null = null

function getLastSync(): string {
  if (typeof window === 'undefined') return new Date(0).toISOString()
  return localStorage.getItem(LAST_SYNC_KEY) || new Date(0).toISOString()
}

function setLastSync(ts: string) {
  if (typeof window !== 'undefined') localStorage.setItem(LAST_SYNC_KEY, ts)
}

async function pushUnsynced(): Promise<number> {
  const payload: Record<string, unknown[]> = {}
  let totalPushed = 0

  for (const table of SYNC_TABLES) {
    const unsynced = await (db[table] as ReturnType<typeof db.table>)
      .where('synced')
      .equals(0)
      .toArray()

    if (unsynced.length > 0) {
      payload[table] = unsynced
      totalPushed += unsynced.length
    }
  }

  if (totalPushed === 0) return 0

  const res = await fetch('/api/sync/push', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error('Push sync failed')

  const { syncedIds } = await res.json()

  for (const table of SYNC_TABLES) {
    const ids: string[] = syncedIds[table] || []
    if (ids.length > 0) {
      await (db[table] as ReturnType<typeof db.table>)
        .where('local_id')
        .anyOf(ids)
        .modify({ synced: true })
    }
  }

  return totalPushed
}

async function pullChanges(): Promise<number> {
  const since = getLastSync()

  const res = await fetch(`/api/sync/pull?since=${encodeURIComponent(since)}`)
  if (!res.ok) throw new Error('Pull sync failed')

  const data = await res.json()
  let totalPulled = 0

  for (const table of SYNC_TABLES) {
    const records: Array<{ local_id: string; [key: string]: unknown }> = data[table] || []
    if (records.length === 0) continue

    for (const record of records) {
      const existing = await (db[table] as ReturnType<typeof db.table>)
        .where('local_id')
        .equals(record.local_id)
        .first()

      if (existing) {
        await (db[table] as ReturnType<typeof db.table>).update(record.local_id, {
          ...record,
          synced: true,
        })
      } else {
        await (db[table] as ReturnType<typeof db.table>).put({
          ...record,
          synced: true,
        })
      }
    }

    totalPulled += records.length
  }

  setLastSync(new Date().toISOString())
  return totalPulled
}

export async function syncAll(): Promise<{ pushed: number; pulled: number }> {
  const pulled = await pullChanges()
  const pushed = await pushUnsynced()
  return { pushed, pulled }
}

export async function getUnsyncedCount(): Promise<number> {
  let total = 0
  for (const table of SYNC_TABLES) {
    total += await (db[table] as ReturnType<typeof db.table>)
      .where('synced')
      .equals(0)
      .count()
  }
  return total
}

export function startPeriodicSync() {
  if (retryTimer) return

  retryTimer = setInterval(async () => {
    const count = await getUnsyncedCount()
    if (count > 0) {
      try {
        await pushUnsynced()
      } catch {
        // will retry next interval
      }
    }
  }, RETRY_INTERVAL)
}

export function stopPeriodicSync() {
  if (retryTimer) {
    clearInterval(retryTimer)
    retryTimer = null
  }
}

export function triggerBackgroundSync() {
  pushUnsynced().catch(() => {})
}
