// Watchlist Service
// -----------------
// Thin CRUD layer over the IndexedDB `watchlist` table. Lets users star
// players to follow and optionally annotate them with notes. Used via the
// useWatchlist / useToggleWatchlist hooks.
import { db, type WatchlistEntry } from '@/lib/db'

export const watchlistService = {
  // Add a player to the watchlist. Idempotent — re-adding an existing
  // player is a no-op (returns the existing row's id).
  async addToWatchlist(playerId: string, playerName: string, notes?: string): Promise<number> {
    const existing = await db.watchlist.where('playerId').equals(playerId).first()
    if (existing) return existing.id!
    return db.watchlist.add({
      playerId,
      playerName,
      notes: notes || '',
      addedAt: new Date().toISOString(),
    })
  },

  // Unstar a player. Safe to call even if the player isn't in the list.
  async removeFromWatchlist(playerId: string): Promise<void> {
    await db.watchlist.where('playerId').equals(playerId).delete()
  },

  // List all watchlist entries, newest first.
  async getWatchlist(): Promise<WatchlistEntry[]> {
    return db.watchlist.orderBy('addedAt').reverse().toArray()
  },

  // Quick "is this player starred?" check used by the toggle button.
  async isInWatchlist(playerId: string): Promise<boolean> {
    const count = await db.watchlist.where('playerId').equals(playerId).count()
    return count > 0
  },

  // Replace the notes field on a watchlist entry.
  async updateNotes(playerId: string, notes: string): Promise<void> {
    const entry = await db.watchlist.where('playerId').equals(playerId).first()
    if (entry?.id) {
      await db.watchlist.update(entry.id, { notes })
    }
  },
}
