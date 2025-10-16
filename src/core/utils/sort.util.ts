/**
 * Utility untuk melakukan sorting berdasarkan field numerik secara aman.
 * Berguna untuk field hasil kalkulasi (misalnya difference, expectedClosing)
 * yang tidak bisa di-sort langsung oleh Prisma.
 */
export const sortByNumericField = <T extends Record<string, any>>(
  data: T[],
  field: keyof T,
  order: "asc" | "desc" = "asc"
): T[] => {
  // pastikan field yang di-sort adalah number
  return [...data].sort((a, b) => {
    const aValue = Number(a[field]) || 0;
    const bValue = Number(b[field]) || 0;
    const direction = order === "asc" ? 1 : -1;
    return (aValue - bValue) * direction;
  });
};
