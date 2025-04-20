export const getUserTier = (avgScore: number) => {
  if (avgScore >= 95) return { tier: "Unfiltered Legend", badge: "🌌" };
  if (avgScore >= 90) return { tier: "Icon", badge: "👑" };
  if (avgScore >= 80) return { tier: "The Real Deal", badge: "🔥" };
  if (avgScore >= 70) return { tier: "Authentic Voice", badge: "✨" };
  if (avgScore >= 60) return { tier: "Believable", badge: "🧩" };
  if (avgScore >= 50) return { tier: "Observer", badge: "🔍" };
  if (avgScore >= 1) return { tier: "Rookie", badge: "🎭" };

  return { tier: "Newbie", badge: "🐣" };
};
