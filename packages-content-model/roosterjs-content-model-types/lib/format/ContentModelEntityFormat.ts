import { EntityTypeFormat } from './formatParts/EntityTypeFormat';
import { IdFormat } from './formatParts/IdFormat';

/**
 * The format object for an entity in Content Model
 */
export type ContentModelEntityFormat = EntityTypeFormat & IdFormat;
