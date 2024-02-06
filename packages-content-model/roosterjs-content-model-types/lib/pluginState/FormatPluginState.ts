import type { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';

/**
 * Pending format holder interface
 */
export interface PendingFormat {
    /**
     * The pending format
     */
    format: ContentModelSegmentFormat;

    /**
     * Container node of pending format
     */
    posContainer: Node;

    /**
     * Offset under container node of pending format
     */
    posOffset: number;
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
