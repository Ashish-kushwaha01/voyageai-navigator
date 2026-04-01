import { useState, useEffect, useCallback } from "react";
import { Place } from "@/lib/webhooks";
import { HistoryItem, useHistory } from "@/hooks/use-history"; // Import HistoryItem and useHistory

const BOOKMARKS_STORAGE_KEY = "bookmarkedPlaces";

export function useBookmarks() {
  const { history, updateHistoryBookmarkStatus } = useHistory();
  const [bookmarks, setBookmarks] = useState<Place[]>(() => {
    try {
      const storedBookmarks = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      return storedBookmarks ? JSON.parse(storedBookmarks) : [];
    } catch (error) {
      console.error("Failed to parse bookmarks from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (error) {
      console.error("Failed to save bookmarks to localStorage", error);
    }
  }, [bookmarks]);

  const isBookmarked = useCallback((placeId: string) => {
    return bookmarks.some((place) => place.place_id === placeId || place.id === placeId);
  }, [bookmarks]);

  const toggleBookmark = useCallback(async (place: Place) => {
    const currentlyBookmarked = isBookmarked(place.place_id) || isBookmarked(place.id);
    
    // Update history status if updateHistoryBookmarkStatus exists
    if (updateHistoryBookmarkStatus) {
      await updateHistoryBookmarkStatus(place.place_id, !currentlyBookmarked);
    }

    setBookmarks((prevBookmarks) => {
      if (currentlyBookmarked) {
        // Remove from bookmarks
        return prevBookmarks.filter((item) => item.place_id !== place.place_id && item.id !== place.id);
      } else {
        // Add to bookmarks
        // If there's a corresponding history item, use its ID for the bookmark
        const existingHistoryItem = history.find(item => item.place_id === place.place_id);
        const bookmarkedPlace = existingHistoryItem
          ? { ...place, id: existingHistoryItem.id, historyId: existingHistoryItem.id }
          : place;
        return [...prevBookmarks, bookmarkedPlace];
      }
    });
  }, [history, isBookmarked, updateHistoryBookmarkStatus]);

  const removeBookmark = useCallback(async (placeId: string) => {
    if (updateHistoryBookmarkStatus) {
      await updateHistoryBookmarkStatus(placeId, false);
    }
    setBookmarks((prevBookmarks) => prevBookmarks.filter((item) => item.place_id !== placeId && item.id !== placeId));
  }, [updateHistoryBookmarkStatus]);

  return { bookmarks, isBookmarked, toggleBookmark, removeBookmark };
}