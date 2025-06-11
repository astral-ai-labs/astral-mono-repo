/* ==========================================================================*/
// user.tsx — User dropdown navigation component
/* ==========================================================================*/
// Purpose: Renders user avatar with dropdown menu for account management
// Sections: Imports, Types, Component, Exports

"use client";

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import { BadgeCheck, CreditCard, LogOut, Sparkles } from "lucide-react";

// External Packages ---
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";

// Package Files ---
import { OwnerType } from "@workspace/keychain/types";

/* ==========================================================================*/
// Types
/* ==========================================================================*/

type AccountInfo = {
  accountType: OwnerType;
  teamName?: string;
  individualPlan?: string;
}

interface NavUserProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    accountInfo: AccountInfo;
  };
}

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * NavUser
 * 
 * User dropdown navigation with avatar and account management menu.
 * 
 * @param user - User object with name, email, avatar, and account info
 */
function NavUser({ user }: NavUserProps) {
  // Account info extraction
  const accountType = user.accountInfo?.accountType || "individual";
  const teamName = user.accountInfo?.teamName;
  const isIndividual = accountType === "individual";
  const isOrganization = accountType === "organization";
  const showTeamName = isOrganization && teamName;

  // Generate user initials from full name
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="data-[state=open]:bg-platform-accent-900 data-[state=open]:text-accent-foreground h-8 w-8 rounded-full p-0 cursor-pointer focus-visible:ring-0 mr-1.5">
          <Avatar className="h-9 w-9 rounded-full">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="rounded-full">{getUserInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56 rounded-lg" side="bottom" align="end" sideOffset={4}>
        {/* User Info Section */}
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="rounded-full">{getUserInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>

        {/* Subscription Options */}
        {isIndividual && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
        
        {showTeamName && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <BadgeCheck />
                {teamName}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}

        <DropdownMenuSeparator />

        {/* Account Management */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <BadgeCheck />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <CreditCard />
            Billing
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Session Actions */}
        <DropdownMenuItem className="cursor-pointer">
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ==========================================================================*/
// Exports
/* ==========================================================================*/

export { NavUser };
