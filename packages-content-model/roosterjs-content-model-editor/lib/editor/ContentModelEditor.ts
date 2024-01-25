import { BridgePlugin } from '../corePlugins/BridgePlugin';
import { buildRangeEx } from './utils/buildRangeEx';
import { createEditorCore } from './createEditorCore';
import { getObjectKeys } from 'roosterjs-content-model-dom';
import { getPendableFormatState } from './utils/getPendableFormatState';
import {
    newEventToOldEvent,
    oldEventToNewEvent,
    OldEventTypeToNewEventType,
} from './utils/eventConverter';
import {
    createModelFromHtml,
    isBold,
    redo,
    StandaloneEditor,
    transformColor,
    undo,
} from 'roosterjs-content-model-core';
import {
    ChangeSource,
    ColorTransformDirection,
    ContentPosition,
    GetContentMode,
    PluginEventType,
    QueryScope,
    RegionType,
} from 'roosterjs-editor-types';
import type {
    BlockElement,
    ClipboardData,
    ContentChangedData,
    ContentChangedEvent,
    DOMEventHandler,
    DefaultFormat,
    EditorUndoState,
    ExperimentalFeatures,
    GenericContentEditFeature,
    IContentTraverser,
    IPositionContentSearcher,
    InsertOption,
    NodePosition,
    PendableFormatState,
    PluginEvent,
    PluginEventData,
    PluginEventFromType,
    PositionType,
    Region,
    SelectionPath,
    SelectionRangeEx,
    SizeTransformer,
    StyleBasedFormatState,
    TableSelection,
    DOMEventHandlerObject,
    DarkColorHandler,
} from 'roosterjs-editor-types';
import {
    convertDomSelectionToRangeEx,
    convertRangeExToDomSelection,
} from './utils/selectionConverter';
import type {
    CompatibleChangeSource,
    CompatibleColorTransformDirection,
    CompatibleContentPosition,
    CompatibleExperimentalFeatures,
    CompatibleGetContentMode,
    CompatiblePluginEventType,
    CompatibleQueryScope,
    CompatibleRegionType,
} from 'roosterjs-editor-types/lib/compatibleTypes';
import {
    ContentTraverser,
    Position,
    PositionContentSearcher,
    cacheGetEventData,
    collapseNodes,
    contains,
    deleteSelectedContent,
    findClosestElementAncestor,
    getBlockElementAtNode,
    getRegionsFromRange,
    getSelectionPath,
    isNodeEmpty,
    isPositionAtBeginningOf,
    queryElements,
    toArray,
    wrap,
} from 'roosterjs-editor-dom';
import type { ContentModelEditorCore } from '../publicTypes/ContentModelEditorCore';
import type {
    ContentModelEditorOptions,
    IContentModelEditor,
} from '../publicTypes/IContentModelEditor';
import type { DOMEventRecord, Rect } from 'roosterjs-content-model-types';

/**
 * Editor for Content Model.
 * (This class is still under development, and may still be changed in the future with some breaking changes)
 */
export class ContentModelEditor extends StandaloneEditor implements IContentModelEditor {
    private contentModelEditorCore: ContentModelEditorCore | undefined;

    /**
     * Creates an instance of Editor
     * @param contentDiv The DIV HTML element which will be the container element of editor
     * @param options An optional options object to customize the editor
     */
    constructor(contentDiv: HTMLDivElement, options: ContentModelEditorOptions = {}) {
        const bridgePlugin = new BridgePlugin(options);
        const plugins = [bridgePlugin, ...(options.plugins ?? [])];
        const initContent = options.initialContent ?? contentDiv.innerHTML;
        const initialModel =
            initContent && !options.initialModel
                ? createModelFromHtml(
                      initContent,
                      options.defaultDomToModelOptions,
                      options.trustedHTMLHandler,
                      options.defaultSegmentFormat
                  )
                : options.initialModel;
        const standaloneEditorOptions: ContentModelEditorOptions = {
            ...options,
            plugins,
            initialModel,
        };
        const corePluginState = bridgePlugin.getCorePluginState();

        super(contentDiv, standaloneEditorOptions, () => {
            const core = this.getCore();

            // Need to create Content Model Editor Core before initialize plugins since some plugins need this object
            this.contentModelEditorCore = createEditorCore(
                options,
                corePluginState,
                core.darkColorHandler,
                size => size / this.getCore().zoomScale
            );

            bridgePlugin.setOuterEditor(this);
        });
    }

