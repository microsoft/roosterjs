import ModeIndependentColor from './ModeIndependentColor';
import { ContentMetadata } from './ContentMetadata';

export interface EntitySnapshot {
    type: string;
    id: string;
    stateInfo: Object;
}

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

    /**
     * Known colors for dark mode
     */
    knownColors: Readonly<ModeIndependentColor>[];

    entitySnapshot?: EntitySnapshot;
}
