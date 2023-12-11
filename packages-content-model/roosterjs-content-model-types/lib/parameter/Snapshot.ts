import type { EntityState } from './FormatWithContentModelContext';
import type { ContentMetadata, ModeIndependentColor } from 'roosterjs-editor-types';

/**
 * A serializable snapshot of editor content, including the html content and metadata
 */
export interface Snapshot {
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
     * Entity states related to this undo snapshots. When undo/redo to this snapshot, each entity state will trigger
     * an EntityOperation event with operation = EntityOperation.UpdateEntityState
     */
    entityStates?: EntityState[];
}
