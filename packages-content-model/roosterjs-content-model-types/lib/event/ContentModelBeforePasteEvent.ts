import type { DomToModelOption } from '../context/DomToModelOption';
import type { ContentModelDocument } from '../group/ContentModelDocument';
import type { InsertPoint } from '../selection/InsertPoint';
import type {
    BeforePasteEvent,
    BeforePasteEventData,
    CompatibleBeforePasteEvent,
} from 'roosterjs-editor-types';

/**
 * Data of ContentModelBeforePasteEvent
 */
export interface ContentModelBeforePasteEventData extends BeforePasteEventData {
    /**
     * domToModel Options to use when creating the content model from the paste fragment
     */
    domToModelOption: Partial<DomToModelOption>;
    /**
     * customizedMerge Customized merge function to use when merging the paste fragment into the editor
     */
    customizedMerge?: (
        target: ContentModelDocument,
        source: ContentModelDocument
    ) => InsertPoint | null;
}

/**
 * Provides a chance for plugin to change the content before it is pasted into editor.
 */
export interface ContentModelBeforePasteEvent
    extends ContentModelBeforePasteEventData,
        BeforePasteEvent {}

/**
 * Provides a chance for plugin to change the content before it is pasted into editor.
 */
export interface CompatibleContentModelBeforePasteEvent
    extends ContentModelBeforePasteEventData,
        CompatibleBeforePasteEvent {}
