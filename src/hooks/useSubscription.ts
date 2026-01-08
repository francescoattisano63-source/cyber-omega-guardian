import { useState } from "react";
import { SubscriptionLevel, subscriptionFeatures, SubscriptionFeatures } from "@/lib/subscription";

export function useSubscription(initialLevel: SubscriptionLevel = "Basic") {
  const [level, setLevel] = useState<SubscriptionLevel>(initialLevel);

  const features: SubscriptionFeatures = subscriptionFeatures[level];

  const upgrade = (newLevel: SubscriptionLevel) => {
    setLevel(newLevel);
  };

  const canUseFeature = (feature: keyof SubscriptionFeatures): boolean => {
    return !!features[feature];
  };

  return { level, features, upgrade, canUseFeature };
}
