/**
 * FILE: types/index.ts
 * PURPOSE: Mirror of web src/types/index.ts. Trimmed to the fields the mobile
 *   app reads — full-shape parity with web is a post-launch refactor (we plan
 *   to lift this into a shared `@roavia/types` package once the monorepo
 *   restructure lands).
 * USED BY: every mobile screen and hook
 * IF SOMETHING BREAKS HERE: confirm the field names match the web types
 *   exactly. Renaming `lat`→`latitude` here would silently break Supabase
 *   queries that select `lat`.
 */

export interface Place {
  id: string
  name: string
  slug: string | null
  lat: number
  lng: number
  description: string | null
  category: string | null
  tier: 'essential' | 'beloved' | 'gem' | null
  price_range: '$' | '$$' | '$$$' | '$$$$' | null
  address: string | null
  neighborhood: string | null
  city: string | null
  photo_url: string | null
}

export interface Collection {
  id: string
  name: string
  slug: string
  position: number
  is_default: boolean
}

export interface SavedPlace {
  id: string
  place_id: string
  saved_at: string
  collection: Collection | null
  place: Place | null
}
