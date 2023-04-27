import { DomToModelOption } from '../IContentModelEditor';
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
     * domToModel Options to use when creating the content model from the paste fragment
     */
    domToModelOption: Partial<DomToModelOption>;
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
