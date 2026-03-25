import { supabase } from "../lib/supabase";

export const BillingService = {
  async deductCreditsAtomic(
    userId: string,
    feature: string,
    credits: number
  ) {
    try {
      const { error } = await supabase.rpc("deduct_credits_atomic", {
        user_id: userId,
        credit_amount: credits,
      });

      if (error) {
        console.error("❌ RPC ERROR:", error);

        // Handle specific errors from Postgres
        if (error.message?.includes("Insufficient credits")) {
          throw new Error("Insufficient credits");
        }

        if (error.message?.includes("User not found")) {
          throw new Error("User not found");
        }

        throw new Error("Billing failed");
      }

      console.log(
        `✅ Credits deducted: user=${userId}, feature=${feature}, amount=${credits}`
      );

      return true;

    } catch (err: any) {
      console.error("❌ BILLING SERVICE ERROR:", err);
      throw err;
    }
  },
};