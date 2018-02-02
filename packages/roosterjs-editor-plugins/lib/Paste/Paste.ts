import {
    BeforePasteEvent,
    ChangeSource,
    ClipboardData,
    DefaultFormat,
    NodeType,
    PasteOption,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';
import { applyFormat, fromHtml, getFirstLeafNode, getNextLeafSibling, textToHtml } from 'roosterjs-editor-dom';
import { Editor, EditorPlugin, buildSnapshot, restoreSnapshot } from 'roosterjs-editor-core';
import { insertImage } from 'roosterjs-editor-api';
import buildClipboardData from './buildClipboardData';
import convertPastedContentFromWord from './wordConverter/convertPastedContentFromWord';
import removeUnsafeTags from './removeUnsafeTags';

/**
 * Paste plugin, handles onPaste event and paste content into editor
 */
export default class Paste implements EditorPlugin {
    private editor: Editor;
    private pasteDisposer: () => void;

    /**
     * Create an instance of Paste
     * @param useDirectPaste: This is a test parameter and may be removed in the future.
     * When set to true, we retrieve HTML from clipboard directly rather than using a hidden pasting DIV,
     * then filter out unsafe HTML tags and attributes. Although we removed some unsafe tags such as SCRIPT,
     * OBJECT, ... But there is still risk to have other kinds of XSS scripts embeded. So please do NOT use
     * this parameter if you don't have other XSS detecting logic outside the edtior.
     */
    constructor(private useDirectPaste?: boolean) {}

    public initialize(editor: Editor) {
        this.editor = editor;
        this.pasteDisposer = editor.addDomEventHandler('paste', this.onPaste);
    }

    public dispose() {
        this.pasteDisposer();
        this.pasteDisposer = null;
        this.editor = null;
    }

    public onPluginEvent(event: PluginEvent) {
        if (event.eventType == PluginEventType.BeforePaste) {
            let beforePasteEvent = <BeforePasteEvent>event;
            if (beforePasteEvent.pasteOption == PasteOption.PasteHtml) {
                convertPastedContentFromWord(beforePasteEvent.fragment);
            }
        }
    }

    private onPaste = (event: Event) => {
        this.editor.addUndoSnapshot();
        buildClipboardData(
            <ClipboardEvent>event,
            this.editor,
            this.pasteOriginal,
            this.useDirectPaste ? removeUnsafeTags : null
        );
    };

    /**
     * Paste into editor using passed in clipboardData with original format
     * @param clipboardData The clipboardData to paste
     */
    public pasteOriginal = (clipboardData: ClipboardData) => {
        this.paste(clipboardData, this.detectPasteOption(clipboardData));
    };

    /**
     * Paste plain text into editor using passed in clipboardData
     * @param clipboardData The clipboardData to paste
     */
    public pasteText(clipboardData: ClipboardData) {
        this.paste(clipboardData, PasteOption.PasteText);
    }

    /**
     * Paste into editor using passed in clipboardData with curent format
     * @param clipboardData The clipboardData to paste
     */
    public pasteAndMergeFormat(clipboardData: ClipboardData) {
        this.paste(clipboardData, this.detectPasteOption(clipboardData), true /*mergeFormat*/);
    }

    private detectPasteOption(clipboardData: ClipboardData): PasteOption {
        return clipboardData.text || !clipboardData.image
            ? PasteOption.PasteHtml
            : PasteOption.PasteImage;
    }

    private paste(
        clipboardData: ClipboardData,
        pasteOption: PasteOption,
        mergeCurrentFormat?: boolean
    ) {
        let document = this.editor.getDocument();
        let fragment = document.createDocumentFragment();

        if (pasteOption == PasteOption.PasteHtml) {
            let html = clipboardData.html;
            let nodes = fromHtml(html, document);

            for (let node of nodes) {
                if (mergeCurrentFormat) {
                    this.applyTextFormat(node, clipboardData.originalFormat);
                }
                fragment.appendChild(node);
            }
        }

        let event: BeforePasteEvent = {
            eventType: PluginEventType.BeforePaste,
            clipboardData: clipboardData,
            fragment: fragment,
            pasteOption: pasteOption,
        };

        this.editor.triggerEvent(event, true /*broadcast*/);
        this.internalPaste(event);
    }

    private internalPaste(event: BeforePasteEvent) {
        let { clipboardData, fragment, pasteOption } = event;
        this.editor.focus();
        if (clipboardData.snapshotBeforePaste == null) {
            clipboardData.snapshotBeforePaste = buildSnapshot(this.editor);
        } else {
            restoreSnapshot(this.editor, clipboardData.snapshotBeforePaste);
        }

        switch (pasteOption) {
            case PasteOption.PasteHtml:
                this.editor.insertNode(fragment);
                break;

            case PasteOption.PasteText:
                let html = textToHtml(clipboardData.text);
                this.editor.insertContent(html);
                break;

            case PasteOption.PasteImage:
                insertImage(this.editor, clipboardData.image);
                break;
        }

        this.editor.triggerContentChangedEvent(ChangeSource.Paste, clipboardData);
        this.editor.addUndoSnapshot();
    }

    private applyTextFormat(node: Node, format: DefaultFormat) {
        let leaf = getFirstLeafNode(node);
        let parents: HTMLElement[] = [];
        while (leaf) {
            if (
                leaf.nodeType == NodeType.Text &&
                leaf.parentElement &&
                parents.indexOf(leaf.parentElement) < 0
            ) {
                parents.push(leaf.parentElement);
            }
            leaf = getNextLeafSibling(node, leaf);
        }
        for (let parent of parents) {
            applyFormat(parent, format);
        }
    }
}
