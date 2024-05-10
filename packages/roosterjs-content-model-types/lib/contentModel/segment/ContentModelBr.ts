import type { ReadonlyContentModel } from '../common/Mutable';
import type { ContentModelSegmentBase } from './ContentModelSegmentBase';

/**
 * Content Model of BR
 */
export interface ContentModelBr extends ContentModelSegmentBase<'Br'> {}

/**
 * Content Model of Br (Readonly)
 */
export type ReadonlyContentModelBr = ReadonlyContentModel<ContentModelBr>;
