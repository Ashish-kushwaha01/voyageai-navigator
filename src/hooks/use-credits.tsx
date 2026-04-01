import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./use-auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useCredits() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const decrementCredits = useCallback(async () => {
    if (!user || !profile) return false;
    if (profile.credits > 0) {
      const { data, error } = await supabase
        .from('profiles')
        .update({ credits: profile.credits - 1, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select();
      if (error) {
        console.error('Error decrementing credits:', error.message);
        return false;
      }
      queryClient.invalidateQueries({ queryKey: ["userProfile", user.id] });
      return true;
    } else {
      console.warn('User has no credits left.');
      return false;
    }
  }, [user, profile, queryClient]);

  const activateProPlan = useCallback(async () => {
    if (!user) return false;
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_pro: true, credits: 100, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select();
    if (error) {
      console.error('Error activating pro plan:', error.message);
      return false;
    }
    queryClient.invalidateQueries({ queryKey: ["userProfile", user.id] });
    return true;
  }, [user, queryClient]);

  return { profile, credits: profile?.credits, isPro: profile?.is_pro, isLoading, error, decrementCredits, activateProPlan };
}
