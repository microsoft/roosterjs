import type { Mutable } from '../common/Mutable';
import type { IdFormat } from './formatParts/IdFormat';
import type { EntityInfoFormat } from './formatParts/EntityInfoFormat';

/**
 * Common part of format object for an entity in Content Model
 */
export type ContentModelEntityFormatCommon = EntityInfoFormat & IdFormat;

/**
 * The format object for an entity in Content Model
 */
export type ContentModelEntityFormat = Mutable & ContentModelEntityFormatCommon;

/**
 * The format object for an entity in Content Model (Readonly)
 */
export type ReadonlyContentModelEntityFormat = Readonly<ContentModelEntityFormatCommon>;
