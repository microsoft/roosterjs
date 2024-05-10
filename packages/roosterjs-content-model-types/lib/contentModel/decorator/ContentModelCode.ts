import type { ReadonlyContentModel } from '../common/Mutable';
import type { ContentModelCodeFormat } from '../format/ContentModelCodeFormat';
import type { ContentModelWithFormat } from '../format/ContentModelWithFormat';

/**
 * Represent code info of Content Model.
 * ContentModelCode is a decorator but not a standalone model type, instead it need to be put inside a ContentModelSegment
 * since code is also a kind of segment, with some extra information
 */
export interface ContentModelCode extends ContentModelWithFormat<ContentModelCodeFormat> {}

/**
 * Content Model of code decorator (Readonly)
 */
export type ReadonlyContentModelCode = ReadonlyContentModel<ContentModelCode>;
