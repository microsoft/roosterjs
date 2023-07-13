import { DisplayFormat } from './formatParts/DisplayFormat';
import { FontFamilyFormat } from './formatParts/FontFamilyFormat';

/**
 * The format object for a code element in Content Model
 */
export type ContentModelCodeFormat = FontFamilyFormat & DisplayFormat;
