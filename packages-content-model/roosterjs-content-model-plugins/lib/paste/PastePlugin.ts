import addParser from './utils/addParser';
import { BorderKeys } from 'roosterjs-content-model-dom';
import { deprecatedBorderColorParser } from './utils/deprecatedColorParser';
import { getPasteSource } from './pasteSourceValidations/getPasteSource';
import { parseLink } from './utils/linkParser';
import { PastePropertyNames } from './pasteSourceValidations/constants';
import { processPastedContentFromExcel } from './Excel/processPastedContentFromExcel';
import { processPastedContentFromPowerPoint } from './PowerPoint/processPastedContentFromPowerPoint';
import { processPastedContentFromWordDesktop } from './WordDesktop/processPastedContentFromWordDesktop';
import { processPastedContentWacComponents } from './WacComponents/processPastedContentWacComponents';
import type {
    BorderFormat,
    ContentModelBlockFormat,
    ContentModelTableCellFormat,
    EditorPlugin,
    FormatParser,
    IStandaloneEditor,
    PluginEvent,
} from 'roosterjs-content-model-types';

/**
 * Paste plugin, handles BeforePaste event and reformat some special content, including:
 * 1. Content copied from Word
 * 2. Content copied from Excel
 * 3. Content copied from Word Online or OneNote Online
 * 4. Content copied from Power Point
 * (This class is still under development, and may still be changed in the future with some breaking changes)
 */
export class PastePlugin implements EditorPlugin {
    private editor: IStandaloneEditor | null = null;

    /**
     * Construct a new instance of Paste class
     * @param unknownTagReplacement Replace solution of unknown tags, default behavior is to replace with SPAN
     * @param allowExcelNoBorderTable Allow table copied from Excel without border
     */
    constructor(private allowExcelNoBorderTable?: boolean) {}

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
    initialize(editor: IStandaloneEditor) {
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
    onPluginEvent(event: PluginEvent) {
        if (!this.editor || event.eventType != 'beforePaste') {
            return;
        }

        if (!event.domToModelOption) {
            return;
        }

        const pasteSource = getPasteSource(event, false);
        const pasteType = event.pasteType;

        switch (pasteSource) {
            case 'wordDesktop':
                processPastedContentFromWordDesktop(event, this.editor.getTrustedHTMLHandler());
                break;
            case 'wacComponents':
                processPastedContentWacComponents(event);
                break;
            case 'excelOnline':
            case 'excelDesktop':
                if (pasteType === 'normal' || pasteType === 'mergeFormat') {
                    // Handle HTML copied from Excel
                    processPastedContentFromExcel(
                        event,
                        this.editor.getTrustedHTMLHandler(),
                        this.allowExcelNoBorderTable
                    );
                }
                break;
            case 'googleSheets':
                event.domToModelOption.additionalAllowedTags.push(
                    PastePropertyNames.GOOGLE_SHEET_NODE_NAME as Lowercase<string>
                );
                break;
            case 'powerPointDesktop':
                processPastedContentFromPowerPoint(event, this.editor.getTrustedHTMLHandler());
                break;
        }

        addParser(event.domToModelOption, 'link', parseLink);
        addParser(event.domToModelOption, 'tableCell', deprecatedBorderColorParser);
        addParser(event.domToModelOption, 'tableCell', tableBorderParser);
        addParser(event.domToModelOption, 'table', deprecatedBorderColorParser);

        if (pasteType === 'mergeFormat') {
            addParser(event.domToModelOption, 'block', blockElementParser);
            addParser(event.domToModelOption, 'listLevel', blockElementParser);
        }
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

const ElementBorderKeys = new Map<
    keyof BorderFormat,
    {
        c: keyof CSSStyleDeclaration;
        s: keyof CSSStyleDeclaration;
        w: keyof CSSStyleDeclaration;
    }
>([
    ['borderTop', { w: 'borderTopWidth', s: 'borderTopStyle', c: 'borderTopColor' }],
    ['borderRight', { w: 'borderRightWidth', s: 'borderRightStyle', c: 'borderRightColor' }],
    ['borderBottom', { w: 'borderBottomWidth', s: 'borderBottomStyle', c: 'borderBottomColor' }],
    ['borderLeft', { w: 'borderLeftWidth', s: 'borderLeftStyle', c: 'borderLeftColor' }],
]);

function tableBorderParser(format: ContentModelTableCellFormat, element: HTMLElement): void {
    BorderKeys.forEach(key => {
        if (!format[key]) {
            const styleSet = ElementBorderKeys.get(key);
            if (
                styleSet &&
                element.style[styleSet.w] &&
                element.style[styleSet.s] &&
                !element.style[styleSet.c]
            ) {
                format[key] = `${element.style[styleSet.w]} ${element.style[styleSet.s]}`;
            }
        }
    });
}
