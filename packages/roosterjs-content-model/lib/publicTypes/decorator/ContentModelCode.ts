import { ContentModelWithFormat } from '../format/ContentModelWithFormat';
import { FontFamilyFormat } from '../format/formatParts/FontFamilyFormat';

/**
 * Represent code info of Content Model.
 * ContentModelCode is a decorator but not a standalone model type, instead it need to be put inside a ContentModelSegment
 * since code is also a kind of segment, with some extra information
 */
export interface ContentModelCode extends ContentModelWithFormat<FontFamilyFormat> {}
