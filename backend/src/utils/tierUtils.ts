export const getUserTier = (avgScore: number) => {
  if (avgScore >= 95)
    return { tierNumber: 7, tier: "Unfiltered Legend", badge: "🌌" };
  if (avgScore >= 90) return { tierNumber: 6, tier: "Icon", badge: "👑" };
  if (avgScore >= 80)
    return { tierNumber: 5, tier: "The Real Deal", badge: "🔥" };
  if (avgScore >= 70)
    return { tierNumber: 4, tier: "Authentic Voice", badge: "✨" };
  if (avgScore >= 60) return { tierNumber: 3, tier: "Believable", badge: "🧩" };
  if (avgScore >= 50) return { tierNumber: 2, tier: "Observer", badge: "🔍" };
  if (avgScore >= 1) return { tierNumber: 1, tier: "Rookie", badge: "🎭" };

  return { tierNumber: 0, tier: "Newbie", badge: "🐣" };
};
