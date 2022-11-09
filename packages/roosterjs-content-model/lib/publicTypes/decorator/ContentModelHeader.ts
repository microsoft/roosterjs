import { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
import { ContentModelWithFormat } from '../format/ContentModelWithFormat';

/**
 * Represent header info of Content Model.
 * ContentModelHeader is not a standalone model type, instead it need to be put inside a ContentModelParagraph
 * since header is also a kind of paragraph, with some extra information
 */
export interface ContentModelHeader extends ContentModelWithFormat<ContentModelSegmentFormat> {
    /**
     * Header level for this paragraph if it is a header.
     * For a normal paragraph, just leave it as undefined
     */
    headerLevel: number;
}
