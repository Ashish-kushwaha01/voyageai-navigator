/**
 * n8n Webhook Integration Layer
 * All business logic flows through n8n webhooks.
 * Fallback mock data is returned if webhooks fail.
 */

const N8N_BASE_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "https://your-n8n-instance.app/webhook";

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
}

const mockPlaces: Place[] = [
  { id: "1", name: "Santorini", country: "Greece", description: "Iconic white-washed buildings overlooking the Aegean Sea", imageUrl: "", videoId: "dQw4w9WgXcQ", rating: 4.9, category: "Beach" },
  { id: "2", name: "Kyoto", country: "Japan", description: "Ancient temples surrounded by serene bamboo forests", imageUrl: "", videoId: "dQw4w9WgXcQ", rating: 4.8, category: "Culture" },
  { id: "3", name: "Machu Picchu", country: "Peru", description: "Mystical Incan citadel high in the Andes mountains", imageUrl: "", videoId: "dQw4w9WgXcQ", rating: 4.9, category: "Adventure" },
  { id: "4", name: "Bali", country: "Indonesia", description: "Tropical paradise with lush rice terraces and temples", imageUrl: "", videoId: "dQw4w9WgXcQ", rating: 4.7, category: "Beach" },
  { id: "5", name: "Swiss Alps", country: "Switzerland", description: "Breathtaking mountain scenery and charming villages", imageUrl: "", videoId: "dQw4w9WgXcQ", rating: 4.8, category: "Adventure" },
  { id: "6", name: "Marrakech", country: "Morocco", description: "Vibrant souks, palaces, and rich cultural heritage", imageUrl: "", videoId: "dQw4w9WgXcQ", rating: 4.6, category: "Culture" },
];

export async function fetchPlaces(query?: string) {
  return callWebhook<Place[]>("/explore-places", { query: query || "" }, mockPlaces);
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
