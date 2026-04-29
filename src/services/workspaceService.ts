// Workspace Service
// -----------------
// Persists named "analytics workspaces" — a saved bundle of selected
// player IDs plus filter state — to IndexedDB, and supports encoding a
// workspace into a shareable URL parameter so the user can hand a link to
// a colleague and have them land on the same view.
import { db, type Workspace } from '@/lib/db'

// Filter shape stored alongside a workspace's player selection.
export interface WorkspaceFilters {
  season?: string
  team?: string
  venue?: string
  phase?: string
  seasonRange?: string
  teamFilter?: string
  venueFilter?: string
  phaseFilter?: string
  countryFilter?: string
  cappedFilter?: string
}

// Caller-facing payload (filters as a typed object; serialization happens here).
export interface WorkspaceInput {
  name: string
  playerIds: string[]
  filters: WorkspaceFilters
}

function now() {
  return new Date().toISOString()
}

export const workspaceService = {
  // Create a new workspace row. Returns its auto-incremented id.
  async saveWorkspace(input: WorkspaceInput): Promise<number> {
    const workspace: Workspace = {
      name: input.name,
      playerIds: input.playerIds,
      filters: JSON.stringify(input.filters),
      createdAt: now(),
      updatedAt: now(),
    }
    return db.workspaces.add(workspace)
  },

  // Load a workspace by id and parse its serialized filters.
  async loadWorkspace(id: number): Promise<(Workspace & { parsedFilters: WorkspaceFilters }) | undefined> {
    const ws = await db.workspaces.get(id)
    if (!ws) return undefined
    return { ...ws, parsedFilters: JSON.parse(ws.filters) as WorkspaceFilters }
  },

  // List all workspaces, most-recently-updated first.
  async listWorkspaces(): Promise<Workspace[]> {
    return db.workspaces.orderBy('updatedAt').reverse().toArray()
  },

  // Patch a workspace. Only provided fields are touched; updatedAt is bumped.
  async updateWorkspace(id: number, data: Partial<WorkspaceInput>): Promise<void> {
    const update: any = { updatedAt: now() }
    if (data.name !== undefined) update.name = data.name
    if (data.playerIds !== undefined) update.playerIds = data.playerIds
    if (data.filters !== undefined) update.filters = JSON.stringify(data.filters)
    await db.workspaces.update(id, update)
  },

  // Permanently delete a workspace.
  async deleteWorkspace(id: number): Promise<void> {
    await db.workspaces.delete(id)
  },

  // Build a shareable /analytics URL with the workspace state base64-encoded
  // into the `ws` query param. Round-trips with loadFromUrl().
  generateShareUrl(workspace: WorkspaceInput): string {
    const payload = {
      p: workspace.playerIds,
      f: workspace.filters,
    }
    const json = JSON.stringify(payload)
    const encoded = btoa(json)
    const url = new URL(window.location.href)
    url.pathname = '/analytics'
    url.search = ''
    url.searchParams.set('ws', encoded)
    return url.toString()
  },

  // Inverse of generateShareUrl. Returns null if the param is missing or
  // malformed so the caller can fall back to default state.
  loadFromUrl(searchParams: URLSearchParams): { playerIds: string[]; filters: WorkspaceFilters } | null {
    const encoded = searchParams.get('ws')
    if (!encoded) return null
    try {
      const json = atob(encoded)
      const payload = JSON.parse(json)
      return {
        playerIds: payload.p || [],
        filters: payload.f || {},
      }
    } catch {
      return null
    }
  },
}
