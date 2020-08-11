import convertPastedContentFromExcel from './excelConverter/convertPastedContentFromExcel';
import convertPastedContentFromWord from './wordConverter/convertPastedContentFromWord';
import { chainSanitizerCallback } from 'roosterjs-editor-dom';
import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import { WAC_IDENTIFING_SELECTOR } from './officeOnlineConverter/constants';
import {
    AttributeCallbackMap,
    ClipboardData,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';
import convertPastedContentFromWordOnline, {
    isWordOnlineWithList,
} from './officeOnlineConverter/convertPastedContentFromWordOnline';

const WORD_ATTRIBUTE_NAME = 'xmlns:w';
const WORD_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:word';
const EXCEL_ATTRIBUTE_NAME = 'xmlns:x';
const EXCEL_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:excel';
const EXCEL_ONLINE_ATTRIBUTE_NAME = 'ProgId';
const EXCEL_ONLINE_ATTRIBUTE_VALUE = 'Excel.Sheet';
const GOOGLE_SHEET_NODE_NAME = 'google-sheets-html-origin';

/**
 * Paste plugin, handles BeforePaste event and reformat some special content, including:
 * 1. Content copied from Word
 * 2. Content copied from Excel
 * 3. Content copied from Word Online or Onenote Online
 */
export default class Paste implements EditorPlugin {
    private editor: Editor;

    /**
     * Create an instance of Paste
     * @param preserved @deprecated Not used. Preserved parameter only used for compatibility with old code
     * @param attributeCallbacks @deprecated A set of callbacks to help handle html attribute during sanitization
     */
    constructor(preserved?: any, private attributeCallbacks?: AttributeCallbackMap) {}

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'Paste';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: Editor) {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (event.eventType == PluginEventType.BeforePaste) {
            const { htmlAttributes, fragment, sanitizingOption } = event;
            let wacListElements: NodeListOf<Element>;

            if (htmlAttributes[WORD_ATTRIBUTE_NAME] == WORD_ATTRIBUTE_VALUE) {
                // Handle HTML copied from Word
                convertPastedContentFromWord(event);
            } else if (
                htmlAttributes[EXCEL_ATTRIBUTE_NAME] == EXCEL_ATTRIBUTE_VALUE ||
                htmlAttributes[EXCEL_ONLINE_ATTRIBUTE_NAME] == EXCEL_ONLINE_ATTRIBUTE_VALUE
            ) {
                // Handle HTML copied from Excel
                convertPastedContentFromExcel(event);
            } else if ((wacListElements = fragment.querySelectorAll(WAC_IDENTIFING_SELECTOR))[0]) {
                // Once it is known that the document is from WAC
                // We need to remove the display property and margin from all the list item
                wacListElements.forEach((el: HTMLElement) => {
                    el.style.display = null;
                    el.style.margin = null;
                });
                // call conversion function if the pasted content is from word online and
                // has list element in the pasted content.
                if (isWordOnlineWithList(fragment)) {
                    convertPastedContentFromWordOnline(fragment);
                }
            } else if (fragment.querySelector(GOOGLE_SHEET_NODE_NAME)) {
                sanitizingOption.additionalAllowedTags.push(GOOGLE_SHEET_NODE_NAME);
            }

            // TODO: Deprecate attributeCallbacks parameter
            if (this.attributeCallbacks) {
                Object.keys(this.attributeCallbacks).forEach(name => {
                    chainSanitizerCallback(
                        sanitizingOption.attributeCallbacks,
                        name,
                        this.attributeCallbacks[name]
                    );
                });
            }
        }
    }

    /**
     * @deprecated
     * Paste into editor using passed in clipboardData with original format
     * @param clipboardData The clipboardData to paste
     */
    public pasteOriginal(clipboardData: ClipboardData) {
        this.editor.paste(clipboardData);
    }

    /**
     * @deprecated
     * Paste plain text into editor using passed in clipboardData
     * @param clipboardData The clipboardData to paste
     */
    public pasteText(clipboardData: ClipboardData) {
        this.editor.paste(clipboardData, true /*pasteAsText*/);
    }

    /**
     * @deprecated
     * Paste into editor using passed in clipboardData with curent format
     * @param clipboardData The clipboardData to paste
     */
    public pasteAndMergeFormat(clipboardData: ClipboardData) {
        this.editor.paste(clipboardData, false /*pasteAsText*/, true /*applyCurrentFormat*/);
    }
}
