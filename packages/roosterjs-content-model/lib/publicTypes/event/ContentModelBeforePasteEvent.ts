import { BasePluginEvent, ClipboardData, PluginEventType } from 'roosterjs-editor-types';
import { ContentModelDocument } from '../group/ContentModelDocument';
import { DomToModelOption, ModelToDomOption } from '../IContentModelEditor';
import type { CompatiblePluginEventType } from 'roosterjs-editor-types/lib/compatibleEnum/PluginEventType';

/**
 * Data of ContentModelBeforePasteEvent
 */
export interface ContentModelBeforePasteEventData {
    /**
     * An object contains all related data for pasting
     */
    clipboardData: ClipboardData;

    /**
     * Attributes of the root "HTML" tag
     */
    htmlAttributes: Record<string, string>;

    /**
     *
     */
    modelToDom: ModelToDomOption;

    /**
     *
     */
    domToModel: DomToModelOption;

    model: ContentModelDocument;
}

/**
 * Provides a chance for plugin to change the content before it is pasted into editor.
 */
export default interface ContentModelBeforePasteEvent
    extends ContentModelBeforePasteEventData,
        BasePluginEvent<PluginEventType.ContentModelBeforePaste> {}

/**
 * Provides a chance for plugin to change the content before it is pasted into editor.
 */
export interface CompatibleContentModelBeforePasteEvent
    extends ContentModelBeforePasteEventData,
        BasePluginEvent<CompatiblePluginEventType.ContentModelBeforePaste> {}
