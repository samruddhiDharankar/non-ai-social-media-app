export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// export function formatDateTime(isoString: string | Date) {
//   try {
//     const date = new Date(isoString);

//     if (isNaN(date.getTime())) return "Invalid Date";

//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   } catch {
//     return "Invalid date";
//   }
// }
