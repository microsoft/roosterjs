import contentModelToDom from '../../modelToDom/contentModelToDom';
import { deleteSelection } from '../../modelApi/selection/deleteSelections';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import {
    addRangeToSelection,
    createElement,
    moveChildNodes,
    createRange,
    extractClipboardItems,
    toArray,
    Browser,
} from 'roosterjs-editor-dom';
import {
    ChangeSource,
    CopyPastePluginState,
    EditorOptions,
    IEditor,
    PluginEventType,
    PluginWithState,
    KnownCreateElementDataIndex,
    PositionType,
    ClipboardData,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Copy and paste plugin for handling onCopy and onPaste event
 */
export default class ContentModelCopyPastePlugin implements PluginWithState<CopyPastePluginState> {
    private editor: IContentModelEditor | null = null;
    private disposer: (() => void) | null = null;
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
        this.editor = editor as IContentModelEditor;
        this.disposer = this.editor.addDomEventHandler({
            paste: e => this.onPaste(e),
            copy: e => this.onCutCopy(e, false /*isCut*/),
            cut: e => this.onCutCopy(e, true /*isCut*/),
        });
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        if (this.disposer) {
            this.disposer();
        }
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
        if (this.editor) {
            const selection = this.editor.getSelectionRangeEx();
            if (selection && !selection.areAllCollapsed) {
                const model = this.editor.createContentModel({
                    allowCacheElement: false,
                });

                const result = deleteSelection(model);
                const copyCutModel = result.deletedModel;

                const tempDiv = this.getTempDiv(this.editor, true /*forceInLightMode*/);
                const selectionAfterPaste = contentModelToDom(
                    tempDiv.ownerDocument,
                    tempDiv,
                    copyCutModel,
                    {
                        isDarkMode: this.editor.isDarkMode(),
                        darkColorHandler: this.editor.getDarkColorHandler(),
                    }
                );

                let newRange: Range = createRange(
                    tempDiv,
                    PositionType.Begin,
                    tempDiv,
                    PositionType.End
                );
                if (newRange) {
                    const cutCopyEvent = this.editor.triggerPluginEvent(
                        PluginEventType.BeforeCutCopy,
                        {
                            clonedRoot: tempDiv,
                            range: newRange,
                            rawEvent: event as ClipboardEvent,
                            isCut,
                        }
                    );

                    if (cutCopyEvent.range) {
                        addRangeToSelection(newRange);
                    }

                    this.editor.runAsync(editor => {
                        cleanUpAndRestoreSelection(tempDiv);
                        editor.focus();
                        if (selectionAfterPaste) {
                            this.editor?.select(selectionAfterPaste);
                        }
                        if (isCut) {
                            editor.addUndoSnapshot(() => {
                                this.editor?.setContentModel(model);
                            }, ChangeSource.Cut);
                        }
                    });
                }
            }
        }
    }

    private onPaste = (event: Event) => {
        if (this.editor && isClipboardEvent(event)) {
            const editor = this.editor;

            const dataTransfer = event.clipboardData;

            if (dataTransfer?.items) {
                event.preventDefault();
                extractClipboardItems(toArray(dataTransfer.items), {
                    allowedCustomPasteType: this.state.allowedCustomPasteType,
                }).then((clipboardData: ClipboardData) => {
                    if (!editor.isDisposed()) {
                        removeContentForAndroid(editor);
                        editor.paste(clipboardData);
                    }
                });
            }
        }
    };

    private getTempDiv(editor: IEditor, forceInLightMode?: boolean) {
        const div = editor.getCustomData(
            'CopyPasteTempDiv',
            () => {
                const tempDiv = createElement(
                    KnownCreateElementDataIndex.CopyPasteTempDiv,
                    editor.getDocument()
                ) as HTMLDivElement;

                editor.getDocument().body.appendChild(tempDiv);

                return tempDiv;
            },
            tempDiv => tempDiv.parentNode?.removeChild(tempDiv)
        );

        if (forceInLightMode) {
            div.style.backgroundColor = 'white';
            div.style.color = 'black';
        }

        div.childNodes.forEach(div.removeChild);

        div.style.display = '';
        div.focus();

        return div;
    }
}

function cleanUpAndRestoreSelection(tempDiv: HTMLDivElement) {
    tempDiv.style.backgroundColor = '';
    tempDiv.style.color = '';
    tempDiv.style.display = 'none';
    moveChildNodes(tempDiv);
}
function isClipboardEvent(event: Event): event is ClipboardEvent {
    return !!(event as ClipboardEvent).clipboardData;
}
function removeContentForAndroid(editor: IContentModelEditor) {
    if (Browser.isAndroid) {
        const model = editor.createContentModel();
        deleteSelection(model);
        editor.setContentModel(model);
    }
}
