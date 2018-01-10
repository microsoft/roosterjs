import {
    ClipBoardData,
    ContentChangedEvent,
    PluginDomEvent,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';
import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import { buildClipBoardData, insertImage } from 'roosterjs-editor-api';
import convertPastedContentFromWord from './wordConverter/convertPastedContentFromWord';
import removeUnsafeTags from './removeUnsafeTags';

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
     */
    constructor(
        private readonly pasteHandler?: (clipboardData: ClipBoardData) => void,
        private useDirectPaste?: boolean
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
            this.onPaste,
            this.useDirectPaste ? removeUnsafeTags : null
        );
    }

    private onPaste = (clipboardData: ClipBoardData) => {
        if (clipboardData.textData || !clipboardData.imageData.file) {
            this.pasteHTML(clipboardData);
        } else {
            this.pasteImage(clipboardData);
        }

        // broadcast contentChangedEvent to ensure the snapshot actually gets added
        let contentChangedEvent: ContentChangedEvent = {
            eventType: PluginEventType.ContentChanged,
            source: 'Paste',
        };
        this.editor.triggerEvent(contentChangedEvent, true /* broadcast */);

        // add undo snapshot after paste
        this.editor.addUndoSnapshot();
    };

    private pasteHTML(clipboardData: ClipBoardData) {
        let fragment = clipboardData.htmlFragment;
        convertPastedContentFromWord(fragment);
        this.editor.insertNode(fragment);
    }

    private pasteImage(clipboardData: ClipBoardData) {
        let pasteHandler = this.pasteHandler || this.defaultPasteHandler;
        if (clipboardData) {
            // if any clipboard data exists, call into pasteHandler
            pasteHandler(clipboardData);
        }
    }

    private defaultPasteHandler = (clipboardData: ClipBoardData) => {
        let file = clipboardData.imageData ? clipboardData.imageData.file : null;
        if (file) {
            insertImage(this.editor, file);
        }
    };
}
