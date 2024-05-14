import type { MutableMark } from '../common/MutableMark';
import type { ReadonlyMark } from '../common/ReadonlyMark';
import type { ContentModelCodeFormat } from '../format/ContentModelCodeFormat';
import type {
    ContentModelWithFormat,
    ReadonlyContentModelWithFormat,
} from '../format/ContentModelWithFormat';

/**
 * Represent code info of Content Model.
 * ContentModelCode is a decorator but not a standalone model type, instead it need to be put inside a ContentModelSegment
 * since code is also a kind of segment, with some extra information
 */
export interface ContentModelCode
    extends MutableMark,
        ContentModelWithFormat<ContentModelCodeFormat> {}

/**
 * Represent code info of Content Model. (Readonly)
 * ContentModelCode is a decorator but not a standalone model type, instead it need to be put inside a ContentModelSegment
 * since code is also a kind of segment, with some extra information
 */
export interface ReadonlyContentModelCode
    extends ReadonlyMark,
        ReadonlyContentModelWithFormat<ContentModelCodeFormat> {}
