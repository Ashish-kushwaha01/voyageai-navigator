import { useState, useEffect, useCallback } from "react";
import { Place } from "@/lib/webhooks";
import { HistoryItem, useHistory } from "@/hooks/use-history";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export function useBookmarks() {
  const { user } = useAuth();
  const { history, updateHistoryBookmarkStatus } = useHistory();
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
    return bookmarks.some((place) => place.place_id === placeId || place.id === placeId);
  }, [bookmarks]);

  const toggleBookmark = useCallback(async (place: Place) => {
    if (!user) {
      toast.error("Please sign in to bookmark places.");
      return;
    }

    const currentlyBookmarked = isBookmarked(place.place_id) || isBookmarked(place.id);

    const existingHistoryItem = history.find(
      (item) => item.place_id === place.place_id || item.id === place.id
    );

    if (existingHistoryItem) {
      await updateHistoryBookmarkStatus(existingHistoryItem.id, !currentlyBookmarked);
      fetchBookmarks();
    } else {
      const newHistoryItem = {
        id: uuidv4(),
        user_id: user.id,
        search_query: "",
        place_id: place.place_id,
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
        url: `/explore?place=${place.id}`,
        bookmarked: true,
      };

      try {
        const { error } = await getSupabase()
          .from("history")
          .insert([newHistoryItem]);

        if (error) {
          const { bookmarked, ...itemWithoutBookmarked } = newHistoryItem;
          const { error: retryError } = await getSupabase()
            .from("history")
            .insert([itemWithoutBookmarked]);
          
          if (retryError) throw retryError;
        }

        toast.success("Place bookmarked!");
        fetchBookmarks();
      } catch (err) {
        toast.error("Failed to bookmark place.");
        console.error("Bookmark error:", err);
      }
    }
  }, [user, isBookmarked, history, updateHistoryBookmarkStatus, fetchBookmarks]);

  const removeBookmark = useCallback(async (placeId: string) => {
    if (!user) return;

    if (updateHistoryBookmarkStatus) {
      await updateHistoryBookmarkStatus(placeId, false);
      fetchBookmarks();
    }
  }, [user, updateHistoryBookmarkStatus, fetchBookmarks]);

  return { bookmarks, isBookmarked, toggleBookmark, removeBookmark, loading, error };
}