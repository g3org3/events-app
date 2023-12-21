import { DateTime } from "luxon";

export function isDateInTheFuture(utcdate?: string | null) {
  if (!utcdate) return false

  // utc date in SQL 2023-12-01 01:02:00
  const now = DateTime.now()
  const utc = DateTime.fromSQL(utcdate)

  const x = now.diff(utc).toMillis()

  return x < 0
}
