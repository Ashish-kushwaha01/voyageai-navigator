import { v4 as uuidv4 } from 'uuid';
import { isUUID } from './utils'; // Import isUUID utility
import { getSupabase } from './supabase'; // Import getSupabase

/**
 * n8n Webhook Integration Layer
 * All business logic flows through n8n webhooks.
 * Fallback mock data is returned if webhooks fail.
 */

const N8N_BASE_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "https://voyageai.app.n8n.cloud/webhook";

interface WebhookOptions {
  timeout?: number;
  retries?: number;
}

async function callWebhook<T>(
  path: string,
  payload: Record<string, unknown>,
  fallback: T,
  options: WebhookOptions = {}
): Promise<{ data: T; isMock: boolean }> {
  const { timeout = 8000, retries = 2 } = options;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);

      const res = await fetch(`${N8N_BASE_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!res.ok) throw new Error(`Webhook returned ${res.status}`);
      const data = await res.json();
      return { data: data as T, isMock: false };
    } catch (err) {
      console.warn(`Webhook ${path} attempt ${attempt + 1} failed:`, err);
      if (attempt === retries) {
        console.info("Returning fallback mock data");
        return { data: fallback, isMock: true };
      }
    }
  }

  return { data: fallback, isMock: true };
}

// ── Explore Places ──
export interface Place {
  id: string; // This will now be the UUID of the history/bookmark record
  place_id: string; // This will be the actual YouTube video ID
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  videoId?: string;
  rating: number;
  category: string;
  moreInfo?: string;
  location?: {
    name: string;
    lat: number;
    lng: number;
  };
  viewedAt?: number; // Timestamp for history tracking
  historyId?: string; // New: To link a Place to a HistoryItem's UUID
}

// New interface for the search webhook response
export interface LocationSearchResponse {
  youtube_video_id: string;
  title: string;
  image: string;
  description: string;
  more_info: string;
  category?: string; // Add category field
  location?: {
    name: string;
    lat: number;
    lng: number;
  };
}

// Modify fetchPlaces to use the new search webhook when a query is present
export async function fetchPlaces(options: { query?: string; placeId?: string }): Promise<{ data: Place[]; isMock: boolean }> {
  const { query, placeId } = options;
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL + "/search"; // Use the existing search webhook
  let payload: Record<string, unknown>;

  if (placeId) {
    // If placeId is provided, send it as 'id' to the webhook for n8n to handle the lookup
    payload = { id: placeId };
  } else if (query) {
    // If there's a search query, send it as 'location'
    payload = { location: query };
  } else {
    return { data: [], isMock: false };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Webhook returned ${res.status}`);
    }

    const responseText = await res.text();
    let data: LocationSearchResponse | LocationSearchResponse[];
    try {
      data = JSON.parse(responseText);
      console.log("Webhook raw parsed data for placeId/query:", data); // DEBUG LOG
    } catch (jsonError) {
      console.error("Failed to parse JSON response from webhook:", jsonError);
      console.error("Raw response text:", responseText);
      return { data: [], isMock: true };
    }

    let placesData: Place[] = [];
    if (Array.isArray(data)) {
      placesData = data.map(item => ({
        id: placeId && isUUID(placeId) ? placeId : uuidv4(), // Use provided placeId if it's a UUID, otherwise generate new
        place_id: item.youtube_video_id, // Use youtube_video_id as the place_id
        name: item.title,
        country: item.description.split(',')[0].trim() || "Unknown Country",
        description: item.description,
        imageUrl: item.image,
        videoId: item.youtube_video_id,
        rating: 4.5,
        category: item.category || "General",
        moreInfo: item.more_info,
        location: item.location,
      }));
    } else if (data) {
      placesData = [{
        id: placeId && isUUID(placeId) ? placeId : uuidv4(), // Use provided placeId if it's a UUID, otherwise generate new
        place_id: data.youtube_video_id, // Use youtube_video_id as the place_id
        name: data.title,
        country: data.description.split(',')[0].trim() || "Unknown Country",
        description: data.description,
        imageUrl: data.image,
        videoId: data.youtube_video_id,
        rating: 4.5,
        category: data.category || "General",
        moreInfo: data.more_info,
        location: data.location,
      }];
    }

    return { data: placesData, isMock: false };
  } catch (error) {
    console.error("Error calling webhook:", error);
    return { data: [], isMock: true };
  }
}

// ── AI Guide ──
export interface AIGuideResponse {
  explanation: string;
  highlights: string[];
  bestTime: string;
  budget: string;
}

const mockGuide: AIGuideResponse = {
  explanation: "This stunning destination offers a unique blend of natural beauty and cultural heritage. Visitors can explore ancient ruins, pristine beaches, and vibrant local markets. The region is known for its warm hospitality and exceptional cuisine.",
  highlights: ["Historic old town", "Sunset viewpoints", "Local cuisine tours", "Nature hiking trails"],
  bestTime: "April to October",
  budget: "$80-150 per day",
};

export async function getAIGuide(placeId: string, placeName: string) {
  return callWebhook<AIGuideResponse>("/ai-guide", { placeId, placeName }, mockGuide);
}

// ── Payment Verification ──
export async function verifyPayment(paymentId: string, orderId: string) {
  return callWebhook<{ verified: boolean; plan: string }>(
    "/verify-payment",
    { paymentId, orderId },
    { verified: true, plan: "premium" }
  );
}

// ── Recommendations ──
export async function getRecommendations(userId?: string) {
  return callWebhook<Place[]>("/recommendations", { userId }, mockPlaces.slice(0, 4));
}
