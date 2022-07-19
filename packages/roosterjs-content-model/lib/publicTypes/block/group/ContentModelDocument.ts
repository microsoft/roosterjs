import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import { ContentModelBlockGroupType } from '../../enum/BlockGroupType';
import type { CompatibleContentModelBlockGroupType } from '../../compatibleEnum/BlockGroupType';

/**
 * Content Model document entry point
 */
export interface ContentModelDocument
    extends ContentModelBlockGroupBase<
        ContentModelBlockGroupType.Document | CompatibleContentModelBlockGroupType.Document
    > {
    /**
     * HTML Document of this Content Model
     */
    document: Document;
}
