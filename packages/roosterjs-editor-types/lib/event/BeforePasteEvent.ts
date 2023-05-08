import BasePluginEvent from './BasePluginEvent';
import ClipboardData from '../interface/ClipboardData';
import HtmlSanitizerOptions from '../interface/HtmlSanitizerOptions';
import { PluginEventType } from '../enum/PluginEventType';
import type { CompatiblePasteType } from '../compatibleEnum/PasteType';
import type { PasteType } from '../enum/PasteType';
import type { CompatiblePluginEventType } from '../compatibleEnum/PluginEventType';

/**
 * Data of BeforePasteEvent
 */
export interface BeforePasteEventData {
    /**
     * An object contains all related data for pasting
     */
    clipboardData: ClipboardData;

    /**
     * HTML Document Fragment which will be inserted into content
     */
    fragment: DocumentFragment;

    /**
     * Html sanitizing options. This will be used for sanitizing the html content before paste
     */
    sanitizingOption: Required<HtmlSanitizerOptions>;

    /**
     * Stripped HTML string before "StartFragment" comment
     */
    htmlBefore: string;

    /**
     * Stripped HTML string after "EndFragment" comment
     */
    htmlAfter: string;

    /**
     * Attributes of the root "HTML" tag
     */
    htmlAttributes: Record<string, string>;

    /**
     * Paste type option (as plain text, merge format, normal, as image)
     */
    readonly pasteType: PasteType | CompatiblePasteType;
}

/**
 * Provides a chance for plugin to change the content before it is pasted into editor.
 */
export default interface BeforePasteEvent
    extends BeforePasteEventData,
        BasePluginEvent<PluginEventType.BeforePaste> {}

/**
 * Provides a chance for plugin to change the content before it is pasted into editor.
 */
export interface CompatibleBeforePasteEvent
    extends BeforePasteEventData,
        BasePluginEvent<CompatiblePluginEventType.BeforePaste> {}
