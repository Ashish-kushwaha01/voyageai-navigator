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
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  videoId: string;
  rating: number;
  category: string;
  moreInfo?: string;
  location?: {
    name: string;
    lat: number;
    lng: number;
  };
  viewedAt?: number; // Timestamp for history tracking
}

// New interface for the search webhook response
export interface LocationSearchResponse {
  youtube_video_id: string;
  title: string;
  image: string;
  description: string;
  more_info: string;
  location?: {
    name: string;
    lat: number;
    lng: number;
  };
}

// Modify fetchPlaces to use the new search webhook when a query is present
export async function fetchPlaces(query?: string): Promise<{ data: Place[]; isMock: boolean }> {
  if (query) {
    const searchWebhookUrl = "https://voyageai.app.n8n.cloud/webhook/search";
    const payload = { location: query }; // Assuming the webhook expects 'location' as the key

    try {
      const res = await fetch(searchWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Search webhook returned ${res.status}`);
      }

      const data: LocationSearchResponse = await res.json();

      // Map the webhook response to a Place object
      const newPlace: Place = {
        id: data.youtube_video_id, // Using video ID as a unique ID for now
        name: data.title,
        country: data.description.split(',')[0].trim() || "Unknown Country", // Attempt to extract country from description
        description: data.description,
        imageUrl: data.image,
        videoId: data.youtube_video_id,
        rating: 4.5, // Default rating
        category: "General", // Default category, can be improved if webhook provides it
        moreInfo: data.more_info,
        location: data.location,
      };

      return { data: [newPlace], isMock: false }; // Return as an array containing the single result
    } catch (error) {
      console.error("Error calling location search webhook:", error);
      // Fallback to an empty array if the webhook fails for a specific query
      return { data: [], isMock: true };
    }
  } else {
    // Original logic for when no query is provided (e.g., initial load or category browsing)
    return { data: [], isMock: false }; // Return empty array when no query is provided
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
