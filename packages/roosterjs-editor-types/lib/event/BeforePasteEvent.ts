import BasePluginEvent from './BasePluginEvent';
import ClipboardData from '../interface/ClipboardData';
import HtmlSanitizerOptions from '../interface/HtmlSanitizerOptions';
import { PasteOption } from '../enum/PasteOption';
import { PluginEventType } from './PluginEventType';

/**
 * Provides a chance for plugin to change the content before it is pasted into editor.
 */
export default interface BeforePasteEvent extends BasePluginEvent<PluginEventType.BeforePaste> {
    /**
     * An object contains all related data for pasting
     */
    clipboardData: ClipboardData;

    /**
     * HTML Document Fragment which will be inserted into content if pasteOption is set to PasteHtml
     */
    fragment: DocumentFragment;

    /**
     * Paste option: html, text or image
     */
    pasteOption: PasteOption;

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
}
