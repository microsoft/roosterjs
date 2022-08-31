import convertPasteContentForSingleImage from './imageConverter/convertPasteContentForSingleImage';
import convertPastedContentForLI from './commonConverter/convertPastedContentForLI';
import convertPastedContentFromExcel from './excelConverter/convertPastedContentFromExcel';
import convertPastedContentFromPowerPoint from './pptConverter/convertPastedContentFromPowerPoint';
import convertPastedContentFromWord from './wordConverter/convertPastedContentFromWord';
import handleLineMerge from './lineMerge/handleLineMerge';
import sanitizeHtmlColorsFromPastedContent from './sanitizeHtmlColorsFromPastedContent/sanitizeHtmlColorsFromPastedContent';
import { documentContainWacElements } from './sourceValidations/documentContainWacElements';
import { EditorPlugin, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { GOOGLE_SHEET_NODE_NAME } from './sourceValidations/constants';
import { isExcelDesktopDocument } from './sourceValidations/isExcelDesktopDocument';
import { isGoogleSheetDocument } from './sourceValidations/isGoogleSheetDocument';
import { isPowerPointDesktopDocument } from './sourceValidations/isPowerPointDesktopDocument';
import { isWordDesktopDocument } from './sourceValidations/isWordDesktopDocument';
import { shouldConvertToSingleImage } from './sourceValidations/shouldConvertToSingleImage';
import convertPastedContentFromWordOnline, {
    isWordOnlineWithList,
} from './officeOnlineConverter/convertPastedContentFromWordOnline';

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
            let wacListElements: Node[] = [];

            if (isWordDesktopDocument(htmlAttributes)) {
                // Handle HTML copied from Word
                convertPastedContentFromWord(event);
            } else if (isExcelDesktopDocument(htmlAttributes)) {
                // Handle HTML copied from Excel
                convertPastedContentFromExcel(event, trustedHTMLHandler);
            } else if (isPowerPointDesktopDocument(htmlAttributes)) {
                convertPastedContentFromPowerPoint(event, trustedHTMLHandler);
            } else if (documentContainWacElements(wacListElements, fragment)) {
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
            } else if (isGoogleSheetDocument(fragment)) {
                sanitizingOption.additionalTagReplacements[GOOGLE_SHEET_NODE_NAME] = '*';
            } else if (shouldConvertToSingleImage(this.editor, clipboardData)) {
                convertPasteContentForSingleImage(event, trustedHTMLHandler);
            } else {
                convertPastedContentForLI(fragment);
                handleLineMerge(fragment);
            }

            sanitizeHtmlColorsFromPastedContent(sanitizingOption);

            // Replace unknown tags with SPAN
            sanitizingOption.unknownTagReplacement = this.unknownTagReplacement;
        }
    }
}
