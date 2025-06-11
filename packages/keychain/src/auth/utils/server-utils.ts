// -------------------------------------------------------------------------------- #
// Server Authentication Utilities
// -------------------------------------------------------------------------------- #

// -------------------------------------------------------------------------------- #
// Imports
// -------------------------------------------------------------------------------- #
// Built-in imports
import { redirect } from "next/navigation";

// module imports
import { createClient } from "@workspace/auth/auth/supabase/server";

// -------------------------------------------------------------------------------- #
// User Authentication Utilities
// -------------------------------------------------------------------------------- #
/**
 * Gets the current authenticated user from Supabase
 * Redirects to login if no user is found or returns error based on parameter
 * @param options.redirectOnError If true, redirects to login on error. If false, returns error object
 * @returns The authenticated user object and userId, or error if redirectOnError is false
 */
export async function getAuthenticatedUserServer({ redirectOnError = true } = {}) {

  console.debug("Getting authenticated user");

  // Add a delay for testing/debugging purposes
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (!data.user) {
    console.debug("No user found");
    return { error: { message: "No user found" } };
  }

  if (error) {
    console.error("Error getting user:", error);
    if (redirectOnError) {
      redirect("/");
    } else {
      return { error };
    }
  }

  const userId = data.user.id;

  return {
    user: data.user,
    userId,
  };
}


