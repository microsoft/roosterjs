import buildClipboardData from './buildClipboardData';
import fragmentHandler from './fragmentHandler';
import textToHtml from './textToHtml';
import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import { getFormatState } from 'roosterjs-editor-api';
import { insertImage } from 'roosterjs-editor-api';
import {
    AttributeCallbackMap,
    getInheritableStyles,
    HtmlSanitizer,
    htmlToDom,
} from 'roosterjs-html-sanitizer';
import {
    BeforePasteEvent,
    ChangeSource,
    ClipboardData,
    DefaultFormat,
    NodeType,
    PasteOption,
    PluginEventType,
} from 'roosterjs-editor-types';
import {
    applyFormat,
    fromHtml,
    getFirstLeafNode,
    getNextLeafSibling,
    Position,
} from 'roosterjs-editor-dom';

/**
 * Paste plugin, handles onPaste event and paste content into editor
 */
export default class Paste implements EditorPlugin {
    private editor: Editor;
    private pasteDisposer: () => void;
    private sanitizer: HtmlSanitizer;

    /**
     * Create an instance of Paste
     * @param preserved Not used. Preserved parameter only used for compatibility with old code
     * @param attributeCallbacks A set of callbacks to help handle html attribute during sanitization
     */
    constructor(preserved?: any, attributeCallbacks?: AttributeCallbackMap) {
        this.sanitizer = new HtmlSanitizer({
            attributeCallbacks,
        });
    }

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

    private onPaste = (event: Event) => {
        buildClipboardData(<ClipboardEvent>event, this.editor, items => {
            this.pasteOriginal({
                snapshotBeforePaste: null,
                originalFormat: this.getCurrentFormat(),
                types: items.types,
                image: items.image,
                text: items.text,
                rawHtml: items.html,
                html: items.html ? this.sanitizeHtml(items.html) : textToHtml(items.text),
            });
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
                    this.applyToElements(
                        node,
                        this.applyFormatting(clipboardData.originalFormat, this.editor.isDarkMode())
                    );
                }
                fragment.appendChild(node);
            }
        }

        let event = this.editor.triggerPluginEvent(
            PluginEventType.BeforePaste,
            {
                clipboardData,
                fragment,
                pasteOption,
            },
            true /*broadcast*/
        );
        this.internalPaste(event);
    }

    private internalPaste(event: BeforePasteEvent) {
        let { clipboardData, fragment, pasteOption } = event;
        this.editor.focus();
        this.editor.addUndoSnapshot(() => {
            if (clipboardData.snapshotBeforePaste == null) {
                clipboardData.snapshotBeforePaste = this.editor.getContent(
                    false /*triggerExtractContentEvent*/,
                    true /*markSelection*/
                );
            } else {
                this.editor.setContent(clipboardData.snapshotBeforePaste);
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

            return clipboardData;
        }, ChangeSource.Paste);
    }

    private applyFormatting = (format: DefaultFormat, isDarkMode: boolean) => (
        element: HTMLElement
    ) => {
        applyFormat(element, format, isDarkMode);
    };

    private applyToElements(node: Node, elementTransform: (element: HTMLElement) => void) {
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
        parents.push(<HTMLElement>node);
        for (let parent of parents) {
            elementTransform(parent);
        }
    }

    private getCurrentFormat(): DefaultFormat {
        let format = getFormatState(this.editor);
        return format
            ? {
                  fontFamily: format.fontName,
                  fontSize: format.fontSize,
                  textColor: format.textColor,
                  backgroundColor: format.backgroundColor,
                  bold: format.isBold,
                  italic: format.isItalic,
                  underline: format.isUnderline,
              }
            : {};
    }

    private sanitizeHtml(html: string): string {
        let doc = htmlToDom(html, true /*preserveFragmentOnly*/, fragmentHandler);
        if (doc && doc.body) {
            this.sanitizer.convertGlobalCssToInlineCss(doc);

            let range = this.editor.getSelectionRange();
            let element = range && Position.getStart(range).normalize().element;
            let currentStyles = getInheritableStyles(element);
            this.sanitizer.sanitize(doc.body, currentStyles);
            return doc.body.innerHTML;
        }
        return '';
    }
}
