"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortByNumericField = void 0;
/**
 * Utility untuk melakukan sorting berdasarkan field numerik secara aman.
 * Berguna untuk field hasil kalkulasi (misalnya difference, expectedClosing)
 * yang tidak bisa di-sort langsung oleh Prisma.
 */
const sortByNumericField = (data, field, order = "asc") => {
    // pastikan field yang di-sort adalah number
    return [...data].sort((a, b) => {
        const aValue = Number(a[field]) || 0;
        const bValue = Number(b[field]) || 0;
        const direction = order === "asc" ? 1 : -1;
        return (aValue - bValue) * direction;
    });
};
exports.sortByNumericField = sortByNumericField;
