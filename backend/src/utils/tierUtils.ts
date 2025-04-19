export const getUserTier = (avgScore: number) => {
  if (avgScore >= 85) return { tier: "The Real Deal", badge: "🔥" };
  if (avgScore >= 70) return { tier: "Authentic Voice", badge: "🎤" };
  if (avgScore >= 50) return { tier: "Believable", badge: "👌" };
  return { tier: "Rookie", badge: "🍼" };
};
