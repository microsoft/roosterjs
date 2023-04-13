import { PasteElementProcessor } from './PasteElementProcessor';
import {
    BeforePasteEvent,
    BeforePasteEventData,
    CompatibleBeforePasteEvent,
} from 'roosterjs-editor-types';

/**
 * Data of ContentModelBeforePasteEvent
 */
export interface ContentModelBeforePasteEventData extends BeforePasteEventData {
    /**
     * Element processors to use when pasting.
     * If the a processor function in the array returns true, means that the element procesing was done by the function.
     * If all the processors return false, the default processor will be used instead.
     */
    elementProcessors: PasteElementProcessor<HTMLElement>[];
}

/**
 * Provides a chance for plugin to change the content before it is pasted into editor.
 */
export default interface ContentModelBeforePasteEvent
    extends ContentModelBeforePasteEventData,
        BeforePasteEvent {}

/**
 * Provides a chance for plugin to change the content before it is pasted into editor.
 */
export interface CompatibleContentModelBeforePasteEvent
    extends ContentModelBeforePasteEventData,
        CompatibleBeforePasteEvent {}
