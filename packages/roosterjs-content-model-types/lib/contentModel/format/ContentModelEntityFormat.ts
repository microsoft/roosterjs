import type { ReadonlyMark } from '../common/ReadonlyMark';
import type { MutableMark } from '../common/MutableMark';
import type { IdFormat } from './formatParts/IdFormat';
import type { EntityInfoFormat } from './formatParts/EntityInfoFormat';

/**
 * Common part of format object for an entity in Content Model
 */
export type ContentModelEntityFormatCommon = EntityInfoFormat & IdFormat;

/**
 * The format object for an entity in Content Model
 */
export type ContentModelEntityFormat = MutableMark & ContentModelEntityFormatCommon;

/**
 * The format object for an entity in Content Model (Readonly)
 */
export type ReadonlyContentModelEntityFormat = ReadonlyMark &
    Readonly<ContentModelEntityFormatCommon>;
