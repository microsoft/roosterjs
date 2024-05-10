import type { ContentModelHyperLinkFormat } from '../format/ContentModelHyperLinkFormat';
import type { ContentModelWithDataset } from '../format/ContentModelWithDataset';
import type { ContentModelWithFormat } from '../format/ContentModelWithFormat';

/**
 * Represent link info of Content Model.
 * ContentModelLink is not a standalone model type, instead it need to be put inside a ContentModelSegment
 * since link is also a kind of segment, with some extra information
 */
export interface ContentModelLink
    extends ContentModelWithFormat<ContentModelHyperLinkFormat>,
        ContentModelWithDataset<null> {}
