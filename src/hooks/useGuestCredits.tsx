import { useState, useEffect } from "react";

const GUEST_CREDITS_KEY = "voyageai_guest_credits";
const INITIAL_GUEST_CREDITS = 3;

export function useGuestCredits() {
  const [credits, setCredits] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const storedCredits = localStorage.getItem(GUEST_CREDITS_KEY);
      return storedCredits ? parseInt(storedCredits, 10) : INITIAL_GUEST_CREDITS;
    }
    return INITIAL_GUEST_CREDITS;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(GUEST_CREDITS_KEY, credits.toString());
    }
  }, [credits]);

  const decrementCredits = () => {
    setCredits((prevCredits) => Math.max(0, prevCredits - 1));
  };

  const resetCredits = () => {
    setCredits(INITIAL_GUEST_CREDITS);
  };

  return {
    credits,
    decrementCredits,
    resetCredits,
    hasCredits: credits > 0,
  };
}
