import { DOMHelper } from 'roosterjs/lib';
import type { DOMInsertPoint } from '../selection/DOMSelection';
import type { ContentModelSegmentFormat } from '../contentModel/format/ContentModelSegmentFormat';

/**
 * Pending format holder interface
 */
export interface PendingFormat {
    /**
     * The pending format
     */
    format: ContentModelSegmentFormat;

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

    /**
     * An optional checker function to determine if we should run the default format apply function to current editing position
     * @param element Current HTML element
     * @param domHelper DOM Helper to help doing checking
     * @returns True if we need to apply default format, otherwise false
     */
    applyDefaultFormatChecker: ((element: HTMLElement, domHelper: DOMHelper) => boolean) | null;
}
