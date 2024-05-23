import type {
    ContentModelSegmentBase,
    ReadonlyContentModelSegmentBase,
} from './ContentModelSegmentBase';

/**
 * Content Model of BR
 */
export interface ContentModelBr extends ContentModelSegmentBase<'Br'> {}

/**
 * Content Model of BR (Readonly)
 */
export interface ReadonlyContentModelBr extends ReadonlyContentModelSegmentBase<'Br'> {}
