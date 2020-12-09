import {
    addRangeToSelection,
    extractClipboardEvent,
    fromHtml,
    readFile,
    setHtmlWithSelectionPath,
} from 'roosterjs-editor-dom';
import {
    ChangeSource,
    ClipboardData,
    ContentPosition,
    EditorPlugin,
    GetContentMode,
    IEditor,
    PluginEventType,
    ExperimentalFeatures,
} from 'roosterjs-editor-types';

const CONTAINER_HTML =
    '<div contenteditable style="width: 1px; height: 1px; overflow: hidden; position: fixed; top: 0; left; 0; -webkit-user-select: text"></div>';

/**
 * @internal
 * Copy and paste plugin for handling onCopy and onPaste event
 */
export default class CopyPastePlugin implements EditorPlugin {
    private editor: IEditor;
    private disposer: () => void;

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'CopyPaste';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.disposer = this.editor.addDomEventHandler({
            paste: this.onPaste,
            copy: e => this.onCutCopy(e, false /*isCut*/),
            cut: e => this.onCutCopy(e, true /*isCut*/),
        });
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.disposer();
        this.disposer = null;
        this.editor = null;
    }

    private onCutCopy(event: Event, isCut: boolean) {
        const originalRange = this.editor.getSelectionRange();
        if (originalRange && !originalRange.collapsed) {
            const html = this.editor.getContent(GetContentMode.RawHTMLWithSelection);
            const tempDiv = this.getTempDiv(true /*forceInLightMode*/);
            const newRange = setHtmlWithSelectionPath(tempDiv, html);

            if (newRange) {
                addRangeToSelection(newRange);
            }

            this.editor.triggerPluginEvent(PluginEventType.BeforeCutCopy, {
                clonedRoot: tempDiv,
                range: newRange,
                rawEvent: event as ClipboardEvent,
                isCut,
            });

            this.editor.runAsync(editor => {
                this.cleanUpAndRestoreSelection(tempDiv, originalRange);

                if (isCut) {
                    editor.addUndoSnapshot(() => {
                        const position = this.editor.deleteSelectedContent();
                        editor.focus();
                        editor.select(position);
                    }, ChangeSource.Cut);
                }
            });
        }
    }

    private onPaste = (event: Event) => {
        extractClipboardEvent(
            event as ClipboardEvent,
            items => {
                if (items.rawHtml === undefined) {
                    // Can't get pasted HTML directly, need to use a temp DIV to retrieve pasted content.
                    // This is mostly for IE
                    const originalSelectionRange = this.editor.getSelectionRange();
                    const tempDiv = this.getTempDiv();

                    this.editor.runAsync(() => {
                        items.rawHtml = tempDiv.innerHTML;
                        this.cleanUpAndRestoreSelection(tempDiv, originalSelectionRange);
                        this.paste(items);
                    });
                } else {
                    this.paste(items);
                }
            },
            {
                allowLinkPreview: this.editor.isFeatureEnabled(
                    ExperimentalFeatures.PasteWithLinkPreview
                ),
            }
        );
    };

    private paste(clipboardData: ClipboardData) {
        if (clipboardData.image) {
            readFile(clipboardData.image, dataUrl => {
                clipboardData.imageDataUri = dataUrl;
                this.editor.paste(clipboardData);
            });
        } else {
            this.editor.paste(clipboardData);
        }
    }

    private getTempDiv(forceInLightMode?: boolean) {
        const div = this.editor.getCustomData(
            'CopyPasteTempDiv',
            () => {
                const tempDiv = fromHtml(
                    CONTAINER_HTML,
                    this.editor.getDocument()
                )[0] as HTMLDivElement;
                this.editor.insertNode(tempDiv, {
                    position: ContentPosition.Outside,
                });

                return tempDiv;
            },
            tempDiv => tempDiv.parentNode?.removeChild(tempDiv)
        );

        if (forceInLightMode) {
            div.style.backgroundColor = 'white';
            div.style.color = 'black';
        }

        div.style.display = '';
        div.focus();

        return div;
    }

    private cleanUpAndRestoreSelection(tempDiv: HTMLDivElement, range: Range) {
        this.editor.select(range);
        tempDiv.style.backgroundColor = '';
        tempDiv.style.color = '';
        tempDiv.style.display = 'none';
        tempDiv.innerHTML = '';
    }
}
