import type { MutableMark, ReadonlyMark } from '../common/MutableMark';
import type { ContentModelDataFormat } from '../format/ContentModelDataFormat';
import type {
    ContentModelWithFormat,
    ReadonlyContentModelWithFormat,
} from '../format/ContentModelWithFormat';

/**
 * Represent data info of Content Model, used by HTML &lt;data&gt; element.
 * ContentModelData is a decorator but not a standalone model type, instead it need to be put inside a ContentModelSegment
 * since the &lt;data&gt; element is also a kind of segment, with some extra information
 */
export interface ContentModelData
    extends MutableMark,
        ContentModelWithFormat<ContentModelDataFormat> {}

/**
 * Represent data info of Content Model, used by HTML &lt;data&gt; element. (Readonly)
 * ContentModelData is a decorator but not a standalone model type, instead it need to be put inside a ContentModelSegment
 * since the &lt;data&gt; element is also a kind of segment, with some extra information
 */
export interface ReadonlyContentModelData
    extends ReadonlyMark,
        ReadonlyContentModelWithFormat<ContentModelDataFormat> {}
