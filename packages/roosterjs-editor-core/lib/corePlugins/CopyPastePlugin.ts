import isNodeAfter from 'roosterjs-editor-dom/lib/utils/isNodeAfter';
import {
    addRangeToSelection,
    createElement,
    extractClipboardEvent,
    setHtmlWithSelectionPath,
    moveChildNodes,
    Browser,
    safeInstanceOf,
    VTable,
} from 'roosterjs-editor-dom';
import {
    ChangeSource,
    ContentPosition,
    CopyPastePluginState,
    EditorOptions,
    GetContentMode,
    IEditor,
    PluginEventType,
    ExperimentalFeatures,
    PluginWithState,
    KnownCreateElementDataIndex,
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
        let originalRange = this.editor.getSelectionRange();
        const tableSelection = this.editor.getTableSelection();
        const { firstTarget, vSelection, lastTarget, startRange, endRange } = tableSelection || {};
        if (originalRange.collapsed && vSelection) {
            if (isNodeAfter(firstTarget, lastTarget)) {
                originalRange.setStartBefore(lastTarget);
                originalRange.setEndAfter(firstTarget);
            } else {
                originalRange.setStartBefore(firstTarget);
                originalRange.setEndAfter(lastTarget);
            }
            this.editor.select(originalRange);
        }

        if (originalRange && !originalRange.collapsed) {
            const html = this.editor.getContent(GetContentMode.RawHTMLWithSelection);
            const tempDiv = this.getTempDiv(true /*forceInLightMode*/);
            const newRange = setHtmlWithSelectionPath(
                tempDiv,
                html,
                this.editor.getTrustedHTMLHandler()
            );

            if (newRange) {
                addRangeToSelection(newRange);
            }

            this.editor.triggerPluginEvent(PluginEventType.BeforeCutCopy, {
                clonedRoot: tempDiv,
                range: newRange,
                rawEvent: event as ClipboardEvent,
                isCut,
                vTableSelection: vSelection,
                vTableStartRange: startRange,
                vTableEndRange: endRange,
            });

            this.editor.runAsync(editor => {
                this.cleanUpAndRestoreSelection(tempDiv, originalRange);

                if (vSelection) {
                    if (vSelection && safeInstanceOf(firstTarget, 'HTMLTableCellElement')) {
                        const vTable = new VTable(firstTarget);
                        vTable.highlightSelection(startRange, endRange);
                        originalRange.setStartBefore(lastTarget);
                        originalRange.collapse(true);
                    }
                }
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
            clipboardData => this.editor.paste(clipboardData),
            {
                allowLinkPreview: this.editor.isFeatureEnabled(
                    ExperimentalFeatures.PasteWithLinkPreview
                ),
                allowedCustomPasteType: this.state.allowedCustomPasteType,
                getTempDiv: () => {
                    range = this.editor.getSelectionRange();
                    return this.getTempDiv();
                },
                removeTempDiv: div => {
                    this.cleanUpAndRestoreSelection(div, range);
                },
            }
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

    private cleanUpAndRestoreSelection(tempDiv: HTMLDivElement, range: Range) {
        if (Browser.isAndroid) {
            range.collapse();
        }

        this.editor.select(range);

        tempDiv.style.backgroundColor = '';
        tempDiv.style.color = '';
        tempDiv.style.display = 'none';
        moveChildNodes(tempDiv);
    }
}
