import { useState, useEffect, useCallback } from "react";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Place } from "@/lib/webhooks"; // Assuming Place type is still relevant for some data
import { v4 as uuidv4 } from 'uuid';

export type HistoryItem = {
  id: string;
  user_id: string;
  search_query: string; // New: The search query that led to this item
  place_id: string;
  place_name: string;
  country: string;
  description: string;
  image_url: string;
  video_id: string;
  rating: number;
  category: string;
  more_info?: string;
  location_name?: string;
  location_lat?: number;
  location_lng?: number;
  url: string; // This will be the URL to the detailed view of the place
  viewed_at: string; // ISO string
  bookmarked: boolean; // New: To track if this history item is also bookmarked
};

export function useHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!user) {
      setHistory([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await getSupabase()
        .from("history")
        .select("*") // Select all columns now
        .eq("user_id", user.id)
        .order("viewed_at", { ascending: false })
        .limit(10); // Limit to 10 items as before

      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error("Error fetching history:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch history.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Modified addPlaceToHistory to accept search_query and a Place object
  const addPlaceToHistory = useCallback(async (searchQuery: string, place: Place) => {
    if (!user) {
      console.warn("Attempted to add history for unauthenticated user.");
      return;
    }

    try {
      const newHistoryItem = {
        id: uuidv4(), // Generate a new UUID for the history record
        user_id: user.id,
        search_query: searchQuery,
        place_id: place.place_id, // Use the YouTube video ID
        place_name: place.name,
        country: place.country,
        description: place.description,
        image_url: place.imageUrl,
        video_id: place.videoId,
        rating: place.rating,
        category: place.category,
        more_info: place.moreInfo,
        location_name: place.location?.name,
        location_lat: place.location?.lat,
        location_lng: place.location?.lng,
        url: `/explore?place=${place.id}`, // Use the Place's UUID for the URL
        bookmarked: false, // Initialize as not bookmarked
      };

      const { data, error } = await getSupabase()
        .from("history")
        .insert([newHistoryItem])
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST204' || error.message.includes('bookmarked')) {
          console.warn("Retrying history insertion without 'bookmarked' column due to schema mismatch.");
          const { bookmarked, ...itemWithoutBookmarked } = newHistoryItem;
          const { data: retryData, error: retryError } = await getSupabase()
            .from("history")
            .insert([itemWithoutBookmarked])
            .select()
            .single();
          if (retryError) throw retryError;
          setHistory((prevHistory) => {
            const updatedHistory = [retryData, ...prevHistory.filter((item) => item.place_id !== place.place_id)];
            return updatedHistory.slice(0, 10);
          });
          return;
        }
        throw error;
      }

      setHistory((prevHistory) => {
        // Filter out existing entry for the same place_id to ensure uniqueness and recency
        const updatedHistory = [data, ...prevHistory.filter((item) => item.place_id !== place.place_id)];
        return updatedHistory.slice(0, 10);
      });
    } catch (err) {
      console.error("Error adding place to history:", err);
      setError(err instanceof Error ? err.message : "Failed to add place to history.");
    }
  }, [user]);

  const updateHistoryBookmarkStatus = useCallback(async (placeId: string, isBookmarked: boolean) => {
    if (!user) return;

    try {
      // Optimistically update local state first
      setHistory((prevHistory) =>
        prevHistory.map((item) =>
          item.place_id === placeId ? { ...item, bookmarked: isBookmarked } : item
        )
      );

      // Try updating database, handle missing 'bookmarked' column gracefully
      const { error } = await getSupabase()
        .from("history")
        .update({ bookmarked: isBookmarked })
        .eq("user_id", user.id)
        .eq("place_id", placeId);

      if (error) {
        if (error.code === 'PGRST204' || error.message.includes('bookmarked')) {
          console.warn("History table missing 'bookmarked' column, skipping DB update.");
          return;
        }
        throw error;
      }
    } catch (err) {
      console.error("Error updating history bookmark status:", err);
    }
  }, [user]);

  return { history, addPlaceToHistory, updateHistoryBookmarkStatus, loading, error };
}