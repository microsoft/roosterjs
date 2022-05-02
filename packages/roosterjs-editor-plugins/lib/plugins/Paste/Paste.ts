import convertPasteContentForSingleImage from './imageConverter/convertPasteContentForSingleImage';
import convertPastedContentForLI from './commonConverter/convertPastedContentForLI';
import convertPastedContentFromExcel from './excelConverter/convertPastedContentFromExcel';
import convertPastedContentFromPowerPoint from './pptConverter/convertPastedContentFromPowerPoint';
import convertPastedContentFromWord from './wordConverter/convertPastedContentFromWord';
import handleLineMerge from './lineMerge/handleLineMerge';
import { toArray } from 'roosterjs-editor-dom';
import {
    EditorPlugin,
    ExperimentalFeatures,
    IEditor,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';
import convertPastedContentFromWordOnline, {
    isWordOnlineWithList,
} from './officeOnlineConverter/convertPastedContentFromWordOnline';

const WORD_ATTRIBUTE_NAME = 'xmlns:w';
const WORD_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:word';
const WORD_PROG_ID = 'Word.Document';
const EXCEL_ATTRIBUTE_NAME = 'xmlns:x';
const EXCEL_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:excel';
const PROG_ID_NAME = 'ProgId';
const EXCEL_ONLINE_ATTRIBUTE_VALUE = 'Excel.Sheet';
const POWERPOINT_ATTRIBUTE_VALUE = 'PowerPoint.Slide';
const GOOGLE_SHEET_NODE_NAME = 'google-sheets-html-origin';
const WAC_IDENTIFY_SELECTOR =
    'ul[class^="BulletListStyle"]>.OutlineElement,ol[class^="NumberListStyle"]>.OutlineElement,span.WACImageContainer';

/**
 * Paste plugin, handles BeforePaste event and reformat some special content, including:
 * 1. Content copied from Word
 * 2. Content copied from Excel
 * 3. Content copied from Word Online or OneNote Online
 */
export default class Paste implements EditorPlugin {
    private editor: IEditor;

    /**
     * Construct a new instance of Paste class
     * @param unknownTagReplacement Replace solution of unknown tags, default behavior is to replace with SPAN
     */
    constructor(private unknownTagReplacement: string = 'SPAN') {}

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
    initialize(editor: IEditor) {
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
            const { htmlAttributes, fragment, sanitizingOption, clipboardData } = event;
            const trustedHTMLHandler = this.editor.getTrustedHTMLHandler();
            let wacListElements: Node[];

            if (isWordDocument(htmlAttributes)) {
                // Handle HTML copied from Word
                convertPastedContentFromWord(event);
            } else if (
                htmlAttributes[EXCEL_ATTRIBUTE_NAME] == EXCEL_ATTRIBUTE_VALUE ||
                htmlAttributes[PROG_ID_NAME] == EXCEL_ONLINE_ATTRIBUTE_VALUE
            ) {
                // Handle HTML copied from Excel
                convertPastedContentFromExcel(event, trustedHTMLHandler);
            } else if (htmlAttributes[PROG_ID_NAME] == POWERPOINT_ATTRIBUTE_VALUE) {
                convertPastedContentFromPowerPoint(event, trustedHTMLHandler);
            } else if (
                (wacListElements = toArray(fragment.querySelectorAll(WAC_IDENTIFY_SELECTOR))) &&
                wacListElements.length > 0
            ) {
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
                sanitizingOption.additionalTagReplacements[GOOGLE_SHEET_NODE_NAME] = '*';
            } else if (
                this.editor.isFeatureEnabled(ExperimentalFeatures.ConvertSingleImageBody) &&
                clipboardData.htmlFirstLevelChildTags?.length == 1 &&
                clipboardData.htmlFirstLevelChildTags[0] == 'IMG'
            ) {
                convertPasteContentForSingleImage(event, trustedHTMLHandler);
            } else {
                convertPastedContentForLI(fragment);
                handleLineMerge(fragment);
            }

            // Replace unknown tags with SPAN
            sanitizingOption.unknownTagReplacement = this.unknownTagReplacement;
        }
    }
}

function isWordDocument(htmlAttributes: Record<string, string>) {
    return (
        htmlAttributes[WORD_ATTRIBUTE_NAME] == WORD_ATTRIBUTE_VALUE ||
        htmlAttributes[PROG_ID_NAME] == WORD_PROG_ID
    );
}