    /**
     * Dispose this editor, dispose all plugins and custom data
     */
    dispose(): void {
        super.dispose();

        const core = this.getContentModelEditorCore();

        getObjectKeys(core.customData).forEach(key => {
            const data = core.customData[key];

            if (data && data.disposer) {
                data.disposer(data.value);
            }

            delete core.customData[key];
        });

        this.contentModelEditorCore = undefined;
    }

    /**
     * Get whether this editor is disposed
     * @returns True if editor is disposed, otherwise false
     */
    isDisposed(): boolean {
        return super.isDisposed() || !this.contentModelEditorCore;
    }

    /**
     * Insert node into editor
     * @param node The node to insert
     * @param option Insert options. Default value is:
     *  position: ContentPosition.SelectionStart
     *  updateCursor: true
     *  replaceSelection: true
     *  insertOnNewLine: false
     * @returns true if node is inserted. Otherwise false
     */
    insertNode(node: Node, option?: InsertOption): boolean {
        const core = this.getContentModelEditorCore();
        const innerCore = this.getCore();

        return node ? core.api.insertNode(core, innerCore, node, option ?? null) : false;
    }

    /**
     * Delete a node from editor content
     * @param node The node to delete
     * @returns true if node is deleted. Otherwise false
     */
    deleteNode(node: Node): boolean {
        // Only remove the node when it falls within editor
        if (node && this.contains(node) && node.parentNode) {
            node.parentNode.removeChild(node);
            return true;
        }

        return false;
    }

    /**
     * Replace a node in editor content with another node
     * @param existingNode The existing node to be replaced
     * @param toNode node to replace to
     * @param transformColorForDarkMode (optional) Whether to transform new node to dark mode. Default is false
     * @returns true if node is replaced. Otherwise false
     */
    replaceNode(existingNode: Node, toNode: Node, transformColorForDarkMode?: boolean): boolean {
        const core = this.getCore();
        // Only replace the node when it falls within editor
        if (this.contains(existingNode) && toNode) {
            if (core.lifecycle.isDarkMode && transformColorForDarkMode) {
                this.transformToDarkColor(toNode, ColorTransformDirection.LightToDark);
            }

            existingNode.parentNode?.replaceChild(toNode, existingNode);

            return true;
        }

        return false;
    }

    /**
     * Get BlockElement at given node
     * @param node The node to create InlineElement
     * @returns The BlockElement result
     */
    getBlockElementAtNode(node: Node): BlockElement | null {
        return getBlockElementAtNode(this.getCore().contentDiv, node);
    }

    contains(arg: Node | Range | null): boolean {
        if (!arg) {
            return false;
        }
        return contains(this.getCore().contentDiv, <Node>arg);
    }

    queryElements(
        selector: string,
        scopeOrCallback:
            | QueryScope
            | CompatibleQueryScope
            | ((node: Node) => any) = QueryScope.Body,
        callback?: (node: Node) => any
    ) {
        const core = this.getCore();
        const result: HTMLElement[] = [];
        const scope = scopeOrCallback instanceof Function ? QueryScope.Body : scopeOrCallback;
        callback = scopeOrCallback instanceof Function ? scopeOrCallback : callback;

        const selectionEx = scope == QueryScope.Body ? null : this.getSelectionRangeEx();
        if (selectionEx) {
            selectionEx.ranges.forEach(range => {
                result.push(...queryElements(core.contentDiv, selector, callback, scope, range));
            });
        } else {
            return queryElements(core.contentDiv, selector, callback, scope, undefined /* range */);
        }

        return result;
    }

