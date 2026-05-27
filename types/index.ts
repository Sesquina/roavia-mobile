/**
 * FILE: types/index.ts
 * PURPOSE: Shared TypeScript types for the Roavia mobile app.
 * DEPENDS ON: Nothing. Pure type definitions.
 * USED BY: All screens, components, and API calls.
 * IF SOMETHING BREAKS HERE: The web types/index.ts is the source of truth.
 *   This file must mirror it exactly. Check for drift.
 */

// ============================================================
// PLACE — mirrors web src/types/index.ts exactly
// Both codebases query the same Supabase database.
// Any field added to web must be added here simultaneously.
// ============================================================

export type PlaceTier = 'essential' | 'beloved' | 'gem' | null;
// Note: DB stores 'gem'. UI displays 'Worth the detour.' Never show 'gem' to users.

export type PlaceCategory =
  | 'food_and_drink'
  | 'bars_and_nightlife'
  | 'culture_and_arts'
  | 'music_and_live_performance'
  | 'outdoors_and_nature'
  | 'markets_and_shopping'
  | 'wellness'
  | 'events_and_happenings';

export interface Place {
  id: string;
  map_id: string;
  name: string;
  slug: string | null;
  description: string | null;
  category: PlaceCategory | null;
  subcategory: string | null;
  lat: number;           // ALWAYS lat. Never latitude.
  lng: number;           // ALWAYS lng. Never longitude.
  address: string | null;
  city: string | null;
  country: string | null;
  tier: PlaceTier;
  emoji: string | null;
  hours: Record<string, string> | null;
  price_level: number | null;
  phone: string | null;
  website: string | null;
  photo_urls: string[] | null;
  identity_tags: string[] | null;
  vibe_tags: string[] | null;
  scene_tags: string[] | null;
  dietary_tags: string[] | null;
  is_open_now: boolean | null;
  is_open_late: boolean | null;
  is_happening_now: boolean | null;
  is_featured: boolean | null;
  is_verified: boolean | null;
  is_bookable: boolean | null;
  pride_special: boolean | null;
  source: string | null;
  google_place_id: string | null;
  cached_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// MAP
// Note: The maps table has NO map_type column. Never query it.
// ============================================================

export interface RoaviaMap {
  id: string;
  name: string;
  description: string | null;
  city: string | null;
  center_lat: number | null;
  center_lng: number | null;
  default_zoom: number | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// AUTH / USER
// ============================================================

export type UserRole =
  | 'traveler'
  | 'vendor'
  | 'community_curator'
  | 'pro_curator'
  | 'admin';

export interface UserProfile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  home_city: string | null;
  home_lat: number | null;
  home_lng: number | null;
  roles: UserRole[];
  onboarding_completed: boolean;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// SAVES
// ============================================================

export type CollectionType = 'radar' | 'tried_it' | 'loved_it' | 'custom';

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  type: CollectionType;
  is_default: boolean;
  created_at: string;
}

export interface SavedPlace {
  id: string;
  user_id: string;
  place_id: string;
  collection_id: string;
  occasion_tag: string | null;
  created_at: string;
  place?: Place;
}

// ============================================================
// FILTERS
// ============================================================

export interface ActiveFilters {
  categories: PlaceCategory[];
  tiers: PlaceTier[];
  when: ('open_now' | 'tonight' | 'this_weekend' | 'today_only')[];
  budget: ('free' | 'under_15' | '15_to_40' | '40_to_100' | 'splurge')[];
  practical: string[];
  dietary: string[];
  welcoming: ('lgbtq' | 'bipoc')[];
  curatorMapId: string | null;
}

export const emptyFilters: ActiveFilters = {
  categories: [],
  tiers: [],
  when: [],
  budget: [],
  practical: [],
  dietary: [],
  welcoming: [],
  curatorMapId: null,
};

// ============================================================
// INTERACTIONS (behavioral graph)
// ============================================================

export type InteractionAction =
  | 'filter_tap'
  | 'marker_tap'
  | 'place_card_open'
  | 'save'
  | 'direction_click'
  | 'share'
  | 'booking'
  | 'trip_stop_add'
  | 'curator_map_load'
  | 'community_note_written';

export interface Interaction {
  user_id: string;
  place_id: string | null;
  action: InteractionAction;
  active_filters: ActiveFilters;
  metadata: Record<string, unknown> | null;
  created_at: string;
}
