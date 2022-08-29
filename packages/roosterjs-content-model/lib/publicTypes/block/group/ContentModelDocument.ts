import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';

/**
 * Content Model document entry point
 */
export interface ContentModelDocument extends ContentModelBlockGroupBase<'Document'> {
    /**
     * HTML Document of this Content Model
     */
    document: Document;
}
