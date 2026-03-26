import { useState, useEffect } from "react";
import { Place } from "@/lib/webhooks";

const BOOKMARKS_STORAGE_KEY = "bookmarkedPlaces";

export function useBookmarks() {
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

  const isBookmarked = (placeId: string) => {
    return bookmarks.some((place) => place.id === placeId);
  };

  const toggleBookmark = (place: Place) => {
    setBookmarks((prevBookmarks) => {
      if (isBookmarked(place.id)) {
        // Remove from bookmarks
        return prevBookmarks.filter((item) => item.id !== place.id);
      } else {
        // Add to bookmarks
        return [...prevBookmarks, place];
      }
    });
  };

  return { bookmarks, isBookmarked, toggleBookmark };
}