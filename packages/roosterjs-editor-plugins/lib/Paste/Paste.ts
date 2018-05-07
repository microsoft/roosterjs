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
import {
    SanitizeHtmlPropertyCallback,
    applyFormat,
    fromHtml,
    getFirstLeafNode,
    getNextLeafSibling,
    sanitizeHtml,
} from 'roosterjs-editor-dom';
import { Editor, EditorPlugin, buildSnapshot, restoreSnapshot } from 'roosterjs-editor-core';
import { insertImage } from 'roosterjs-editor-api';
import getInheritableStyles from './getInheritableStyles';
import buildClipboardData from './buildClipboardData';
import convertPastedContentFromWord from './wordConverter/convertPastedContentFromWord';
import textToHtml from './textToHtml';

/**
 * Paste plugin, handles onPaste event and paste content into editor
 */
export default class Paste implements EditorPlugin {
    private editor: Editor;
    private pasteDisposer: () => void;

    /**
     * Create an instance of Paste
     */
    constructor(private htmlPropertyCallbacks?: SanitizeHtmlPropertyCallback) {}

    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    public initialize(editor: Editor) {
        this.editor = editor;
        this.pasteDisposer = editor.addDomEventHandler('paste', this.onPaste);
    }

    /**
     * Dispose this plugin
     */
    public dispose() {
        this.pasteDisposer();
        this.pasteDisposer = null;
        this.editor = null;
    }

    /**
     * Handle plugin events
     * @param event The event object
     */
    public onPluginEvent(event: PluginEvent) {
        if (event.eventType == PluginEventType.BeforePaste) {
            let beforePasteEvent = <BeforePasteEvent>event;

            if (beforePasteEvent.pasteOption == PasteOption.PasteHtml) {
                convertPastedContentFromWord(beforePasteEvent.fragment);
            }
        }
    }

    private onPaste = (event: Event) => {
        buildClipboardData(<ClipboardEvent>event, this.editor, clipboardData => {
            if (!this.editor) {
                return;
            }
            if (!clipboardData.html && clipboardData.text) {
                clipboardData.html = textToHtml(clipboardData.text);
            }
            let currentStyles = getInheritableStyles(this.editor);
            clipboardData.html = sanitizeHtml(
                clipboardData.html,
                null /*additionalStyleNodes*/,
                false /*convertInlineCssOnly*/,
                this.htmlPropertyCallbacks,
                currentStyles,
                true /*preserveFragmentOnly*/
            );
            this.pasteOriginal(clipboardData);
        });
    };

    /**
     * Paste into editor using passed in clipboardData with original format
     * @param clipboardData The clipboardData to paste
     */
    public pasteOriginal(clipboardData: ClipboardData) {
        this.paste(clipboardData, this.detectPasteOption(clipboardData));
    }

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

        this.editor.runWithUndo(
            () => {
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
            },
            ChangeSource.Paste,
            () => clipboardData
        );
    }

    private applyTextFormat(node: Node, format: DefaultFormat) {
        let leaf = getFirstLeafNode(node);
        let parents: HTMLElement[] = [];
        while (leaf) {
            if (
                leaf.nodeType == NodeType.Text &&
                leaf.parentNode &&
                parents.indexOf(<HTMLElement>leaf.parentNode) < 0
            ) {
                parents.push(<HTMLElement>leaf.parentNode);
            }
            leaf = getNextLeafSibling(node, leaf);
        }
        for (let parent of parents) {
            applyFormat(parent, format);
        }
    }
}
