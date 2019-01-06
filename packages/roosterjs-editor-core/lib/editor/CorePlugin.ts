import Editor from './Editor';
import EditorPlugin from './EditorPlugin';
import { ContentEditFeature } from '..';
import { ContentEditFeatureKeys, GenericContentEditFeature } from './ContentEditFeature';
import {
    ChangeSource,
    NodePosition,
    PluginCompositionEvent,
    PluginEvent,
    PluginEventType,
    PluginKeyboardEvent,
    PluginMouseUpEvent,
    PositionType,
} from 'roosterjs-editor-types';
import {
    Browser,
    Position,
    findClosestElementAncestor,
    applyFormat,
    fromHtml,
    isNodeEmpty,
} from 'roosterjs-editor-dom';

interface EditComponent {
    currentFeature: GenericContentEditFeature<PluginEvent>;
    featureMap: { [key: number]: GenericContentEditFeature<PluginEvent>[] };
    addFeature: (feature: GenericContentEditFeature<PluginEvent>) => void;
    findFeature: (event: PluginEvent) => GenericContentEditFeature<PluginEvent>;
    tryHandleEvent: (event: PluginEvent) => void;
}

interface AutoCompleteFeature extends ContentEditFeature {
    snapshot: string;
    changeSource: string;
    onContentChanged: () => void;
    performAutoComplete: (callback: () => any, changeSource?: ChangeSource | string) => void;
}

/**
 * Provides core editing feature for editor:
 * 1. AutoComplete
 * 2. Ensure typing under HTMLElement
 * 3. IME state
 */
export default class CorePlugin implements EditorPlugin {
    private editor: Editor;
    private disposers: (() => void)[] = null;

    /**
     * Creates an instance of Core plugin
     * @param contentDiv The DIV HTML element which will be the container element of editor
     * @param disableRestoreSelectionOnFocus Whether auto restore previous selection when focus to editor
     */
    constructor(
        private contentDiv: HTMLDivElement,
        private disableRestoreSelectionOnFocus: boolean
    ) {}

