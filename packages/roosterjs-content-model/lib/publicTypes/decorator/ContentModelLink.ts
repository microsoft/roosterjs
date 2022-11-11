import { ContentModelWithDataset } from '../format/ContentModelWithDataset';
import { ContentModelWithFormat } from '../format/ContentModelWithFormat';
import { LinkFormat } from '../format/formatParts/LinkFormat';

/**
 * Represent link info of Content Model.
 * ContentModelLink is not a standalone model type, instead it need to be put inside a ContentModelSegment
 * since link is also a kind of segment, with some extra information
 */
export interface ContentModelLink
    extends ContentModelWithFormat<LinkFormat>,
        ContentModelWithDataset<null> {}
