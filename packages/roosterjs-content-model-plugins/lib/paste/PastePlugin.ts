import { addParser } from './utils/addParser';
import { blockElementParser } from './parsers/blockElementParser';
import { chainSanitizerCallback } from './utils/chainSanitizerCallback';
import { DefaultSanitizers } from './DefaultSanitizers';
import { deprecatedBorderColorParser } from './parsers/deprecatedColorParser';
import { getDocumentSource } from './pasteSourceValidations/getDocumentSource';
import { getObjectKeys } from 'roosterjs-content-model-dom';
import { imageSizeParser } from './parsers/imageSizeParser';
import { parseLink } from './parsers/linkParser';
import { pasteButtonProcessor } from './processors/pasteButtonProcessor';
import { PastePropertyNames } from './pasteSourceValidations/constants';
import { processPastedContentFromExcel } from './Excel/processPastedContentFromExcel';
import { processPastedContentFromOneNote } from './oneNote/processPastedContentFromOneNote';
import { processPastedContentFromPowerPoint } from './PowerPoint/processPastedContentFromPowerPoint';
import { processPastedContentFromWordDesktop } from './WordDesktop/processPastedContentFromWordDesktop';
import { processPastedContentWacComponents } from './WacComponents/processPastedContentWacComponents';
import { setProcessor } from './utils/setProcessor';
import { tableBorderParser } from './parsers/tableBorderParser';
import type {
    BeforePasteEvent,
    DomToModelOptionForSanitizing,
    EditorPlugin,
    IEditor,
    PluginEvent,
} from 'roosterjs-content-model-types';

/**
 * Paste plugin, handles BeforePaste event and reformat some special content, including:
 * 1. Content copied from Word
 * 2. Content copied from Excel
 * 3. Content copied from Word Online or OneNote Online
 * 4. Content copied from Power Point
 */
export class PastePlugin implements EditorPlugin {
    private editor: IEditor | null = null;

    /**
     * Construct a new instance of Paste class
     * @param unknownTagReplacement Replace solution of unknown tags, default behavior is to replace with SPAN
     * @param allowExcelNoBorderTable Allow table copied from Excel without border
     */
    constructor(
        private allowExcelNoBorderTable?: boolean,
        private domToModelForSanitizing: Pick<
            DomToModelOptionForSanitizing,
            | 'additionalAllowedTags'
            | 'additionalDisallowedTags'
            | 'styleSanitizers'
            | 'attributeSanitizers'
        > = {
            styleSanitizers: DefaultSanitizers,
            additionalAllowedTags: [],
            additionalDisallowedTags: [],
            attributeSanitizers: {},
        }
    ) {}

    /**
     * Get name of this plugin
     */
    getName() {
        return 'Paste';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IEditor) {
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

        const { htmlAttributes, clipboardData, fragment } = event;

        const pasteSource = getDocumentSource({
            htmlAttributes,
            fragment,
            clipboardItemTypes: clipboardData.types,
            htmlFirstLevelChildTags: clipboardData.htmlFirstLevelChildTags,
            environment: this.editor.getEnvironment(),
            rawHtml: clipboardData.rawHtml,
        });
        const pasteType = event.pasteType;

        switch (pasteSource) {
            case 'wordDesktop':
                processPastedContentFromWordDesktop(
                    event.domToModelOption,
                    event.htmlBefore || event.clipboardData.rawHtml || ''
                );
                break;
            case 'wacComponents':
                processPastedContentWacComponents(event);
                break;
            case 'excelOnline':
            case 'excelDesktop':
            case 'excelNonNativeEvent':
                if (pasteType === 'normal' || pasteType === 'mergeFormat') {
                    // Handle HTML copied from Excel
                    processPastedContentFromExcel(
                        event,
                        this.editor.getDOMCreator(),
                        !!this.allowExcelNoBorderTable,
                        pasteSource != 'excelNonNativeEvent' /* isNativeEvent */
                    );
                }
                break;
            case 'googleSheets':
                event.domToModelOption.additionalAllowedTags.push(
                    PastePropertyNames.GOOGLE_SHEET_NODE_NAME as Lowercase<string>
                );
                break;
            case 'powerPointDesktop':
                processPastedContentFromPowerPoint(event, this.editor.getDOMCreator());
                break;

            case 'oneNoteDesktop':
                processPastedContentFromOneNote(event);
                break;
        }

        addParser(event.domToModelOption, 'link', parseLink);
        addParser(event.domToModelOption, 'tableCell', deprecatedBorderColorParser);
        addParser(event.domToModelOption, 'tableCell', tableBorderParser);
        addParser(event.domToModelOption, 'table', deprecatedBorderColorParser);
        addParser(event.domToModelOption, 'image', imageSizeParser);
        setProcessor(event.domToModelOption, 'button', pasteButtonProcessor);

        if (pasteType === 'mergeFormat') {
            addParser(event.domToModelOption, 'block', blockElementParser);
            addParser(event.domToModelOption, 'listLevel', blockElementParser);
        }

        this.setEventSanitizers(event);
    }

    private setEventSanitizers(event: BeforePasteEvent) {
        if (this.domToModelForSanitizing) {
            const {
                styleSanitizers,
                attributeSanitizers,
                additionalAllowedTags,
                additionalDisallowedTags,
            } = this.domToModelForSanitizing;
            getObjectKeys(styleSanitizers).forEach(key =>
                chainSanitizerCallback(
                    event.domToModelOption.styleSanitizers,
                    key,
                    styleSanitizers[key]
                )
            );
            getObjectKeys(attributeSanitizers).forEach(key =>
                chainSanitizerCallback(
                    event.domToModelOption.attributeSanitizers,
                    key,
                    attributeSanitizers[key]
                )
            );
            event.domToModelOption.additionalAllowedTags.push(...additionalAllowedTags);
            event.domToModelOption.additionalDisallowedTags.push(...additionalDisallowedTags);
        }
    }
}
