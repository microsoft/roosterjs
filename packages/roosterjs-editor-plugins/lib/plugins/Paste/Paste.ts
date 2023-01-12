import convertPasteContentForSingleImage from './imageConverter/convertPasteContentForSingleImage';
import convertPastedContentForLI from './commonConverter/convertPastedContentForLI';
import convertPastedContentFromExcel from './excelConverter/convertPastedContentFromExcel';
import convertPastedContentFromOfficeOnline from './officeOnlineConverter/convertPastedContentFromOfficeOnline';
import convertPastedContentFromPowerPoint from './pptConverter/convertPastedContentFromPowerPoint';
import convertPastedContentFromWord from './wordConverter/convertPastedContentFromWord';
import getPasteSource from './sourceValidations/getPasteSource';
import handleLineMerge from './lineMerge/handleLineMerge';
import sanitizeHtmlColorsFromPastedContent from './sanitizeHtmlColorsFromPastedContent/sanitizeHtmlColorsFromPastedContent';
import sanitizeLinks from './sanitizeLinks/sanitizeLinks';
import { EditorPlugin, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { GOOGLE_SHEET_NODE_NAME } from './sourceValidations/constants';
import { KnownSourceType } from './sourceValidations/KnownSourceType';

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
     * @param convertSingleImageBody When enabled, if clipboard HTML contains a single image, we reuse the image without modifying the src attribute.
     *                               When disabled, pasted image src attribute will use the dataUri from clipboard data -- By Default disabled.
     */
    constructor(
        private unknownTagReplacement: string = 'SPAN',
        private convertSingleImageBody: boolean = false
    ) {}

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
            const { fragment, sanitizingOption } = event;
            const trustedHTMLHandler = this.editor.getTrustedHTMLHandler();

            switch (getPasteSource(event, this.convertSingleImageBody)) {
                case KnownSourceType.WordDesktop:
                    // Handle HTML copied from Word
                    convertPastedContentFromWord(event);
                    break;
                case KnownSourceType.ExcelDesktop:
                    // Handle HTML copied from Excel
                    convertPastedContentFromExcel(event, trustedHTMLHandler);
                    break;
                case KnownSourceType.PowerPointDesktop:
                    convertPastedContentFromPowerPoint(event, trustedHTMLHandler);
                    break;
                case KnownSourceType.WacComponents:
                    convertPastedContentFromOfficeOnline(fragment);
                    break;
                case KnownSourceType.GoogleSheets:
                    sanitizingOption.additionalTagReplacements[GOOGLE_SHEET_NODE_NAME] = '*';
                    break;
                case KnownSourceType.SingleImage:
                    convertPasteContentForSingleImage(event, trustedHTMLHandler);
                    break;
                case KnownSourceType.Default:
                    convertPastedContentForLI(fragment);
                    handleLineMerge(fragment);
                    break;
            }
            sanitizeLinks(sanitizingOption);
            sanitizeHtmlColorsFromPastedContent(sanitizingOption);

            // Replace unknown tags with SPAN
            sanitizingOption.unknownTagReplacement = this.unknownTagReplacement;
        }
    }
}
