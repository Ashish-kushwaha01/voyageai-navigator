import { useState, useEffect } from "react";
import { loadScript } from "@/lib/utils";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: { razorpay_payment_id: string; }) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (eventName: string, callback: (response: any) => void) => void;
    };
  }
}

export function useRazorpayPayment() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRazorpay = async () => {
      setLoading(true);
      setError(null);
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (res) {
        setScriptLoaded(true);
      } else {
        setError("Razorpay SDK failed to load. Are you online?");
      }
      setLoading(false);
    };

    loadRazorpay();
  }, []);

  const openPaymentGateway = (options: Omit<RazorpayOptions, "key">) => {
    if (!scriptLoaded || loading || error) {
      return;
    }

    const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!key) {
      setError("Payment gateway not configured.");
      throw new Error("Razorpay Key ID is not defined in environment variables.");
    }

    const paymentOptions: RazorpayOptions = {
      key,
      ...options,
      handler: (response: { razorpay_payment_id: string }) => {
        // Handle success or failure here
        options.handler(response); // Call the provided handler
      },
      prefill: options.prefill || {
        name: "VoyageAI User",
        email: "user@example.com",
        contact: "9999999999",
      },
      theme: options.theme || {
        color: "#6366F1", // Default theme color
      },
    };

    const rzp = new window.Razorpay(paymentOptions);
    rzp.open();
  };

  return { openPaymentGateway, loading, error };
}