    /**
     * Collapse nodes within the given start and end nodes to their common ancestor node,
     * split parent nodes if necessary
     * @param start The start node
     * @param end The end node
     * @param canSplitParent True to allow split parent node there are nodes before start or after end under the same parent
     * and the returned nodes will be all nodes from start through end after splitting
     * False to disallow split parent
     * @returns When canSplitParent is true, returns all node from start through end after splitting,
     * otherwise just return start and end
     */
    collapseNodes(start: Node, end: Node, canSplitParent: boolean): Node[] {
        return collapseNodes(this.getCore().contentDiv, start, end, canSplitParent);
    }

    //#endregion

    //#region Content API

    /**
     * Check whether the editor contains any visible content
     * @param trim Whether trim the content string before check. Default is false
     * @returns True if there's no visible content, otherwise false
     */
    isEmpty(trim?: boolean): boolean {
        return isNodeEmpty(this.getCore().contentDiv, trim);
    }

    /**
     * Get current editor content as HTML string
     * @param mode specify what kind of HTML content to retrieve
     * @returns HTML string representing current editor content
     */
    getContent(mode: GetContentMode | CompatibleGetContentMode = GetContentMode.CleanHTML): string {
        const core = this.getContentModelEditorCore();
        const innerCore = this.getCore();

        return core.api.getContent(core, innerCore, mode as GetContentMode);
    }

    /**
     * Set HTML content to this editor. All existing content will be replaced. A ContentChanged event will be triggered
     * @param content HTML content to set in
     * @param triggerContentChangedEvent True to trigger a ContentChanged event. Default value is true
     */
    setContent(content: string, triggerContentChangedEvent: boolean = true) {
        const core = this.getContentModelEditorCore();
        const innerCore = this.getCore();

        core.api.setContent(core, innerCore, content, triggerContentChangedEvent);
    }

    /**
     * Insert HTML content into editor
     * @param HTML content to insert
     * @param option Insert options. Default value is:
     *  position: ContentPosition.SelectionStart
     *  updateCursor: true
     *  replaceSelection: true
     *  insertOnNewLine: false
     */
    insertContent(content: string, option?: InsertOption) {
        if (content) {
            const doc = this.getDocument();
            const body = new DOMParser().parseFromString(
                this.getCore().trustedHTMLHandler(content),
                'text/html'
            )?.body;
            let allNodes = body?.childNodes ? toArray(body.childNodes) : [];

            // If it is to insert on new line, and there are more than one node in the collection, wrap all nodes with
            // a parent DIV before calling insertNode on each top level sub node. Otherwise, every sub node may get wrapped
            // separately to show up on its own line
            if (option && option.insertOnNewLine && allNodes.length > 1) {
                allNodes = [wrap(allNodes)];
            }

            const fragment = doc.createDocumentFragment();
            allNodes.forEach(node => fragment.appendChild(node));

            this.insertNode(fragment, option);
        }
    }

    /**
     * Delete selected content
     */
    deleteSelectedContent(): NodePosition | null {
        const range = this.getSelectionRange();
        if (range && !range.collapsed) {
            return deleteSelectedContent(this.getCore().contentDiv, range);
        }
        return null;
    }

    /**
     * Paste into editor using a clipboardData object
     * @param clipboardData Clipboard data retrieved from clipboard
     * @param pasteAsText Force pasting as plain text. Default value is false
     * @param applyCurrentStyle True if apply format of current selection to the pasted content,
     * false to keep original format.  Default value is false. When pasteAsText is true, this parameter is ignored
     * @param pasteAsImage: When set to true, if the clipboardData contains a imageDataUri will paste the image to the editor
     */
    paste(
        clipboardData: ClipboardData,
        pasteAsText: boolean = false,
        applyCurrentFormat: boolean = false,
        pasteAsImage: boolean = false
    ) {
        this.pasteFromClipboard(
            clipboardData,
            pasteAsText
                ? 'asPlainText'
                : applyCurrentFormat
                ? 'mergeFormat'
                : pasteAsImage
                ? 'asImage'
                : 'normal'
        );
    }

