import { useState, useEffect, useCallback } from "react";
import { Place } from "@/lib/webhooks";
import { HistoryItem, useHistory } from "@/hooks/use-history";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabase } from "@/lib/supabase";

export function useBookmarks() {
  const { user } = useAuth();
  const { updateHistoryBookmarkStatus } = useHistory();
  const [bookmarks, setBookmarks] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = useCallback(async () => {
    if (!user) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await getSupabase()
        .from("history")
        .select("*")
        .eq("user_id", user.id)
        .eq("bookmarked", true)
        .order("viewed_at", { ascending: false });

      if (error) throw error;

      const bookmarkedPlaces: Place[] = (data || []).map((item: HistoryItem) => ({
        id: item.id,
        place_id: item.place_id,
        name: item.place_name,
        country: item.country,
        description: item.description,
        imageUrl: item.image_url,
        videoId: item.video_id,
        rating: item.rating,
        category: item.category,
        moreInfo: item.more_info,
        location: item.location_name ? {
          name: item.location_name,
          lat: item.location_lat || 0,
          lng: item.location_lng || 0,
        } : undefined,
      }));
      setBookmarks(bookmarkedPlaces);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bookmarks.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const isBookmarked = useCallback((placeId: string) => {
    console.log("isBookmarked called for placeId:", placeId);
    const result = bookmarks.some((place) => place.place_id === placeId || place.id === placeId);
    console.log("isBookmarked result:", result);
    return result;
  }, [bookmarks]);

  const toggleBookmark = useCallback(async (place: Place) => {
    console.log("toggleBookmark called with place:", place);
    if (!user) {
      console.log("User not logged in, cannot toggle bookmark.");
      // Optionally, show a login required dialog here
      return;
    }

    const currentlyBookmarked = isBookmarked(place.place_id) || isBookmarked(place.id);
    console.log("Currently bookmarked status:", currentlyBookmarked);
    
    if (updateHistoryBookmarkStatus) {
      console.log("Calling updateHistoryBookmarkStatus with:", place.id, !currentlyBookmarked);
      await updateHistoryBookmarkStatus(place.id, !currentlyBookmarked); // Use place.id (history UUID)
      // After updating in history, refetch bookmarks to ensure consistency
      fetchBookmarks();
      console.log("fetchBookmarks called after update.");
    }
  }, [user, isBookmarked, updateHistoryBookmarkStatus, fetchBookmarks]);

  const removeBookmark = useCallback(async (placeId: string) => {
    if (!user) return;

    if (updateHistoryBookmarkStatus) {
      await updateHistoryBookmarkStatus(placeId, false);
      fetchBookmarks();
    }
  }, [user, updateHistoryBookmarkStatus, fetchBookmarks]);

  return { bookmarks, isBookmarked, toggleBookmark, removeBookmark, loading, error };
}