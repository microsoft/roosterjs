import type { IdFormat } from './formatParts/IdFormat';
import type { EntityInfoFormat } from './formatParts/EntityInfoFormat';

/**
 * The format object for an entity in Content Model
 */
export type ContentModelEntityFormat = EntityInfoFormat & IdFormat;
