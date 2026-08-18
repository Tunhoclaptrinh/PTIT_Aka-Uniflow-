import { FilterQuery } from 'mongoose';

export const SPECIAL_QUERY_PARAMS = new Set([
  '_page',
  '_limit',
  '_sort',
  '_order',
  '_q',
  'page',
  'limit',
  'sort',
  'order',
  'sortBy',
  'sortOrder',
  'q',
  'search',
]);

export const QUERY_OPERATOR_SUFFIXES = [
  '_not_like',
  '_ilike',
  '_like',
  '_gte',
  '_lte',
  '_gt',
  '_lt',
  '_ne',
  '_in',
  '_nin',
];

export function hasQueryOperator(key: string): boolean {
  return QUERY_OPERATOR_SUFFIXES.some((suffix) => key.endsWith(suffix));
}

export function castQueryValue(value: any): any {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (typeof value === 'string' && value.startsWith('0') && value.length > 1) return value;
  if (value !== '' && !isNaN(Number(value))) return Number(value);
  return value;
}

/**
 * Xây dựng Mongoose Filter Query từ Query Parameters chuẩn REST API
 * Hỗ trợ các toán tử _like, _gte, _lte, _ne, _in, full-text search _q
 */
export function buildMongoFilterQuery<T = any>(
  queryParams: Record<string, any> = {},
  searchableFields: string[] = []
): FilterQuery<T> {
  const filter: FilterQuery<T> = {};
  const orConditions: any[] = [];

  // 1. Search full-text (_q / q / search)
  const searchQuery = queryParams._q || queryParams.q || queryParams.search;
  if (searchQuery && searchableFields.length > 0) {
    const searchRegex = new RegExp(String(searchQuery).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
    orConditions.push(
      ...searchableFields.map((field) => ({
        [field]: searchRegex,
      }))
    );
  }

  // 2. Filter Fields & Operators
  for (const [rawKey, rawValue] of Object.entries(queryParams)) {
    if (SPECIAL_QUERY_PARAMS.has(rawKey) || rawValue === undefined || rawValue === '') {
      continue;
    }

    const value = castQueryValue(rawValue);

    if (rawKey.endsWith('_like') || rawKey.endsWith('_ilike')) {
      const field = rawKey.replace(/(_like|_ilike)$/, '');
      const regex = new RegExp(String(value).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
      filter[field as keyof T] = regex as any;
    } else if (rawKey.endsWith('_not_like')) {
      const field = rawKey.replace('_not_like', '');
      const regex = new RegExp(String(value).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
      filter[field as keyof T] = { $not: regex } as any;
    } else if (rawKey.endsWith('_gte')) {
      const field = rawKey.replace('_gte', '');
      filter[field as keyof T] = { ...(filter[field as keyof T] || {}), $gte: value } as any;
    } else if (rawKey.endsWith('_lte')) {
      const field = rawKey.replace('_lte', '');
      filter[field as keyof T] = { ...(filter[field as keyof T] || {}), $lte: value } as any;
    } else if (rawKey.endsWith('_gt')) {
      const field = rawKey.replace('_gt', '');
      filter[field as keyof T] = { ...(filter[field as keyof T] || {}), $gt: value } as any;
    } else if (rawKey.endsWith('_lt')) {
      const field = rawKey.replace('_lt', '');
      filter[field as keyof T] = { ...(filter[field as keyof T] || {}), $lt: value } as any;
    } else if (rawKey.endsWith('_ne')) {
      const field = rawKey.replace('_ne', '');
      filter[field as keyof T] = { $ne: value } as any;
    } else if (rawKey.endsWith('_in')) {
      const field = rawKey.replace('_in', '');
      const inList = Array.isArray(value) ? value : String(value).split(',').map((s) => s.trim());
      filter[field as keyof T] = { $in: inList } as any;
    } else if (rawKey.endsWith('_nin')) {
      const field = rawKey.replace('_nin', '');
      const ninList = Array.isArray(value) ? value : String(value).split(',').map((s) => s.trim());
      filter[field as keyof T] = { $nin: ninList } as any;
    } else {
      // Exact Match
      filter[rawKey as keyof T] = value;
    }
  }

  if (orConditions.length > 0) {
    filter.$or = orConditions as any;
  }

  return filter;
}