    //#endregion

    //#region Focus and Selection

    /**
     * Get current selection range from Editor.
     * It does a live pull on the selection, if nothing retrieved, return whatever we have in cache.
     * @param tryGetFromCache Set to true to retrieve the selection range from cache if editor doesn't own the focus now.
     * Default value is true
     * @returns current selection range, or null if editor never got focus before
     */
    getSelectionRange(tryGetFromCache: boolean = true): Range | null {
        const selection = this.getDOMSelection();

        return selection?.type == 'range' ? selection.range : null;
    }

    /**
     * Get current selection range from Editor.
     * It does a live pull on the selection, if nothing retrieved, return whatever we have in cache.
     * @param tryGetFromCache Set to true to retrieve the selection range from cache if editor doesn't own the focus now.
     * Default value is true
     * @returns current selection range, or null if editor never got focus before
     */
    getSelectionRangeEx(): SelectionRangeEx {
        const selection = this.getDOMSelection();

        return convertDomSelectionToRangeEx(selection);
    }

    /**
     * Get current selection in a serializable format
     * It does a live pull on the selection, if nothing retrieved, return whatever we have in cache.
     * @returns current selection path, or null if editor never got focus before
     */
    getSelectionPath(): SelectionPath | null {
        const range = this.getSelectionRange();
        return range && getSelectionPath(this.getCore().contentDiv, range);
    }

    select(
        arg1: Range | SelectionRangeEx | NodePosition | Node | SelectionPath | null,
        arg2?: NodePosition | number | PositionType | TableSelection | null,
        arg3?: Node,
        arg4?: number | PositionType
    ): boolean {
        const core = this.getCore();
        const rangeEx = buildRangeEx(core, arg1, arg2, arg3, arg4);
        const selection = convertRangeExToDomSelection(rangeEx);

        this.setDOMSelection(selection);
        return true;
    }

    /**
     * Get current focused position. Return null if editor doesn't have focus at this time.
     */
    getFocusedPosition(): NodePosition | null {
        const sel = this.getDocument().defaultView?.getSelection();
        if (sel?.focusNode && this.contains(sel.focusNode)) {
            return new Position(sel.focusNode, sel.focusOffset);
        }

        const range = this.getSelectionRange();
        if (range) {
            return Position.getStart(range);
        }

        return null;
    }

    /**
     * Get an HTML element from current cursor position.
     * When expectedTags is not specified, return value is the current node (if it is HTML element)
     * or its parent node (if current node is a Text node).
     * When expectedTags is specified, return value is the first ancestor of current node which has
     * one of the expected tags.
     * If no element found within editor by the given tag, return null.
     * @param selector Optional, an HTML selector to find HTML element with.
     * @param startFrom Start search from this node. If not specified, start from current focused position
     * @param event Optional, if specified, editor will try to get cached result from the event object first.
     * If it is not cached before, query from DOM and cache the result into the event object
     */
    getElementAtCursor(
        selector?: string,
        startFrom?: Node,
        event?: PluginEvent
    ): HTMLElement | null {
        event = startFrom ? undefined : event; // Only use cache when startFrom is not specified, for different start position can have different result

        return (
            cacheGetEventData(event ?? null, 'GET_ELEMENT_AT_CURSOR_' + selector, () => {
                if (!startFrom) {
                    const position = this.getFocusedPosition();
                    startFrom = position?.node;
                }
                return (
                    startFrom &&
                    findClosestElementAncestor(startFrom, this.getCore().contentDiv, selector)
                );
            }) ?? null
        );
    }

    /**
     * Check if this position is at beginning of the editor.
     * This will return true if all nodes between the beginning of target node and the position are empty.
     * @param position The position to check
     * @returns True if position is at beginning of the editor, otherwise false
     */
    isPositionAtBeginning(position: NodePosition): boolean {
        return isPositionAtBeginningOf(position, this.getCore().contentDiv);
    }

