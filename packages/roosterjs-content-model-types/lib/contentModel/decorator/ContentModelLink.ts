import type { MutableMark } from '../common/MutableMark';
import type { ReadonlyMark } from '../common/ReadonlyMark';
import type { ContentModelHyperLinkFormat } from '../format/ContentModelHyperLinkFormat';
import type {
    ContentModelWithDataset,
    ReadonlyContentModelWithDataset,
} from '../format/ContentModelWithDataset';
import type {
    ContentModelWithFormat,
    ReadonlyContentModelWithFormat,
} from '../format/ContentModelWithFormat';

/**
 * Represent link info of Content Model.
 * ContentModelLink is not a standalone model type, instead it need to be put inside a ContentModelSegment
 * since link is also a kind of segment, with some extra information
 */
export interface ContentModelLink
    extends MutableMark,
        ContentModelWithFormat<ContentModelHyperLinkFormat>,
        ContentModelWithDataset<null> {}

/**
 * Represent link info of Content Model (Readonly).
 * ContentModelLink is not a standalone model type, instead it need to be put inside a ContentModelSegment
 * since link is also a kind of segment, with some extra information
 */
export interface ReadonlyContentModelLink
    extends ReadonlyMark,
        ReadonlyContentModelWithFormat<ContentModelHyperLinkFormat>,
        ReadonlyContentModelWithDataset<null> {}
