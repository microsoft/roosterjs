import Entity from './Entity';
import ModeIndependentColor from './ModeIndependentColor';
import { ContentMetadata } from './ContentMetadata';

/**
 * Snapshot for an entity state. This is used for storing entity undo snapshot
 */
export interface EntitySnapshot {
    /**
     * The entity that the snapshot for
     */
    entity: Entity;

    /**
     * The state of this entity to store into undo snapshot
     */
    state: Object;
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
     * Known colors for dark mode
     */
    knownColors: Readonly<ModeIndependentColor>[];

    /**
     * Entity map, from entity id to its DOM wrapper element, to allow reusing existing DOM element when undo/redo
     */
    entities?: Record<string, HTMLElement>;

    /**
     * Undo snapshot for an entity. This is added by IEditor.addEntityUndoSnapshot()
     */
    entitySnapshot?: EntitySnapshot;
}