    /**
     * Get impacted regions from selection
     */
    getSelectedRegions(type: RegionType | CompatibleRegionType = RegionType.Table): Region[] {
        const selection = this.getSelectionRangeEx();
        const result: Region[] = [];
        const contentDiv = this.getCore().contentDiv;
        selection.ranges.forEach(range => {
            result.push(...(range ? getRegionsFromRange(contentDiv, range, type) : []));
        });
        return result.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
    }

    //#endregion

    //#region EVENT API

    addDomEventHandler(
        nameOrMap: string | Record<string, DOMEventHandler>,
        handler?: DOMEventHandler
    ): () => void {
        const eventsMap = typeof nameOrMap == 'string' ? { [nameOrMap]: handler! } : nameOrMap;
        const eventsMapResult: Record<string, DOMEventRecord> = {};

        getObjectKeys(eventsMap).forEach(key => {
            const handlerObj = eventsMap[key];
            let result: DOMEventRecord = {
                pluginEventType: null,
                beforeDispatch: null,
            };

            if (typeof handlerObj === 'number') {
                result.pluginEventType = OldEventTypeToNewEventType[handlerObj as PluginEventType];
            } else if (typeof handlerObj === 'function') {
                result.beforeDispatch = handlerObj;
            } else if (typeof handlerObj === 'object') {
                const record = handlerObj as DOMEventHandlerObject;
                result = {
                    beforeDispatch: record.beforeDispatch,
                    pluginEventType:
                        typeof record.pluginEventType == 'number'
                            ? OldEventTypeToNewEventType[record.pluginEventType]
                            : undefined,
                };
            }

            eventsMapResult[key] = result;
        });

        return this.attachDomEvent(eventsMapResult);
    }

    /**
     * Trigger an event to be dispatched to all plugins
     * @param eventType Type of the event
     * @param data data of the event with given type, this is the rest part of PluginEvent with the given type
     * @param broadcast indicates if the event needs to be dispatched to all plugins
     * True means to all, false means to allow exclusive handling from one plugin unless no one wants that
     * @returns the event object which is really passed into plugins. Some plugin may modify the event object so
     * the result of this function provides a chance to read the modified result
     */
    public triggerPluginEvent<T extends PluginEventType | CompatiblePluginEventType>(
        eventType: T,
        data: PluginEventData<T>,
        broadcast: boolean = false
    ): PluginEventFromType<T> {
        const oldEvent = {
            eventType,
            ...data,
        } as PluginEvent;
        const newEvent = oldEventToNewEvent(oldEvent);
        const core = this.getCore();

        if (newEvent) {
            core.api.triggerEvent(core, newEvent, broadcast);
            return (newEventToOldEvent(newEvent, oldEvent) ?? oldEvent) as PluginEventFromType<T>;
        } else {
            return oldEvent as PluginEventFromType<T>;
        }
    }

    /**
     * Trigger a ContentChangedEvent
     * @param source Source of this event, by default is 'SetContent'
     * @param data additional data for this event
     */
    triggerContentChangedEvent(
        source: ChangeSource | CompatibleChangeSource | string = ChangeSource.SetContent,
        data?: any
    ) {
        this.triggerPluginEvent(PluginEventType.ContentChanged, {
            source,
            data,
        });
    }

    //#endregion

    //#region Undo API

    /**
     * Undo last edit operation
     */
    undo() {
        undo(this);
    }

    /**
     * Redo next edit operation
     */
    redo() {
        redo(this);
    }

