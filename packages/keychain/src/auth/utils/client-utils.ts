// -------------------------------------------------------------------------------- #
// Client Authentication Utilities
// -------------------------------------------------------------------------------- #

// -------------------------------------------------------------------------------- #
// Imports
// -------------------------------------------------------------------------------- #
// module imports
import { createClient } from "@/auth/supabase/client"

// -------------------------------------------------------------------------------- #
// User Authentication Utilities
// -------------------------------------------------------------------------------- #
/**
 * Gets the current authenticated user from Supabase on the client side
 * Returns null if no user is found or returns error based on parameter
 * @param options.redirectOnError If true, returns null on error. If false, returns error object
 * @returns The authenticated user object and userId, or error if redirectOnError is false
 */
export async function getAuthenticatedUserClient({ redirectOnError = true } = {}) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error getting user:", error);
    if (redirectOnError) {
      return null;
    } else {
      return { error };
    }
  }

  if (!data?.user) {
    if (redirectOnError) {
      return null;
    } else {
      return { error: { message: "No user found" } };
    }
  }

  const userId = data.user.id;

  return {
    user: data.user,
    userId,
  };
}

