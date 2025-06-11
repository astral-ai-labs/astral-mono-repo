/* ==========================================================================*/
// constants.ts — Platform-wide constants and configuration
/* ==========================================================================*/
// Purpose: Centralized constants for navigation, UI, and app configuration
// Sections: Navigation, Mock Data, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// Package Files ---
import { OwnerType } from "@workspace/keychain/types";

/* ==========================================================================*/
// Navigation Constants
/* ==========================================================================*/

/**
 * Platform navigation tabs configuration
 * 
 * Defines the main navigation items with their display names and route slugs.
 */
export const PLATFORM_TABS = [
  { name: "Agents", slug: "agents" },
  { name: "Workflows", slug: "workflows" },
  { name: "Completions", slug: "completions" },
  { name: "MCP Servers", slug: "mcp-servers" },
  { name: "Prompts", slug: "prompts" },
  { name: "Tools", slug: "tools" },
  { name: "Resources", slug: "resources" },
  { name: "Finetuning", slug: "finetuning" },
  { name: "Observe", slug: "observe" },
  { name: "Usage", slug: "usage" },
  { name: "Team Members", slug: "team-members" },
  { name: "Billing", slug: "billing" },
  { name: "Settings", slug: "settings" },
] as const;

/**
 * Navigation tab type derived from the PLATFORM_TABS constant
 */
export type PlatformTab = typeof PLATFORM_TABS[number];

/* ==========================================================================*/
// Mock Data Constants
/* ==========================================================================*/

/**
 * Dummy projects for development and testing
 */
export const DUMMY_PROJECTS = [
  { id: "1", name: "AI Assistant" },
  { id: "2", name: "Data Analytics" },
  { id: "3", name: "Web Scraper" },
  { id: "4", name: "Chat Bot" },
]

/**
 * Dummy user data for development and testing
 */
export const DUMMY_USER = {
  name: "Alicia Koch",
  email: "alicia@example.com",
  avatar: "/placeholder.svg?height=32&width=32",
  accountInfo: {
    accountType: OwnerType.Individual,
    individualPlan: "Hobby"
  }
}

/* ==========================================================================*/
// Billing Constants
/* ==========================================================================*/

export const billingConstants = {
    overview: {
        sectionTitle: "One Billing. Every Model.",
        creditBalance: "Credit balance",
        autoRechargeMessage: "Auto recharge is off. You can enable it in the payment methods section.",
        addCreditBalanceButton: "Add credit",
        enableAutoRechargeButton: "Enable auto recharge",
        autoRechargeSettings: "Auto recharge settings",
        autoRechargeQuestion: "Would you like to set up automatic recharge?",
        autoRechargeYes: "Yes, automatically recharge my card when my credit balance falls below a threshold",
    },
    paymentMethods: {
        sectionTitle: "Payment methods",
        addPaymentMethodButton: "Add payment method",
        paymentMethodAdded: "Payment method added",
    },
    addMoney: {
        dialogTitle: "Add to credit balance",
        dialogDescription: "Add funds to your account to use for future purchases.",
        amountToAdd: "Amount to add",
        customAmount: "Custom amount",
        enterCustomAmount: "Enter custom amount",
        amountBetween: "Enter an amount between $5 and $199,992",
        paymentMethod: "Payment method",
        addPaymentMethod: "Add payment method",
        selectPaymentMethod: "Select payment method",
        cancelButton: "Nevermind",
        continueButton: "Add",
    },
    addPaymentMethod: {
        dialogTitle: "Add payment method",
        dialogDescription: "Add a new payment method to your account for purchases and auto-recharge.",
        cardNumber: "Card number",
        expiryMonth: "Month",
        expiryYear: "Year",
        cvc: "CVC",
        cardholderName: "Cardholder name",
        cardholderNameHelper: "Enter the name as it appears on your card",
        cancelButton: "Cancel",
        addButton: "Add payment method",
    },
    enableRecharge: {
        enableAutoRechargeButton: "Enable auto recharge",
        autoRechargeSettings: "Auto recharge settings",
        autoRechargeInfo:
          "Configure automatic recharge when your credit balance falls below a threshold",
        whenBalanceGoesBelow: "When credit balance goes below",
        bringBalanceBackTo: "Bring credit balance back up to",
        limitAmount: "Limit the amount of automatic recharge per month",
        enterAmountBetween: "Enter an amount between $5 and $199 995",
        enterAmountBetween10: "Enter an amount between $10 and $200 000",
        enterAmountNoLimit:
          "Enter an amount between $10 and $200 000. Leave this field empty for no recharge limit.",
        cancelButton: "Cancel",
        saveButton: "Save settings",
        popular: "Most popular",
        custom: "Custom",
    },
    navigation: {
        availableOptions: "Available options",
    }   
}

