import type { ContentModelText } from '../contentModel/segment/ContentModelText';

/**
 *
 */
export interface ModelToDomTextContextItem {
    /**
     *
     */
    lastSegment: ContentModelText;

    /**
     *
     */
    lastTextNode: Text;
}

/**
 *
 */
export interface ModelToDomTextContext {
    /**
     *
     */
    textContext?: ModelToDomTextContextItem;
}
