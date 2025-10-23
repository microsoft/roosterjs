import { addRangeToSelection } from '../../coreApi/setDOMSelection/addRangeToSelection';
import { deleteEmptyList } from './utils/deleteEmptyList';
import { paste } from '../../command/paste/paste';
import { triggerBeforeCutCopyEvent } from '../../command/cutCopy/triggerBeforeCutCopyEvent';
import {
    ChangeSource,
    contentModelToText,
    deleteSelection,
    extractClipboardItems,
    normalizeContentModel,
    toArray,
} from 'roosterjs-content-model-dom';
import type {
    ClipboardData,
    CopyPastePluginState,
    IEditor,
    EditorOptions,
    PluginWithState,
} from 'roosterjs-content-model-types';

/**
 * Copy and paste plugin for handling onCopy and onPaste event
 */
class CopyPastePlugin implements PluginWithState<CopyPastePluginState> {
    private editor: IEditor | null = null;
    private disposer: (() => void) | null = null;
    private state: CopyPastePluginState;

    /**
     * Construct a new instance of CopyPastePlugin
     * @param option The editor option
     */
    constructor(option: EditorOptions) {
        this.state = {
            allowedCustomPasteType: option.allowedCustomPasteType || [],
            tempDiv: null,
            defaultPasteType: option.defaultPasteType,
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
        this.disposer = this.editor.attachDomEvent({
            paste: {
                beforeDispatch: e => this.onPaste(e),
            },
            copy: {
                beforeDispatch: e => this.onCutCopy(e, false /*isCut*/),
            },
            cut: {
                beforeDispatch: e => this.onCutCopy(e, true /*isCut*/),
            },
        });
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        if (this.state.tempDiv) {
            this.state.tempDiv.parentNode?.removeChild(this.state.tempDiv);
            this.state.tempDiv = null;
        }

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
        if (!this.editor) {
            return;
        }

        const beforeCutCopyEvent = triggerBeforeCutCopyEvent(
            this.editor,
            isCut,
            event as ClipboardEvent
        );

        if (beforeCutCopyEvent) {
            const { clonedRoot, range, pasteModel } = beforeCutCopyEvent;

            if (isClipboardEvent(event)) {
                event.preventDefault();
                const text = pasteModel ? contentModelToText(pasteModel) : '';
                event.clipboardData?.setData('text/html', clonedRoot.innerHTML);
                event.clipboardData?.setData('text/plain', text);
            } else if (range) {
                const doc = this.editor.getDocument();
                addRangeToSelection(doc, range);
            }

            const selection = this.editor.getDOMSelection();

            if (!this.editor) {
                return;
            }

            this.editor.setDOMSelection(selection);
            this.editor.focus();

            if (isCut) {
                this.editor.formatContentModel(
                    (model, context) => {
                        if (
                            deleteSelection(model, [deleteEmptyList], context).deleteResult ==
                            'range'
                        ) {
                            normalizeContentModel(model);
                        }

                        return true;
                    },
                    {
                        apiName: 'cut',
                        changeSource: ChangeSource.Cut,
                    }
                );
            }
        }
    }

    private onPaste = (event: Event) => {
        if (this.editor && isClipboardEvent(event)) {
            const editor = this.editor;

            const dataTransfer = event.clipboardData;

            if (shouldPreventDefaultPaste(dataTransfer, editor)) {
                event.preventDefault();
                extractClipboardItems(
                    toArray(dataTransfer!.items),
                    this.state.allowedCustomPasteType
                ).then((clipboardData: ClipboardData) => {
                    if (!editor.isDisposed()) {
                        paste(editor, clipboardData, this.state.defaultPasteType);
                    }
                });
            }
        }
    };
}

function isClipboardEvent(event: Event): event is ClipboardEvent {
    return !!(event as ClipboardEvent).clipboardData;
}

/**
 * @internal
 * Exported only for unit testing
 */
export function shouldPreventDefaultPaste(
    dataTransfer: DataTransfer | null,
    editor: IEditor
): boolean {
    if (!dataTransfer?.items) {
        return false;
    }

    if (!editor.getEnvironment().isAndroid) {
        return true;
    }

    // On Android, the clipboard data from Office apps is a file, which can't be loaded
    // so we have to allow the default browser behavior
    return toArray(dataTransfer.items).some(item => {
        const { type } = item;
        const isNormalFile = item.kind === 'file' && type !== '';
        const isText = type.indexOf('text/') === 0;
        return isNormalFile || isText;
    });
}

/**
 * @internal
 * Create a new instance of CopyPastePlugin
 * @param option The editor option
 */
export function createCopyPastePlugin(
    option: EditorOptions
): PluginWithState<CopyPastePluginState> {
    return new CopyPastePlugin(option);
}
