import type { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
import type {
    ContentModelSegmentBase,
    ReadonlyContentModelSegmentBase,
} from './ContentModelSegmentBase';

/**
 * Formatting specific to a line break.
 */
export type ContentModelBrFormat = ContentModelSegmentFormat & {
    /**
     * Which floating elements the next line must clear.
     */
    clear?: string;
};

/**
 * Content Model of BR
 */
export interface ContentModelBr extends ContentModelSegmentBase<'Br', ContentModelBrFormat> {}

/**
 * Content Model of BR (Readonly)
 */
export interface ReadonlyContentModelBr
    extends ReadonlyContentModelSegmentBase<'Br', ContentModelBrFormat> {}