    /**
     * Add undo snapshot, and execute a format callback function, then add another undo snapshot, then trigger
     * ContentChangedEvent with given change source.
     * If this function is called nested, undo snapshot will only be added in the outside one
     * @param callback The callback function to perform formatting, returns a data object which will be used as
     * the data field in ContentChangedEvent if changeSource is not null.
     * @param changeSource The change source to use when fire ContentChangedEvent. When the value is not null,
     * a ContentChangedEvent will be fired with change source equal to this value
     * @param canUndoByBackspace True if this action can be undone when user press Backspace key (aka Auto Complete).
     */
    addUndoSnapshot(
        callback?: (start: NodePosition | null, end: NodePosition | null) => any,
        changeSource?: ChangeSource | CompatibleChangeSource | string,
        canUndoByBackspace?: boolean,
        additionalData?: ContentChangedData
    ) {
        const core = this.getCore();
        const undoState = core.undo;
        const isNested = undoState.isNested;
        let data: any;

        if (!isNested) {
            undoState.isNested = true;

            // When there is getEntityState, it means this is triggered by an entity change.
            // So if HTML content is not changed (hasNewContent is false), no need to add another snapshot before change
            if (
                core.undo.snapshotsManager.hasNewContent ||
                !additionalData?.getEntityState ||
                !callback
            ) {
                core.api.addUndoSnapshot(
                    core,
                    !!canUndoByBackspace,
                    additionalData?.getEntityState?.()
                );
            }
        }

        try {
            if (callback) {
                const selection = core.api.getDOMSelection(core);
                const range = selection?.type == 'range' ? selection.range : null;
                data = callback(
                    range && Position.getStart(range).normalize(),
                    range && Position.getEnd(range).normalize()
                );

                if (!isNested) {
                    const entityStates = additionalData?.getEntityState?.();

                    core.api.addUndoSnapshot(core, false /*isAutoCompleteSnapshot*/, entityStates);
                }
            }
        } finally {
            if (!isNested) {
                undoState.isNested = false;
            }
        }

        if (callback && changeSource) {
            const event: ContentChangedEvent = {
                eventType: PluginEventType.ContentChanged,
                source: changeSource,
                data: data,
                additionalData,
            };
            this.triggerPluginEvent(PluginEventType.ContentChanged, event, true /*broadcast*/);
        }

        if (canUndoByBackspace) {
            const selection = core.api.getDOMSelection(core);

            if (selection?.type == 'range') {
                core.undo.snapshotsManager.hasNewContent = false;
                core.undo.posContainer = selection.range.startContainer;
                core.undo.posOffset = selection.range.startOffset;
            }
        }
    }

    /**
     * Whether there is an available undo/redo snapshot
     */
    getUndoState(): EditorUndoState {
        const { snapshotsManager } = this.getCore().undo;
        return {
            canUndo:
                snapshotsManager.hasNewContent || snapshotsManager.canMove(-1 /*previousSnapshot*/),
            canRedo: snapshotsManager.canMove(1 /*nextSnapshot*/),
        };
    }

    //#endregion

    //#region Misc

    /**
     * Get the scroll container of the editor
     */
    getScrollContainer(): HTMLElement {
        return this.getCore().domEvent.scrollContainer;
    }

    /**
     * Get custom data related to this editor
     * @param key Key of the custom data
     * @param getter Getter function. If custom data for the given key doesn't exist,
     * call this function to get one and store it if it is specified. Otherwise return undefined
     * @param disposer An optional disposer function to dispose this custom data when
     * dispose editor.
     */
    getCustomData<T>(key: string, getter?: () => T, disposer?: (value: T) => void): T {
        const core = this.getContentModelEditorCore();
        return (core.customData[key] = core.customData[key] || {
            value: getter ? getter() : undefined,
            disposer,
        }).value as T;
    }

    /**
     * Get default format of this editor
     * @returns Default format object of this editor
     */
    getDefaultFormat(): DefaultFormat {
        const format = this.getCore().format.defaultFormat;

        return {
            bold: isBold(format.fontWeight),
            italic: format.italic,
            underline: format.underline,
            fontFamily: format.fontFamily,
            fontSize: format.fontSize,
            textColor: format.textColor,
            backgroundColor: format.backgroundColor,
        };
    }

