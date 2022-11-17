import { ContentMetadata } from './ContentMetadata';

/**
 * A serializable snapshot of editor content, including the html content and metadata
 */
export default interface Snapshot {
    /**
     * HTML content string
     */
    html: string;

    /**
     * Metadata of the editor content state
     */
    metadata: ContentMetadata | null;

    /**
     * Entity map, from entity id to its DOM wrapper element, to allow reusing existing DOM element when undo/redo
     */
    entities?: Record<string, HTMLElement>;
}
