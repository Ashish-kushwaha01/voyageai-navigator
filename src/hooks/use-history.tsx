import { useState, useEffect, useCallback } from "react";
import { Place } from "@/lib/webhooks";

const HISTORY_STORAGE_KEY = "viewedPlaces";
const MAX_HISTORY_ITEMS = 10;

export function useHistory() {
  const [history, setHistory] = useState<Place[]>(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
      console.error("Failed to parse history from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  }, [history]);

  const addPlaceToHistory = useCallback((place: Place) => {
    setHistory((prevHistory) => {
      // Remove existing entry if place.id already exists
      const filteredHistory = prevHistory.filter((item) => item.id !== place.id);

      // Add the new place with a timestamp at the beginning
      const newHistory = [{ ...place, viewedAt: Date.now() }, ...filteredHistory];

      // Limit the history size
      return newHistory.slice(0, MAX_HISTORY_ITEMS);
    });
  }, []); // Empty dependency array means this function is memoized once

  return { history, addPlaceToHistory };
}