    /**
     * Get a content traverser for the whole editor
     * @param startNode The node to start from. If not passed, it will start from the beginning of the body
     */
    getBodyTraverser(startNode?: Node): IContentTraverser {
        return ContentTraverser.createBodyTraverser(this.getCore().contentDiv, startNode);
    }

    /**
     * Get a content traverser for current selection
     * @returns A content traverser, or null if editor never got focus before
     */
    getSelectionTraverser(range?: Range): IContentTraverser | null {
        range = range ?? this.getSelectionRange() ?? undefined;
        return range
            ? ContentTraverser.createSelectionTraverser(this.getCore().contentDiv, range)
            : null;
    }

    /**
     * Get a content traverser for current block element start from specified position
     * @param startFrom Start position of the traverser. Default value is ContentPosition.SelectionStart
     * @returns A content traverser, or null if editor never got focus before
     */
    getBlockTraverser(
        startFrom: ContentPosition | CompatibleContentPosition = ContentPosition.SelectionStart
    ): IContentTraverser | null {
        const range = this.getSelectionRange();
        return range
            ? ContentTraverser.createBlockTraverser(this.getCore().contentDiv, range, startFrom)
            : null;
    }

    /**
     * Get a text traverser of current selection
     * @param event Optional, if specified, editor will try to get cached result from the event object first.
     * If it is not cached before, query from DOM and cache the result into the event object
     * @returns A content traverser, or null if editor never got focus before
     */
    getContentSearcherOfCursor(event?: PluginEvent): IPositionContentSearcher | null {
        return cacheGetEventData(event ?? null, 'ContentSearcher', () => {
            const range = this.getSelectionRange();
            return (
                range &&
                new PositionContentSearcher(this.getCore().contentDiv, Position.getStart(range))
            );
        });
    }

    /**
     * Run a callback function asynchronously
     * @param callback The callback function to run
     * @returns a function to cancel this async run
     */
    runAsync(callback: (editor: IContentModelEditor) => void) {
        const win = this.getCore().contentDiv.ownerDocument.defaultView || window;
        const handle = win.requestAnimationFrame(() => {
            if (!this.isDisposed() && callback) {
                callback(this);
            }
        });

        return () => {
            win.cancelAnimationFrame(handle);
        };
    }

    /**
     * Set DOM attribute of editor content DIV
     * @param name Name of the attribute
     * @param value Value of the attribute
     */
    setEditorDomAttribute(name: string, value: string | null) {
        if (value === null) {
            this.getCore().contentDiv.removeAttribute(name);
        } else {
            this.getCore().contentDiv.setAttribute(name, value);
        }
    }

    /**
     * Get DOM attribute of editor content DIV, null if there is no such attribute.
     * @param name Name of the attribute
     */
    getEditorDomAttribute(name: string): string | null {
        return this.getCore().contentDiv.getAttribute(name);
    }

    /**
     * @deprecated Use getVisibleViewport() instead.
     *
     * Get current relative distance from top-left corner of the given element to top-left corner of editor content DIV.
     * @param element The element to calculate from. If the given element is not in editor, return value will be null
     * @param addScroll When pass true, The return value will also add scrollLeft and scrollTop if any. So the value
     * may be different than what user is seeing from the view. When pass false, scroll position will be ignored.
     * @returns An [x, y] array which contains the left and top distances, or null if the given element is not in editor.
     */
    getRelativeDistanceToEditor(element: HTMLElement, addScroll?: boolean): number[] | null {
        if (this.contains(element)) {
            const contentDiv = this.getCore().contentDiv;
            const editorRect = contentDiv.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            if (editorRect && elementRect) {
                let x = elementRect.left - editorRect?.left;
                let y = elementRect.top - editorRect?.top;

                if (addScroll) {
                    x += contentDiv.scrollLeft;
                    y += contentDiv.scrollTop;
                }

                return [x, y];
            }
        }

        return null;
    }

    /**
     * Add a Content Edit feature.
     * @param feature The feature to add
     */
    addContentEditFeature(feature: GenericContentEditFeature<PluginEvent>) {
        const core = this.getContentModelEditorCore();
        feature?.keys.forEach(key => {
            const array = core.edit.features[key] || [];
            array.push(feature);
            core.edit.features[key] = array;
        });
    }