    //#region EditorPlugin methods
    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'EditorCore';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: Editor): void {
        this.editor = editor;
        this.disposers = [
            ...this.imeComponent.attachEvents(),
            ...this.selectionComponent.attachEvents(),
        ].filter(x => x);
        this.editComponent.addFeature(this.autoComplete);
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.mouseUpComponent.removeMouseUpEventListener();
        this.disposers.forEach(disposer => disposer());
        this.disposers = null;
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        let contentChanged = false;

        switch (event.eventType) {
            case PluginEventType.ContentChanged:
                if (
                    this.autoComplete.changeSource &&
                    this.autoComplete.changeSource != event.source
                ) {
                    contentChanged = true;
                }
                if (!this.editComponent.currentFeature) {
                    this.editComponent.findFeature(event);
                }
                break;
            case PluginEventType.MouseDown:
                contentChanged = true;
                this.mouseUpComponent.onMouseDown();
                break;
            case PluginEventType.KeyDown:
                contentChanged = true;
                break;
            case PluginEventType.KeyPress:
                this.typingComponent.onKeyPress(event);
                break;
        }

        this.editComponent.tryHandleEvent(event);

        if (contentChanged) {
            this.autoComplete.onContentChanged();
        }
    }

    /**
     * Check if the plugin should handle the given event exclusively.
     * Handle an event exclusively means other plugin will not receive this event in
     * onPluginEvent method.
     * If two plugins will return true in willHandleEventExclusively() for the same event,
     * the final result depends on the order of the plugins are added into editor
     * @param event The event to check
     */
    willHandleEventExclusively(event: PluginEvent) {
        return !!this.editComponent.findFeature(event);
    }
    //#endregion

    //#region Public APIs
    /**
     * Add a Content Edit feature
     * @param feature The feature to add
     */
    public addFeature(feature: GenericContentEditFeature<PluginEvent>) {
        this.editComponent.addFeature(feature);
    }

    /**
     * Check if editor is in IME input sequence
     * @returns True if editor is in IME input sequence, otherwise false
     */
    public isInIME() {
        return this.imeComponent.isInIme;
    }

    /**
     * Perform an auto complete action in the callback, save a snapsnot of content before the action,
     * and trigger ContentChangedEvent with the change source if specified
     * @param callback The auto complete callback, return value will be used as data field of ContentChangedEvent
     * @param changeSource Chagne source of ContentChangedEvent. If not passed, no ContentChangedEvent will be  triggered
     */
    public performAutoComplete(callback: () => any, changeSource?: ChangeSource | string) {
        this.autoComplete.performAutoComplete(callback, changeSource);
    }

    /**
     * Ensure we are typing in an HTML Element inside editor, and apply default format if current block is empty
     * @param node Current node
     * @param event (optional) The keyboard event that we are ensuring is typing in an element.
     * @returns A new position to select
     */
    public ensureTypeInElement(position: NodePosition, event?: PluginKeyboardEvent): NodePosition {
        return this.typingComponent.ensureTypeInElement(position, event);
    }
    //#endregion

    //#region AutoComplete Feature
    private autoComplete: AutoCompleteFeature = {
        snapshot: null,
        changeSource: null,
        keys: [ContentEditFeatureKeys.BACKSPACE],
        shouldHandleEvent: () => this.autoComplete.snapshot !== null,
        handleEvent: (event: PluginKeyboardEvent, editor: Editor) => {
            event.rawEvent.preventDefault();
            editor.setContent(this.autoComplete.snapshot, false /*triggerContentChangedEvent*/);
        },
        onContentChanged: () => {
            this.autoComplete.snapshot = null;
            this.autoComplete.changeSource = null;
        },
        performAutoComplete: (callback: () => any, changeSource?: ChangeSource | string) => {
            this.editor.addUndoSnapshot((start, end, snapshot) => {
                let data = callback();
                this.autoComplete.snapshot = snapshot;
                this.autoComplete.changeSource = changeSource;
                return data;
            }, changeSource);
        },
    };
    //#endregion

    //#region Edit Component helps handle Content edit features
    private editComponent: EditComponent = {
        currentFeature: null,
        featureMap: {},
        addFeature: (feature: GenericContentEditFeature<PluginEvent>) => {
            if (feature.initialize) {
                feature.initialize(this.editor);
            }
            feature.keys.forEach(key => {
                let array = this.editComponent.featureMap[key] || [];
                array.push(feature);
                this.editComponent.featureMap[key] = array;
            });
        },
        findFeature: (event: PluginEvent) => {
            let hasFunctionKey = false;
            let features: GenericContentEditFeature<PluginEvent>[];

            if (event.eventType == PluginEventType.KeyDown) {
                let rawEvent = event.rawEvent;
                hasFunctionKey = rawEvent.ctrlKey || rawEvent.altKey || rawEvent.metaKey;
                features = this.editComponent.featureMap[rawEvent.which];
            } else if (event.eventType == PluginEventType.ContentChanged) {
                features = this.editComponent.featureMap[ContentEditFeatureKeys.CONTENTCHANGED];
            }
            this.editComponent.currentFeature =
                features &&
                features.filter(
                    feature =>
                        (feature.allowFunctionKeys || !hasFunctionKey) &&
                        feature.shouldHandleEvent(event, this.editor)
                )[0];
            return this.editComponent.currentFeature;
        },
        tryHandleEvent: (event: PluginEvent) => {
            if (this.editComponent.currentFeature) {
                let feature = this.editComponent.currentFeature;
                this.editComponent.currentFeature = null;
                feature.handleEvent(event, this.editor);
            }
        },
    };
    //#endregion

    //#region IME Component helps handle IME related stuff
    private imeComponent = {
        isInIme: false,
        attachEvents: () => [
            this.editor.addDomEventHandler(
                'compositionstart',
                () => (this.imeComponent.isInIme = true)
            ),
            this.editor.addDomEventHandler('compositionend', (e: CompositionEvent) => {
                this.imeComponent.isInIme = false;
                this.editor.triggerEvent(<PluginCompositionEvent>{
                    eventType: PluginEventType.CompositionEnd,
                    rawEvent: e,
                });
            }),
        ],
    };
    //#endregion

    //#region Selection Component helps handle selection saving/restoring actions when blur/focus
    private selectionComponent = {
        attachEvents: () => [
            this.editor.addDomEventHandler(Browser.isIEOrEdge ? 'beforedeactivate' : 'blur', () =>
                this.editor.saveSelectionRange()
            ),
            !this.disableRestoreSelectionOnFocus &&
                this.editor.addDomEventHandler('focus', () => this.editor.restoreSavedRange()),
        ],
    };
    //#endregion

    //#region MouseUp Component helps handle mouse up event
    // this can trigger mouse up event after mousedown happens in editor
    // even mouse up is happening outside editor
    private mouseUpComponent = {
        mouseUpEventListerAdded: false,
        onMouseDown: () => {
            if (!this.mouseUpComponent.mouseUpEventListerAdded) {
                this.editor
                    .getDocument()
                    .addEventListener(
                        'mouseup',
                        this.mouseUpComponent.onMouseUp,
                        true /*setCapture*/
                    );
                this.mouseUpComponent.mouseUpEventListerAdded = true;
            }
        },
        onMouseUp: (e: MouseEvent) => {
            if (this.editor) {
                this.mouseUpComponent.removeMouseUpEventListener();
                this.editor.triggerEvent(<PluginMouseUpEvent>{
                    eventType: PluginEventType.MouseUp,
                    rawEvent: e,
                });
            }
        },
        removeMouseUpEventListener: () => {
            if (this.mouseUpComponent.mouseUpEventListerAdded) {
                this.mouseUpComponent.mouseUpEventListerAdded = false;
                this.editor
                    .getDocument()
                    .removeEventListener('mouseup', this.mouseUpComponent.onMouseUp, true);
            }
        },
    };
    //#endregion

    //#region Typing Component helps to ensure typing is always happening under a DOM container
    private typingComponent = {
        ensureTypeInElement: (
            position: NodePosition,
            event?: PluginKeyboardEvent
        ): NodePosition => {
            let result = position.normalize();
            let block = this.editor.getBlockElementAtNode(result.node);
            let formatNode: HTMLElement;

            if (block) {
                formatNode = block.collapseToSingleElement();

                // if the block is empty, apply default format
                // Otherwise, leave it as it is as we don't want to change the style for existing data
                // unless the block was just created by the keyboard event (e.g. ctrl+a & start typing)
                const shouldSetNodeStyles =
                    isNodeEmpty(formatNode) ||
                    (event &&
                        this.typingComponent.wasNodeJustCreatedByKeyboardEvent(event, formatNode));
                formatNode = formatNode && shouldSetNodeStyles ? formatNode : null;
            } else {
                // Only reason we don't get the selection block is that we have an empty content div
                // which can happen when users removes everything (i.e. select all and DEL, or backspace from very end to begin)
                // The fix is to add a DIV wrapping, apply default format and move cursor over
                formatNode = fromHtml(
                    Browser.isEdge ? '<div><span><br></span></div>' : '<div><br></div>',
                    this.editor.getDocument()
                )[0] as HTMLElement;
                this.contentDiv.appendChild(formatNode);

                // element points to a wrapping node we added "<div><br></div>". We should move the selection left to <br>
                result = new Position(formatNode.firstChild, PositionType.Begin);
            }

            if (formatNode) {
                applyFormat(formatNode, this.editor.getDefaultFormat());
            }

            return result;
        },
        onKeyPress: (event: PluginKeyboardEvent) => {
            // If normalization was not possible before the keypress,
            // check again after the keyboard event has been processed by browser native behaviour.
            //
            // This handles the case where the keyboard event that first inserts content happens when
            // there is already content under the selection (e.g. Ctrl+a -> type new content).
            //
            // Only scheudle when the range is not collapsed to catch this edge case.
            let range = this.editor.getSelectionRange();
            let shouldNormalizeTypingNow =
                range &&
                range.collapsed &&
                findClosestElementAncestor(range.startContainer) == this.contentDiv;
            if (shouldNormalizeTypingNow) {
                this.typingComponent.tryNormalizeTyping(event, range);
            } else if (!range.collapsed) {
                this.editor.runAsync(() => {
                    this.typingComponent.tryNormalizeTyping(event);
                });
            }
        },
        /**
         * When typing goes directly under content div, many things can go wrong
         * We fix it by wrapping it with a div and reposition cursor within the div
         */
        tryNormalizeTyping: (event: PluginKeyboardEvent, range?: Range) => {
            let position = this.typingComponent.ensureTypeInElement(
                Position.getStart(range || this.editor.getSelectionRange()),
                event
            );
            this.editor.select(position);
        },
        wasNodeJustCreatedByKeyboardEvent: (event: PluginKeyboardEvent, formatNode: HTMLElement) =>
            event.rawEvent.target instanceof Node &&
            event.rawEvent.target.contains(formatNode) &&
            event.rawEvent.key === formatNode.innerText,
    };
    //#endregion
}
