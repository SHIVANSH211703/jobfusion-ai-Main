export function getTimeBasedGreeting(name?: string) {
  const hour = new Date().getHours();

  let period: "morning" | "afternoon" | "evening";
  if (hour >= 5 && hour < 12) period = "morning";
  else if (hour >= 12 && hour < 17) period = "afternoon";
  else period = "evening";

  const displayName = name?.trim() ? `, ${name.trim()}` : "";

  const headline = {
    morning: `Good morning${displayName}`,
    afternoon: `Good afternoon${displayName}`,
    evening: `Good evening${displayName}`,
  }[period];

  const secondary = {
    morning: "Start your day by exploring new opportunities and checking your application progress.",
    afternoon: "Here’s a quick look at your current job search and next opportunities.",
    evening: "Review your progress, follow up on applications, and prepare for what’s next.",
  }[period];

  return { headline, secondary, period };
}