    /**
     * Remove a Content Edit feature.
     * @param feature The feature to remove
     */
    removeContentEditFeature(feature: GenericContentEditFeature<PluginEvent>) {
        const core = this.getContentModelEditorCore();
        feature?.keys.forEach(key => {
            const featureSet = core.edit.features[key];
            const index = featureSet?.indexOf(feature) ?? -1;
            if (index >= 0) {
                core.edit.features[key].splice(index, 1);
                if (core.edit.features[key].length < 1) {
                    delete core.edit.features[key];
                }
            }
        });
    }

    /**
     * Get style based format state from current selection, including font name/size and colors
     */
    getStyleBasedFormatState(node?: Node): StyleBasedFormatState {
        if (!node) {
            const range = this.getSelectionRange();
            node = (range && Position.getStart(range).normalize().node) ?? undefined;
        }
        const core = this.getContentModelEditorCore();
        const innerCore = this.getCore();

        return core.api.getStyleBasedFormatState(core, innerCore, node ?? null);
    }

    /**
     * Get the pendable format such as underline and bold
     * @param forceGetStateFromDOM If set to true, will force get the format state from DOM tree.
     * @returns The pending format state
     */
    getPendableFormatState(forceGetStateFromDOM: boolean = false): PendableFormatState {
        const core = this.getCore();
        return getPendableFormatState(core);
    }

    /**
     * Ensure user will type into a container element rather than into the editor content DIV directly
     * @param position The position that user is about to type to
     * @param keyboardEvent Optional keyboard event object
     */
    ensureTypeInContainer(position: NodePosition, keyboardEvent?: KeyboardEvent) {
        const core = this.getContentModelEditorCore();
        const innerCore = this.getCore();
        core.api.ensureTypeInContainer(core, innerCore, position, keyboardEvent);
    }

    //#endregion

    //#region Dark mode APIs

    /**
     * Transform the given node and all its child nodes to dark mode color if editor is in dark mode
     * @param node The node to transform
     * @param direction The transform direction. @default ColorTransformDirection.LightToDark
     */
    transformToDarkColor(
        node: Node,
        direction:
            | ColorTransformDirection
            | CompatibleColorTransformDirection = ColorTransformDirection.LightToDark
    ) {
        const core = this.getCore();

        if (core.lifecycle.isDarkMode) {
            transformColor(
                node,
                true /*includeSelf*/,
                direction == ColorTransformDirection.DarkToLight ? 'darkToLight' : 'lightToDark',
                core.darkColorHandler
            );
        }
    }

    /**
     * Check if the given experimental feature is enabled
     * @param feature The feature to check
     */
    isFeatureEnabled(feature: ExperimentalFeatures | CompatibleExperimentalFeatures): boolean {
        return (
            this.getContentModelEditorCore().experimentalFeatures.indexOf(
                feature as ExperimentalFeatures
            ) >= 0
        );
    }

    /**
     * @deprecated Use getZoomScale() instead
     */
    getSizeTransformer(): SizeTransformer {
        return this.getContentModelEditorCore().sizeTransformer;
    }

    /**
     * Retrieves the rect of the visible viewport of the editor.
     */
    getVisibleViewport(): Rect | null {
        const core = this.getCore();

        return core.api.getVisibleViewport(core);
    }

    /**
     * Get a darkColorHandler object for this editor.
     */
    getDarkColorHandler(): DarkColorHandler {
        const core = this.getContentModelEditorCore();
        return core.darkColorHandler;
    }

    /**
     * @returns the current ContentModelEditorCore object
     * @throws a standard Error if there's no core object
     */
    private getContentModelEditorCore(): ContentModelEditorCore {
        if (!this.contentModelEditorCore) {
            throw new Error('Editor is already disposed');
        }

        return this.contentModelEditorCore;
    }
}
