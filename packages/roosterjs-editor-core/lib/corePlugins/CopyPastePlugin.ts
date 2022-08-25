import {
    addRangeToSelection,
    createElement,
    extractClipboardEvent,
    moveChildNodes,
    Browser,
    setHtmlWithMetadata,
    createRange,
} from 'roosterjs-editor-dom';
import {
    ChangeSource,
    ContentPosition,
    CopyPastePluginState,
    EditorOptions,
    GetContentMode,
    IEditor,
    PluginEventType,
    PluginWithState,
    KnownCreateElementDataIndex,
    SelectionRangeEx,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Copy and paste plugin for handling onCopy and onPaste event
 */
export default class CopyPastePlugin implements PluginWithState<CopyPastePluginState> {
    private editor: IEditor;
    private disposer: () => void;
    private state: CopyPastePluginState;

    /**
     * Construct a new instance of CopyPastePlugin
     * @param options The editor options
     */
    constructor(options: EditorOptions) {
        this.state = {
            allowedCustomPasteType: options.allowedCustomPasteType || [],
        };
    }

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

    /**
     * Get plugin state object
     */
    getState() {
        return this.state;
    }

    private onCutCopy(event: Event, isCut: boolean) {
        const selection = this.editor.getSelectionRangeEx();
        if (selection && !selection.areAllCollapsed) {
            const html = this.editor.getContent(GetContentMode.RawHTMLWithSelection);
            const tempDiv = this.getTempDiv(true /*forceInLightMode*/);
            const metadata = setHtmlWithMetadata(
                tempDiv,
                html,
                this.editor.getTrustedHTMLHandler()
            );
            const newRange =
                metadata?.type === SelectionRangeTypes.Normal
                    ? createRange(tempDiv, metadata.start, metadata.end)
                    : null;

            this.editor.triggerPluginEvent(PluginEventType.BeforeCutCopy, {
                clonedRoot: tempDiv,
                range: newRange,
                rawEvent: event as ClipboardEvent,
                isCut,
            });

            if (newRange) {
                addRangeToSelection(newRange);
            }

            this.editor.runAsync(editor => {
                this.cleanUpAndRestoreSelection(tempDiv, selection, !isCut /* isCopy */);

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
        let range: Range;

        extractClipboardEvent(
            event as ClipboardEvent,
            clipboardData => this.editor?.paste(clipboardData),
            {
                allowedCustomPasteType: this.state.allowedCustomPasteType,
                getTempDiv: () => {
                    range = this.editor?.getSelectionRange();
                    return this.getTempDiv();
                },
                removeTempDiv: div => {
                    this.cleanUpAndRestoreSelection(div, range, false /* isCopy */);
                },
            },
            this.editor?.getSelectionRange()
        );
    };

    private getTempDiv(forceInLightMode?: boolean) {
        const div = this.editor.getCustomData(
            'CopyPasteTempDiv',
            () => {
                const tempDiv = createElement(
                    KnownCreateElementDataIndex.CopyPasteTempDiv,
                    this.editor.getDocument()
                ) as HTMLDivElement;
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

    private cleanUpAndRestoreSelection(
        tempDiv: HTMLDivElement,
        range: Range | SelectionRangeEx,
        isCopy: boolean
    ) {
        if (!!(<SelectionRangeEx>range)?.type || (<SelectionRangeEx>range).type == 0) {
            const selection = <SelectionRangeEx>range;
            switch (selection.type) {
                case SelectionRangeTypes.TableSelection:
                    if (isCopy) {
                        this.editor.select(selection.table, selection.coordinates);
                    }
                    break;
                case SelectionRangeTypes.Normal:
                    const range = selection.ranges?.[0];
                    this.restoreRange(range, isCopy);
                    break;
            }
        } else {
            this.restoreRange(<Range>range, isCopy);
        }

        tempDiv.style.backgroundColor = '';
        tempDiv.style.color = '';
        tempDiv.style.display = 'none';
        moveChildNodes(tempDiv);
    }

    private restoreRange(range: Range, isCopy: boolean) {
        if (range) {
            if (isCopy && Browser.isAndroid) {
                range.collapse();
            }
            this.editor.select(range);
        }
    }
}
