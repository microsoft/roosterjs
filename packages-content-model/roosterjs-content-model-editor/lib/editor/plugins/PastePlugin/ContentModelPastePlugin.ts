import addParser from './utils/addParser';
import { chainSanitizerCallback, getPasteSource } from 'roosterjs-editor-dom';
import { ContentModelEditorPlugin } from '../../../publicTypes/ContentModelEditorPlugin';
import { ContentModelPluginEvent } from '../../../publicTypes/event/ContentModelPluginEvent';
import { deprecatedBorderColorParser } from './utils/deprecatedColorParser';
import { KnownPasteSourceType } from 'roosterjs-editor-types';
import { parseLink } from './utils/linkParser';
import { processPastedContentFromExcel } from './Excel/processPastedContentFromExcel';
import { processPastedContentFromPowerPoint } from './PowerPoint/processPastedContentFromPowerPoint';
import { processPastedContentFromWordDesktop } from './WordDesktop/processPastedContentFromWordDesktop';
import { processPastedContentWacComponents } from './WacComponents/processPastedContentWacComponents';
import type { ContentModelBlockFormat, FormatParser } from 'roosterjs-content-model-types';
import type { IContentModelEditor } from '../../../publicTypes/IContentModelEditor';
import type { HtmlSanitizerOptions } from 'roosterjs-editor-types';

const GOOGLE_SHEET_NODE_NAME = 'google-sheets-html-origin';

/**
 * Paste plugin, handles BeforePaste event and reformat some special content, including:
 * 1. Content copied from Word
 * 2. Content copied from Excel
 * 3. Content copied from Word Online or OneNote Online
 * 4. Content copied from Power Point
 * (This class is still under development, and may still be changed in the future with some breaking changes)
 */
export default class ContentModelPastePlugin implements ContentModelEditorPlugin {
    private editor: IContentModelEditor | null = null;

    /**
     * Construct a new instance of Paste class
     * @param unknownTagReplacement Replace solution of unknown tags, default behavior is to replace with SPAN
     */
    constructor(private unknownTagReplacement: string = 'SPAN') {}

    /**
     * Get name of this plugin
     */
    getName() {
        return 'ContentModelPaste';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IContentModelEditor) {
        // TODO: Later we may need a different interface for Content Model editor plugin
        this.editor = editor;
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        this.editor = null;
    }

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: ContentModelPluginEvent) {
        if (!this.editor || event.eventType != 'beforePaste') {
            return;
        }

        if (!event.domToModelOption) {
            return;
        }
        const pasteSource = getPasteSource(event, false);
        switch (pasteSource) {
            case KnownPasteSourceType.WordDesktop:
                processPastedContentFromWordDesktop(event);
                break;
            case KnownPasteSourceType.WacComponents:
                processPastedContentWacComponents(event);
                break;
            case KnownPasteSourceType.ExcelOnline:
            case KnownPasteSourceType.ExcelDesktop:
                if (event.pasteType === 'normal' || event.pasteType === 'mergeFormat') {
                    // Handle HTML copied from Excel
                    processPastedContentFromExcel(event, this.editor.getTrustedHTMLHandler());
                }
                break;
            case KnownPasteSourceType.GoogleSheets:
                event.sanitizingOption.additionalTagReplacements[GOOGLE_SHEET_NODE_NAME] = '*';
                break;
            case KnownPasteSourceType.PowerPointDesktop:
                processPastedContentFromPowerPoint(event, this.editor.getTrustedHTMLHandler());
                break;
        }

        addParser(event.domToModelOption, 'link', parseLink);
        addParser(event.domToModelOption, 'tableCell', deprecatedBorderColorParser);
        addParser(event.domToModelOption, 'table', deprecatedBorderColorParser);
        sanitizeBlockStyles(event.sanitizingOption);

        if (event.pasteType === 'mergeFormat') {
            addParser(event.domToModelOption, 'block', blockElementParser);
            addParser(event.domToModelOption, 'listLevel', blockElementParser);
        }

        event.sanitizingOption.unknownTagReplacement = this.unknownTagReplacement;
    }
}

/**
 * For block elements that have background color style, remove the background color when user selects the merge current format
 * paste option
 */
const blockElementParser: FormatParser<ContentModelBlockFormat> = (
    format: ContentModelBlockFormat,
    element: HTMLElement
) => {
    if (element.style.backgroundColor) {
        delete format.backgroundColor;
    }
};

function sanitizeBlockStyles(sanitizingOption: Required<HtmlSanitizerOptions>) {
    chainSanitizerCallback(sanitizingOption.cssStyleCallbacks, 'display', (value: string) => {
        return value != 'flex'; // return whether we keep the style
    });
}
