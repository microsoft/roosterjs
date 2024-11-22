import type { DOMInsertPoint } from '../selection/DOMSelection';
import type { ContentModelSegmentFormat } from '../contentModel/format/ContentModelSegmentFormat';
import type { ContentModelBlockFormat } from '../contentModel/format/ContentModelBlockFormat';

/**
 * Pending format holder interface
 */
export interface PendingFormat {
    /**
     * The pending format
     */
    format?: ContentModelSegmentFormat;

    /**
     * Customized format for paragraph
     */
    paragraphFormat?: ContentModelBlockFormat;

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
    defaultFormat: ContentModelSegmentFormat;

    /**
     * Pending format
     */
    pendingFormat: PendingFormat | null;
}
