import { applyDefaultFormat } from './utils/applyDefaultFormat';
import { applyPendingFormat } from './utils/applyPendingFormat';
import { getObjectKeys, isBlockElement, isNodeOfType } from 'roosterjs-content-model-dom';
import { isCharacterValue, isCursorMovingKey } from '../publicApi/domUtils/eventUtils';
import type {
    FormatPluginState,
    IStandaloneEditor,
    PluginEvent,
    PluginWithState,
    StandaloneEditorOptions,
} from 'roosterjs-content-model-types';

// During IME input, KeyDown event will have "Process" as key
const ProcessKey = 'Process';

/**
 * FormatPlugin plugins helps editor to do formatting on top of content model.
 * This includes:
 * 1. Handle pending format changes when selection is collapsed
 */
class FormatPlugin implements PluginWithState<FormatPluginState> {
    private editor: IStandaloneEditor | null = null;
    private hasDefaultFormat = false;
    private state: FormatPluginState;

    /**
     * Construct a new instance of FormatPlugin class
     * @param option The editor option
     */
    constructor(option: StandaloneEditorOptions) {
        this.state = {
            defaultFormat: { ...option.defaultSegmentFormat },
            pendingFormat: null,
        };
    }

    /**
     * Get name of this plugin
     */
    getName() {
        return 'Format';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IStandaloneEditor) {
        this.editor = editor;
        this.hasDefaultFormat =
            getObjectKeys(this.state.defaultFormat).filter(
                x => typeof this.state.defaultFormat[x] !== 'undefined'
            ).length > 0;
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        this.editor = null;
    }

    /**
     * Get plugin state object
     */
    getState(): FormatPluginState {
        return this.state;
    }

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: PluginEvent) {
        if (!this.editor) {
            return;
        }

        switch (event.eventType) {
            case 'input':
                const env = this.editor.getEnvironment();

                // In Safari, isComposing will be undefined but isInIME() works
                // For Android, we can skip checking isComposing since this property is not always reliable in all IME,
                // and we have tested without this check it can still work correctly
                if (env.isAndroid || (!event.rawEvent.isComposing && !this.editor.isInIME())) {
                    this.checkAndApplyPendingFormat(event.rawEvent.data);
                }

                break;

            case 'compositionEnd':
                this.checkAndApplyPendingFormat(event.rawEvent.data);
                break;

            case 'keyDown':
                if (isCursorMovingKey(event.rawEvent)) {
                    this.clearPendingFormat();
                } else if (
                    this.hasDefaultFormat &&
                    (isCharacterValue(event.rawEvent) || event.rawEvent.key == ProcessKey) &&
                    this.shouldApplyDefaultFormat(this.editor)
                ) {
                    applyDefaultFormat(this.editor, this.state.defaultFormat);
                }

                break;

            case 'mouseUp':
            case 'contentChanged':
                if (!this.canApplyPendingFormat()) {
                    this.clearPendingFormat();
                }
                break;
        }
    }

    private checkAndApplyPendingFormat(data: string | null) {
        if (this.editor && data && this.state.pendingFormat) {
            applyPendingFormat(this.editor, data, this.state.pendingFormat.format);
            this.clearPendingFormat();
        }
    }

    private clearPendingFormat() {
        this.state.pendingFormat = null;
    }

    /**
     * @internal
     * Check if this editor can apply pending format
     * @param editor The editor to get format from
     */
    private canApplyPendingFormat(): boolean {
        let result = false;

        if (this.state.pendingFormat && this.editor) {
            const selection = this.editor.getDOMSelection();
            const range =
                selection?.type == 'range' && selection.range.collapsed ? selection.range : null;
            const { posContainer, posOffset } = this.state.pendingFormat;

            if (range && range.startContainer == posContainer && range.startOffset == posOffset) {
                result = true;
            }
        }

        return result;
    }

    private shouldApplyDefaultFormat(editor: IStandaloneEditor): boolean {
        const selection = editor.getDOMSelection();
        const range = selection?.type == 'range' ? selection.range : null;
        const posContainer = range?.startContainer ?? null;

        if (posContainer) {
            const domHelper = editor.getDOMHelper();
            let element: HTMLElement | null = isNodeOfType(posContainer, 'ELEMENT_NODE')
                ? posContainer
                : posContainer.parentElement;

            while (element?.parentElement && domHelper.isNodeInEditor(element.parentElement)) {
                if (element.getAttribute?.('style')) {
                    return false;
                } else if (isBlockElement(element)) {
                    break;
                }

                element = element.parentElement;
            }

            return true;
        } else {
            return false;
        }
    }
}

/**
 * @internal
 * Create a new instance of FormatPlugin.
 * @param option The editor option
 */
export function createFormatPlugin(
    option: StandaloneEditorOptions
): PluginWithState<FormatPluginState> {
    return new FormatPlugin(option);
}
