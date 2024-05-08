import type { DOMInsertPoint } from '../selection/DOMSelection';
import type { ContentModelSegmentFormatCommon } from '../contentModel/format/ContentModelSegmentFormat';

/**
 * Pending format holder interface
 */
export interface PendingFormat {
    /**
     * The pending format
     */
    format: ContentModelSegmentFormatCommon;

    /**
     * Insert point of pending format
     */
    insertPoint: DOMInsertPoint;
}

/**
 * Plugin state for ContentModelFormatPlugin
 */
export interface FormatPluginState {
    /**
     * Default format of this editor
     */
    defaultFormat: ContentModelSegmentFormatCommon;

    /**
     * Pending format
     */
    pendingFormat: PendingFormat | null;
}
