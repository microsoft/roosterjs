import ClipBoardData from './ClipboardData';
import {
    ContentChangedEvent,
    PluginDomEvent,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';
import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import { processImages } from './PasteUtility';
import { convertInlineCss, fromHtml } from 'roosterjs-editor-dom';
import { insertImage } from 'roosterjs-editor-api';
import convertPastedContentFromWord from './wordConverter/convertPastedContentFromWord';
import normalizeContent from './normalizeContent';
import removeUnsafeTags from './removeUnsafeTags';
import retrieveClipBoardData from './retrieveClipBoardData';

const HTML_REGEX = /<html[^>]*>[\s\S]*<\/html>/i;

/**
 * PasteManager plugin, handles onPaste event and paste content into editor
 */
export default class PasteManager implements EditorPlugin {
    private editor: Editor;
    private pasteContainer: HTMLElement = null;

    /**
     * Create an instance of PasteManager
     * @param pasteHandler An optional pasteHandler to perform extra actions after pasting.
     * Default behavior is to paste image (if any) as BASE64 inline image.
     * @param useDirectHtml: This is a test parameter and may be removed in the future.
     * When set to true, we retrieve HTML from clipboard directly rather than using a hidden pasting DIV,
     * then filter out unsafe HTML tags and attributes.
     */
    constructor(
        private readonly pasteHandler?: (clipboardData: ClipBoardData) => void,
        private useDirectHtml?: boolean
    ) {}

    public initialize(editor: Editor) {
        this.editor = editor;
    }

    public dispose() {
        this.editor = null;
        if (this.pasteContainer && this.pasteContainer.parentNode) {
            this.pasteContainer.parentNode.removeChild(this.pasteContainer);
            this.pasteContainer = null;
        }
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
        this.pasteContainer = retrieveClipBoardData(
            pasteEvent,
            this.editor,
            this.processClipBoardData,
            this.pasteContainer,
            this.useDirectHtml);
    }

    private processClipBoardData = (clipboardData: ClipBoardData) => {
        if (clipboardData.textData && clipboardData.htmlData) {
            this.pasteHTML(clipboardData);
        } else if (clipboardData.imageData.file) {
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
    }

    private pasteHTML(clipboardData: ClipBoardData) {
        let html = clipboardData.htmlData;

        // There is text to paste, so clear any image data if any.
        // Otherwise both text and image will be pasted, this will cause duplicated paste
        if (this.useDirectHtml) {
            // 1. Remove content outside HTML tag if any
            let matches = HTML_REGEX.exec(html);
            html = matches ? matches[0] : html;

            // 2. Remove unsafe tags and attributes
            html = removeUnsafeTags(html);

            // 3. Convert inline css, so that Office documentations are showing well
            html = convertInlineCss(html);
        }

        // 4. Do other normalization
        html = normalizeContent(html);

        // 5. Prepare HTML fragment for pasting
        let document = this.editor.getDocument();
        let fragment = document.createDocumentFragment();
        let nodes = fromHtml(html, document);
        for (let node of nodes) {
            fragment.appendChild(node);
        }

        // 6. Process inline image
        processImages(fragment, clipboardData);

        // 7. Process content pasted from Word
        convertPastedContentFromWord(fragment);

        // 8. Insert content into body
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
