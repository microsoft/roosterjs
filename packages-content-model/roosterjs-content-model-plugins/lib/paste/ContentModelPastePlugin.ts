import addParser from './utils/addParser';
import { blockElementParser } from './utils/parsers/blockElementParser';
import { deprecatedBorderColorParser } from './utils/parsers/deprecatedColorParser';
import { getPasteSource } from './pasteSourceValidations/getPasteSource';
import { linkSegmentParser } from './utils/parsers/linkSegmentParser';
import { parseLink } from './utils/parsers/linkParser';
import { PastePropertyNames } from './pasteSourceValidations/constants';
import { PasteType as OldPasteType, PluginEventType } from 'roosterjs-editor-types';
import { processPastedContentFromExcel } from './Excel/processPastedContentFromExcel';
import { processPastedContentFromPowerPoint } from './PowerPoint/processPastedContentFromPowerPoint';
import { processPastedContentFromWordDesktop } from './WordDesktop/processPastedContentFromWordDesktop';
import { processPastedContentWacComponents } from './WacComponents/processPastedContentWacComponents';
import { tableBorderParser } from './utils/parsers/tableBorderParser';
import type { IContentModelEditor } from 'roosterjs-content-model-editor';
import type { ContentModelBeforePasteEvent, PasteType } from 'roosterjs-content-model-types';
import type { EditorPlugin, IEditor, PluginEvent } from 'roosterjs-editor-types';

// Map old PasteType to new PasteType
// TODO: We can remove this once we have standalone editor
const PasteTypeMap: Record<OldPasteType, PasteType> = {
    [OldPasteType.AsImage]: 'asImage',
    [OldPasteType.AsPlainText]: 'asPlainText',
    [OldPasteType.MergeFormat]: 'mergeFormat',
    [OldPasteType.Normal]: 'normal',
};

/**
 * Paste plugin, handles BeforePaste event and reformat some special content, including:
 * 1. Content copied from Word
 * 2. Content copied from Excel
 * 3. Content copied from Word Online or OneNote Online
 * 4. Content copied from Power Point
 * (This class is still under development, and may still be changed in the future with some breaking changes)
 */
export class ContentModelPastePlugin implements EditorPlugin {
    private editor: IContentModelEditor | null = null;

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
    initialize(editor: IEditor) {
        // TODO: Later we may need a different interface for Content Model editor plugin
        this.editor = editor as IContentModelEditor;
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
        if (!this.editor || event.eventType != PluginEventType.BeforePaste) {
            return;
        }

        const ev = event as ContentModelBeforePasteEvent;

        if (!ev.domToModelOption) {
            return;
        }

        const pasteSource = getPasteSource(ev, false);
        const pasteType = PasteTypeMap[ev.pasteType];

        switch (pasteSource) {
            case 'wordDesktop':
                processPastedContentFromWordDesktop(ev, this.editor.getTrustedHTMLHandler());
                break;
            case 'wacComponents':
                processPastedContentWacComponents(ev);
                break;
            case 'excelOnline':
            case 'excelDesktop':
                if (pasteType === 'normal' || pasteType === 'mergeFormat') {
                    // Handle HTML copied from Excel
                    processPastedContentFromExcel(
                        ev,
                        this.editor.getTrustedHTMLHandler(),
                        this.allowExcelNoBorderTable
                    );
                }
                break;
            case 'googleSheets':
                ev.domToModelOption.additionalAllowedTags.push(
                    PastePropertyNames.GOOGLE_SHEET_NODE_NAME
                );
                break;
            case 'powerPointDesktop':
                processPastedContentFromPowerPoint(ev, this.editor.getTrustedHTMLHandler());
                break;
        }

        addParser(ev.domToModelOption, 'link', parseLink);
        addParser(ev.domToModelOption, 'tableCell', deprecatedBorderColorParser);
        addParser(ev.domToModelOption, 'tableCell', tableBorderParser);
        addParser(ev.domToModelOption, 'table', deprecatedBorderColorParser);
        addParser(ev.domToModelOption, 'segment', linkSegmentParser);

        if (pasteType === 'mergeFormat') {
            addParser(ev.domToModelOption, 'block', blockElementParser);
            addParser(ev.domToModelOption, 'listLevel', blockElementParser);
        }
    }
}
