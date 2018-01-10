import {
    ClipBoardData,
    ContentChangedEvent,
    PluginDomEvent,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';
import { Editor, EditorPlugin, buildSnapshot, restoreSnapshot } from 'roosterjs-editor-core';
import { buildClipBoardData, insertImage } from 'roosterjs-editor-api';
import convertPastedContentFromWord from './wordConverter/convertPastedContentFromWord';
import removeUnsafeTags from './removeUnsafeTags';

/**
 * Paste option
 */
export const enum PasteOption {
    /**
     * Paste with original format when copy
     */
    PasteAsIs = 0,

    /**
     * Paste as plain text, remove any format
     */
    PasteText = 1,

    /**
     * Paste using current format
     */
    PasteWithCurrentFormat = 2,
}

/**
 * PasteManager plugin, handles onPaste event and paste content into editor
 */
export default class PasteManager implements EditorPlugin {
    private editor: Editor;

    /**
     * Create an instance of PasteManager
     * @param pasteHandler An optional pasteHandler to perform extra actions after pasting.
     * Default behavior is to paste image (if any) as BASE64 inline image.
     * @param useDirectPaste: This is a test parameter and may be removed in the future.
     * When set to true, we retrieve HTML from clipboard directly rather than using a hidden pasting DIV,
     * then filter out unsafe HTML tags and attributes. Although we removed some unsafe tags such as SCRIPT,
     * OBJECT, ... But there is still risk to have other kinds of XSS scripts embeded. So please do NOT use
     * this parameter if you don't have other XSS detecting logic outside the edtior.
     * @param defaultPasteOption: Default option of pasting. Default value is PasteAsIs
     */
    constructor(
        private readonly imageHandler?: (clipboardData: ClipBoardData) => void,
        private useDirectPaste?: boolean,
        private defaultPasteOption: PasteOption = PasteOption.PasteAsIs
    ) {}

    public initialize(editor: Editor) {
        this.editor = editor;
    }

    public dispose() {
        this.editor = null;
    }

    public willHandleEventExclusively(event: PluginEvent): boolean {
        return event.eventType == PluginEventType.Paste;
    }

    public onPluginEvent(event: PluginEvent) {
        if (event.eventType != PluginEventType.Paste) {
            return;
        }

        // add undo snapshot before paste
        this.editor.addUndoSnapshot();
        let pasteEvent = <ClipboardEvent>(<PluginDomEvent>event).rawEvent;
        buildClipBoardData(
            pasteEvent,
            this.editor,
            data => this.paste(data, this.defaultPasteOption),
            this.useDirectPaste ? removeUnsafeTags : null
        );
    }

    paste = (clipboardData: ClipBoardData, pasteOption: PasteOption) => {
        if (!clipboardData) {
            return;
        }

        if (clipboardData.snapshotBeforePaste == null) {
            clipboardData.snapshotBeforePaste = buildSnapshot(this.editor);
        } else {
            restoreSnapshot(this.editor, clipboardData.snapshotBeforePaste);
        }

        switch (pasteOption) {
            case PasteOption.PasteAsIs:
                this.pasteHTML(clipboardData);
                break;

            case PasteOption.PasteText:
                this.pasteText(clipboardData);
                break;

            case PasteOption.PasteWithCurrentFormat:
                this.pasteWithCurrentFormat(clipboardData);
                break;
        }

        // broadcast contentChangedEvent to ensure the snapshot actually gets added
        let contentChangedEvent: ContentChangedEvent = {
            eventType: PluginEventType.ContentChanged,
            source: 'Paste',
            data: clipboardData,
        };
        this.editor.triggerEvent(contentChangedEvent, true /* broadcast */);

        // add undo snapshot after paste
        this.editor.addUndoSnapshot();
    };

    private pasteHTML(clipboardData: ClipBoardData, fragmentOverride?: DocumentFragment) {
        if (clipboardData.textData || !clipboardData.imageData.file) {
            let fragment = fragmentOverride || clipboardData.htmlFragment;
            convertPastedContentFromWord(fragment);
            this.editor.insertNode(fragment);
        } else {
            let pasteHandler = this.imageHandler || this.defaultImageHandler;
            pasteHandler(clipboardData);
        }

    }

    private pasteText(clipboardData: ClipBoardData) {
        let text = clipboardData.textData || '';
        let html = text.replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;');
        this.editor.insertContent(html);
    }

    private pasteWithCurrentFormat(clipboardData: ClipBoardData) {
        throw new Error('Not implemented');
    }

    private defaultImageHandler = (clipboardData: ClipBoardData) => {
        let file = clipboardData.imageData ? clipboardData.imageData.file : null;
        if (file) {
            insertImage(this.editor, file);
        }
    };
}
