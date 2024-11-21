import { applyDefaultFormat } from './applyDefaultFormat';
import { applyPendingFormat } from './applyPendingFormat';
import {
    getObjectKeys,
    isBlockElement,
    isCharacterValue,
    isCursorMovingKey,
    isNodeOfType,
} from 'roosterjs-content-model-dom';
import type {
    BackgroundColorFormat,
    FontFamilyFormat,
    FontSizeFormat,
    FormatPluginState,
    IEditor,
    PluginEvent,
    PluginWithState,
    EditorOptions,
    TextColorFormat,
    DOMHelper,
} from 'roosterjs-content-model-types';

// During IME input, KeyDown event will have "Process" as key
const ProcessKey = 'Process';
// For some Android IME, KeyDown event will have "Unidentified" as key
const UnidentifiedKey = 'Unidentified';
const DefaultStyleKeyMap: Record<
    keyof (FontFamilyFormat & FontSizeFormat & TextColorFormat & BackgroundColorFormat),
    keyof CSSStyleDeclaration
> = {
    backgroundColor: 'backgroundColor',
    textColor: 'color',
    fontFamily: 'fontFamily',
    fontSize: 'fontSize',
};

/**
 * FormatPlugin plugins helps editor to do formatting on top of content model.
 * This includes:
 * 1. Handle pending format changes when selection is collapsed
 */
class FormatPlugin implements PluginWithState<FormatPluginState> {
    private editor: IEditor | null = null;
    private defaultFormatKeys: Set<keyof CSSStyleDeclaration>;
    private state: FormatPluginState;
    private lastCheckedNode: Node | null = null;

    /**
     * Construct a new instance of FormatPlugin class
     * @param option The editor option
     */
    constructor(option: EditorOptions) {
        this.state = {
            defaultFormat: { ...option.defaultSegmentFormat },
            pendingFormat: null,
            applyDefaultFormatChecker: option.applyDefaultFormatChecker ?? null,
        };

        this.defaultFormatKeys = new Set<keyof CSSStyleDeclaration>();

        getObjectKeys(DefaultStyleKeyMap).forEach(key => {
            if (this.state.defaultFormat[key]) {
                this.defaultFormatKeys.add(DefaultStyleKeyMap[key]);
            }
        });
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
    initialize(editor: IEditor) {
        this.editor = editor;
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
                this.checkAndApplyPendingFormat(event.rawEvent.data);

                break;

            case 'compositionEnd':
                this.checkAndApplyPendingFormat(event.rawEvent.data);
                break;

            case 'keyDown':
                const isAndroidIME =
                    this.editor.getEnvironment().isAndroid && event.rawEvent.key == UnidentifiedKey;
                if (isCursorMovingKey(event.rawEvent)) {
                    this.clearPendingFormat();
                    this.lastCheckedNode = null;
                } else if (
                    (this.defaultFormatKeys.size > 0 || this.state.applyDefaultFormatChecker) &&
                    (isAndroidIME ||
                        isCharacterValue(event.rawEvent) ||
                        event.rawEvent.key == ProcessKey) &&
                    this.shouldApplyDefaultFormat(this.editor)
                ) {
                    applyDefaultFormat(this.editor, this.state.defaultFormat);
                }

                break;

            case 'mouseUp':
            case 'contentChanged':
                this.lastCheckedNode = null;

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
            const { node, offset } = this.state.pendingFormat.insertPoint;

            if (range && range.startContainer == node && range.startOffset == offset) {
                result = true;
            }
        }

        return result;
    }

    private shouldApplyDefaultFormat(editor: IEditor): boolean {
        const selection = editor.getDOMSelection();
        const range = selection?.type == 'range' ? selection.range : null;
        const posContainer = range?.startContainer ?? null;

        if (posContainer && posContainer != this.lastCheckedNode) {
            // Cache last checked parent node so no need to check it again if user is keep typing under the same node
            this.lastCheckedNode = posContainer;

            const domHelper = editor.getDOMHelper();
            let element: HTMLElement | null = isNodeOfType(posContainer, 'ELEMENT_NODE')
                ? posContainer
                : posContainer.parentElement;

            return (
                (element && this.state.applyDefaultFormatChecker?.(element, domHelper)) ||
                (this.defaultFormatKeys.size > 0 &&
                    this.cssDefaultFormatChecker(element, domHelper))
            );
        } else {
            return false;
        }
    }

    private cssDefaultFormatChecker(element: HTMLElement | null, domHelper: DOMHelper): boolean {
        const foundFormatKeys = new Set<keyof CSSStyleDeclaration>();

        while (element?.parentElement && domHelper.isNodeInEditor(element.parentElement)) {
            if (element.getAttribute?.('style')) {
                const style = element.style;
                this.defaultFormatKeys.forEach(key => {
                    if (style[key]) {
                        foundFormatKeys.add(key);
                    }
                });

                if (foundFormatKeys.size == this.defaultFormatKeys.size) {
                    return false;
                }
            }

            if (isBlockElement(element)) {
                break;
            }

            element = element.parentElement;
        }

        return true;
    }
}

/**
 * @internal
 * Create a new instance of FormatPlugin.
 * @param option The editor option
 */
export function createFormatPlugin(option: EditorOptions): PluginWithState<FormatPluginState> {
    return new FormatPlugin(option);
}
