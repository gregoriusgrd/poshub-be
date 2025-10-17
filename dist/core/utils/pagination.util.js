"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
const getPagination = (options = {}, defaultLimit = 10, maxLimit = 100) => {
    const page = options.page && options.page > 0 ? options.page : 1;
    // limit tidak boleh lebih dari maxLimit
    const limit = options.limit && options.limit > 0
        ? Math.min(options.limit, maxLimit)
        : defaultLimit;
    const skip = (page - 1) * limit;
    const take = limit;
    return { page, limit, skip, take };
};
exports.getPagination = getPagination;
