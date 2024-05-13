import type { ReadonlyMark } from '../common/ReadonlyMark';
import type { MutableMark } from '../common/MutableMark';
import type { DisplayFormat } from './formatParts/DisplayFormat';
import type { FontFamilyFormat } from './formatParts/FontFamilyFormat';

/**
 * Common part of format object for a code element in Content Model
 */
export type ContentModelCodeFormatCommon = FontFamilyFormat & DisplayFormat;

/**
 * The format object for a code element in Content Model
 */
export type ContentModelCodeFormat = MutableMark & ContentModelCodeFormatCommon;

/**
 * The format object for a code element in Content Model (Readonly)
 */
export type ReadonlyContentModelCodeFormat = ReadonlyMark & Readonly<ContentModelCodeFormatCommon>;
