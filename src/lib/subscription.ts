export type SubscriptionLevel = "Basic" | "Pro" | "Enterprise";

export interface SubscriptionFeatures {
  emailBreach: boolean;
  emailReputation: boolean;
  domainLookup: boolean;
  webhookAlerts: boolean;
  threatFeed: boolean;
  reportExport: boolean;
  historicalStorageDays: number;
}

export const subscriptionFeatures: Record<SubscriptionLevel, SubscriptionFeatures> = {
  Basic: {
    emailBreach: true,
    emailReputation: true,
    domainLookup: true,
    webhookAlerts: false,
    threatFeed: false,
    reportExport: false,
    historicalStorageDays: 7,
  },
  Pro: {
    emailBreach: true,
    emailReputation: true,
    domainLookup: true,
    webhookAlerts: true,
    threatFeed: false,
    reportExport: true,
    historicalStorageDays: 30,
  },
  Enterprise: {
    emailBreach: true,
    emailReputation: true,
    domainLookup: true,
    webhookAlerts: true,
    threatFeed: true,
    reportExport: true,
    historicalStorageDays: 365,
  }
};

export const subscriptionPricing: Record<SubscriptionLevel, { price: string; period: string }> = {
  Basic: { price: "Gratis", period: "" },
  Pro: { price: "€49", period: "/mese" },
  Enterprise: { price: "€199", period: "/mese" }
};
