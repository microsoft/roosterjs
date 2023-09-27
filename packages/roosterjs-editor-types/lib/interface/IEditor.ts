import type BlockElement from './BlockElement';
import type ClipboardData from './ClipboardData';
import type ContentChangedData from './ContentChangedData';
import type DarkColorHandler from './DarkColorHandler';
import type DefaultFormat from './DefaultFormat';
import type IContentTraverser from './IContentTraverser';
import type IPositionContentSearcher from './IPositionContentSearcher';
import type NodePosition from './NodePosition';
import type Rect from './Rect';
import type Region from './Region';
import type SelectionPath from './SelectionPath';
import type TableSelection from './TableSelection';
import type { ChangeSource } from '../enum/ChangeSource';
import type { ColorTransformDirection } from '../enum/ColorTransformDirection';
import type { ContentPosition } from '../enum/ContentPosition';
import type { DOMEventHandler } from '../type/domEventHandler';
import type { EditorUndoState, PendableFormatState, StyleBasedFormatState } from './FormatState';
import type { ExperimentalFeatures } from '../enum/ExperimentalFeatures';
import type { GenericContentEditFeature } from './ContentEditFeature';
import type { GetContentMode } from '../enum/GetContentMode';
import type { InsertOption } from './InsertOption';
import type { PluginEvent } from '../event/PluginEvent';
import type { PluginEventData, PluginEventFromType } from '../event/PluginEventData';
import type { PluginEventType } from '../enum/PluginEventType';
import type { PositionType } from '../enum/PositionType';
import type { QueryScope } from '../enum/QueryScope';
import type { RegionType } from '../enum/RegionType';
import type { SelectionRangeEx } from './SelectionRangeEx';
import type { SizeTransformer } from '../type/SizeTransformer';
import type { TrustedHTMLHandler } from '../type/TrustedHTMLHandler';
import type { CompatiblePluginEventType } from '../compatibleEnum/PluginEventType';
import type { CompatibleChangeSource } from '../compatibleEnum/ChangeSource';
import type { CompatibleContentPosition } from '../compatibleEnum/ContentPosition';
import type { CompatibleExperimentalFeatures } from '../compatibleEnum/ExperimentalFeatures';
import type { CompatibleGetContentMode } from '../compatibleEnum/GetContentMode';
import type { CompatibleQueryScope } from '../compatibleEnum/QueryScope';
import type { CompatibleRegionType } from '../compatibleEnum/RegionType';
import type { CompatibleColorTransformDirection } from '../compatibleEnum/ColorTransformDirection';

/**
 * Interface of roosterjs editor object
 */
export default interface IEditor {
    /**
     * Dispose this editor, dispose all plugins and custom data
     */
    dispose(): void;

    /**
     * Get whether this editor is disposed
     * @returns True if editor is disposed, otherwise false
     */
    isDisposed(): boolean;

    //#region Node API

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
    insertNode(node: Node, option?: InsertOption): boolean;

    /**
     * Delete a node from editor content
     * @param node The node to delete
     * @returns true if node is deleted. Otherwise false
     */
    deleteNode(node: Node): boolean;

    /**
     * Replace a node in editor content with another node
     * @param existingNode The existing node to be replaced
     * @param toNode node to replace to
     * @param transformColorForDarkMode (optional) Whether to transform new node to dark mode. Default is false
     * @returns true if node is replaced. Otherwise false
     */
    replaceNode(existingNode: Node, toNode: Node, transformColorForDarkMode?: boolean): boolean;

    /**
     * Get BlockElement at given node
     * @param node The node to create InlineElement
     * @returns The BlockElement result
     */
    getBlockElementAtNode(node: Node): BlockElement | null;

    /**
     * Check if the node falls in the editor content
     * @param node The node to check
     * @returns True if the given node is in editor content, otherwise false
     */
    contains(node: Node | null): boolean;

    /**
     * Check if the range falls in the editor content
     * @param range The range to check
     * @returns True if the given range is in editor content, otherwise false
     */
    contains(range: Range): boolean;

    /**
     * Query HTML elements in editor by tag name
     * @param tag Tag name of the element to query
     * @param forEachCallback An optional callback to be invoked on each element in query result
     * @returns HTML Element array of the query result
     */
    queryElements<T extends keyof HTMLElementTagNameMap>(
        tag: T,
        forEachCallback?: (node: HTMLElementTagNameMap[T]) => any
    ): HTMLElementTagNameMap[T][];

    /**
     * Query HTML elements in editor by a selector string
     * @param selector Selector string to query
     * @param forEachCallback An optional callback to be invoked on each node in query result
     * @returns HTML Element array of the query result
     */
    queryElements<T extends HTMLElement = HTMLElement>(
        selector: string,
        forEachCallback?: (node: T) => any
    ): T[];

    /**
     * Query HTML elements with the given scope by tag name
     * @param tag Tag name of the element to query
     * @param scope The scope of the query, default value is QueryScope.Body
     * @param forEachCallback An optional callback to be invoked on each element in query result
     * @returns HTML Element list of the query result
     */
    queryElements<T extends keyof HTMLElementTagNameMap>(
        tag: T,
        scope: QueryScope | CompatibleQueryScope,
        forEachCallback?: (node: HTMLElementTagNameMap[T]) => any
    ): HTMLElementTagNameMap[T][];

    /**
     * Query HTML elements with the given scope by a selector string
     * @param selector Selector string to query
     * @param scope The scope of the query, default value is QueryScope.Body
     * @param forEachCallback An optional callback to be invoked on each element in query result
     * @returns HTML Element array of the query result
     */
    queryElements<T extends HTMLElement = HTMLElement>(
        selector: string,
        scope: QueryScope | CompatibleQueryScope,
        forEachCallback?: (node: T) => any
    ): T[];

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
    collapseNodes(start: Node, end: Node, canSplitParent: boolean): Node[];

    //#endregion

    //#region Content API

    /**
     * Check whether the editor contains any visible content
     * @param trim Whether trim the content string before check. Default is false
     * @returns True if there's no visible content, otherwise false
     */
    isEmpty(trim?: boolean): boolean;

    /**
     * Get current editor content as HTML string
     * @param mode specify what kind of HTML content to retrieve
     * @returns HTML string representing current editor content
     */
    getContent(mode?: GetContentMode | CompatibleGetContentMode): string;

    /**
     * Set HTML content to this editor. All existing content will be replaced. A ContentChanged event will be triggered
     * @param content HTML content to set in
     * @param triggerContentChangedEvent True to trigger a ContentChanged event. Default value is true
     */
    setContent(content: string, triggerContentChangedEvent?: boolean): void;

    /**
     * Insert HTML content into editor
     * @param HTML content to insert
     * @param option Insert options. Default value is:
     *  position: ContentPosition.SelectionStart
     *  updateCursor: true
     *  replaceSelection: true
     *  insertOnNewLine: false
     */
    insertContent(content: string, option?: InsertOption): void;

    /**
     * Delete selected content
     */
    deleteSelectedContent(): NodePosition | null;

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
        pasteAsText?: boolean,
        applyCurrentFormat?: boolean,
        pasteAsImage?: boolean
    ): void;

    //#endregion

    //#region Focus and Selection

    /**
     * Get current selection range from Editor.
     * It does a live pull on the selection, if nothing retrieved, return whatever we have in cache.
     * @param tryGetFromCache Set to true to retrieve the selection range from cache if editor doesn't own the focus now.
     * Default value is true
     * @returns current selection range, or null if editor never got focus before
     */
    getSelectionRange(tryGetFromCache?: boolean): Range | null;

    /**
     * Get current selection range from Editor.
     * It does a live pull on the selection.
     * @returns current selection range, or null if editor never got focus before
     */
    getSelectionRangeEx(): SelectionRangeEx;

    /**
     * Get current selection in a serializable format
     * It does a live pull on the selection, if nothing retrieved, return whatever we have in cache.
     * @returns current selection path, or null if editor never got focus before
     */
    getSelectionPath(): SelectionPath | null;

    /**
     * Check if focus is in editor now
     * @returns true if focus is in editor, otherwise false
     */
    hasFocus(): boolean;

    /**
     * Focus to this editor, the selection was restored to where it was before, no unexpected scroll.
     */
    focus(): void;

    /**
     * Select content by range
     * @param range The range to select
     * @returns True if content is selected, otherwise false
     */
    select(range: Range): boolean;

    /**
     * Select content by Position and collapse to this position
     * @param position The position to select
     * @returns True if content is selected, otherwise false
     */
    select(position: NodePosition | null): boolean;

    /**
     * Select content by a start and end position
     * @param start The start position to select
     * @param end The end position to select, if this is the same with start, the selection will be collapsed
     * @returns True if content is selected, otherwise false
     */
    select(start: NodePosition, end: NodePosition): boolean;

    /**
     * Select content by node
     * @param node The node to select
     * @returns True if content is selected, otherwise false
     */
    select(node: Node): boolean;

    /**
     * Select content by node and offset, and collapse to this position
     * @param node The node to select
     * @param offset The offset of node to select, can be a number or value of PositionType
     * @returns True if content is selected, otherwise false
     */
    select(node: Node, offset: number | PositionType): boolean;

    /**
     * Select content by start and end nodes and offsets
     * @param startNode The node to select start from
     * @param startOffset The offset to select start from
     * @param endNode The node to select end to
     * @param endOffset The offset to select end to
     * @returns True if content is selected, otherwise false
     */
    select(
        startNode: Node,
        startOffset: number | PositionType,
        endNode: Node,
        endOffset: number | PositionType
    ): boolean;

    /**
     * Select content by selection path
     * @param path A selection path object
     * @returns True if content is selected, otherwise false
     */
    select(path: SelectionPath): boolean;

    /**
     * Select content using the Table Selection
     * @param table to select
     * @param coordinates first and last cell of the range, if null is provided will remove the selection on the table
     */
    select(table: HTMLTableElement, coordinates: TableSelection | null): boolean;

    /**
     * Select content SelectionRangeEx
     * @param rangeEx SelectionRangeEx object to specify what to select
     */
    select(rangeEx: SelectionRangeEx): boolean;

    /**
     * Get current focused position. Return null if editor doesn't have focus at this time.
     */
    getFocusedPosition(): NodePosition | null;

    /**
     * Get an HTML element from current cursor position.
     * When expectedTags is not specified, return value is the current node (if it is HTML element)
     * or its parent node (if current node is a Text node).
     * When expectedTags is specified, return value is the first ancestor of current node which has
     * one of the expected tags.
     * If no element found within editor by the given tag, return null.
     * @param selector Optional, an HTML selector to find HTML element with.
     * @param startFrom Optional, start search from this node. If not specified, start from current focused position
     * @param event Optional, if specified, editor will try to get cached result from the event object first.
     * If it is not cached before, query from DOM and cache the result into the event object
     */
    getElementAtCursor(
        selector?: string,
        startFrom?: Node,
        event?: PluginEvent
    ): HTMLElement | null;

    /**
     * Check if this position is at beginning of the editor.
     * This will return true if all nodes between the beginning of target node and the position are empty.
     * @param position The position to check
     * @returns True if position is at beginning of the editor, otherwise false
     */
    isPositionAtBeginning(position: NodePosition): boolean;

    /**
     * Get impacted regions from selection
     */
    getSelectedRegions(type?: RegionType | CompatibleRegionType): Region[];

    //#endregion

    //#region EVENT API

    /**
     * Add a custom DOM event handler to handle events not handled by roosterjs.
     * Caller need to take the responsibility to dispose the handler properly
     * @param eventName DOM event name to handle
     * @param handler Handler callback
     * @returns A dispose function. Call the function to dispose this event handler
     */
    addDomEventHandler(eventName: string, handler: DOMEventHandler): () => void;

    /**
     * Add a bunch of custom DOM event handler to handle events not handled by roosterjs.
     * Caller need to take the responsibility to dispose the handler properly
     * @param handlerMap A event name => event handler map
     * @returns A dispose function. Call the function to dispose all event handlers added by this function
     */
    addDomEventHandler(handlerMap: Record<string, DOMEventHandler>): () => void;

    /**
     * Trigger an event to be dispatched to all plugins
     * @param eventType Type of the event
     * @param data data of the event with given type, this is the rest part of PluginEvent with the given type
     * @param broadcast indicates if the event needs to be dispatched to all plugins
     * True means to all, false means to allow exclusive handling from one plugin unless no one wants that
     * @returns the event object which is really passed into plugins. Some plugin may modify the event object so
     * the result of this function provides a chance to read the modified result
     */
    triggerPluginEvent<T extends PluginEventType | CompatiblePluginEventType>(
        eventType: T,
        data: PluginEventData<T>,
        broadcast?: boolean
    ): PluginEventFromType<T>;

    /**
     * Trigger a ContentChangedEvent
     * @param source Source of this event, by default is 'SetContent'
     * @param data additional data for this event
     */
    triggerContentChangedEvent(
        source?: ChangeSource | CompatibleChangeSource | string,
        data?: any
    ): void;

    //#endregion

    //#region Undo API

    /**
     * Undo last edit operation
     */
    undo(): void;

    /**
     * Redo next edit operation
     */
    redo(): void;

    /**
     * Add undo snapshot, and execute a format callback function, then add another undo snapshot, then trigger
     * ContentChangedEvent with given change source.
     * If this function is called nested, undo snapshot will only be added in the outside one
     * @param callback The callback function to perform formatting, returns a data object which will be used as
     * the data field in ContentChangedEvent if changeSource is not null.
     * @param changeSource The change source to use when fire ContentChangedEvent. When the value is not null,
     * a ContentChangedEvent will be fired with change source equal to this value
     * @param canUndoByBackspace True if this action can be undone when user presses Backspace key (aka Auto Complete).
     * @param additionalData Optional parameter to provide additional data related to the ContentChanged Event.
     */
    addUndoSnapshot(
        callback?: (start: NodePosition | null, end: NodePosition | null) => any,
        changeSource?: ChangeSource | CompatibleChangeSource | string,
        canUndoByBackspace?: boolean,
        additionalData?: ContentChangedData
    ): void;

    /**
     * Whether there is an available undo/redo snapshot
     */
    getUndoState(): EditorUndoState;

    //#endregion

    //#region Misc

    /**
     * Get document which contains this editor
     * @returns The HTML document which contains this editor
     */
    getDocument(): Document;

    /**
     * Get the scroll container of the editor
     */
    getScrollContainer(): HTMLElement;

    /**
     * Get custom data related to this editor
     * @param key Key of the custom data
     * @param getter Getter function. If custom data for the given key doesn't exist,
     * call this function to get one and store it if it is specified. Otherwise return undefined
     * @param disposer An optional disposer function to dispose this custom data when
     * dispose editor.
     */
    getCustomData<T>(key: string, getter?: () => T, disposer?: (value: T) => void): T;

    /**
     * Check if editor is in IME input sequence
     * @returns True if editor is in IME input sequence, otherwise false
     */
    isInIME(): boolean;

    /**
     * Get default format of this editor
     * @returns Default format object of this editor
     */
    getDefaultFormat(): DefaultFormat;

    /**
     * Get a content traverser for the whole editor
     * @param startNode The node to start from. If not passed, it will start from the beginning of the body
     */
    getBodyTraverser(startNode?: Node): IContentTraverser;

    /**
     * Get a content traverser for current selection
     * @returns A content traverser, or null if editor never got focus before and no range is provided
     */
    getSelectionTraverser(range?: Range): IContentTraverser | null;

    /**
     * Get a content traverser for current block element start from specified position
     * @param startFrom Start position of the traverser. Default value is ContentPosition.SelectionStart
     * @returns A content traverser, or null if editor never got focus before
     */
    getBlockTraverser(
        startFrom?: ContentPosition | CompatibleContentPosition
    ): IContentTraverser | null;

    /**
     * Get a text traverser of current selection
     * @param event Optional, if specified, editor will try to get cached result from the event object first.
     * If it is not cached before, query from DOM and cache the result into the event object
     * @returns A content traverser, or null if editor never got focus before
     */
    getContentSearcherOfCursor(event?: PluginEvent | null): IPositionContentSearcher | null;

    /**
     * Run a callback function asynchronously
     * @param callback The callback function to run
     * @returns a function to cancel this async run
     */
    runAsync(callback: (editor: IEditor) => void): () => void;

    /**
     * Set DOM attribute of editor content DIV
     * @param name Name of the attribute
     * @param value Value of the attribute
     */
    setEditorDomAttribute(name: string, value: string | null): void;

    /**
     * Get DOM attribute of editor content DIV, null if there is no such attribute.
     * @param name Name of the attribute
     */
    getEditorDomAttribute(name: string): string | null;

    /**
     * @deprecated Use getVisibleViewport() instead
     *
     * Get current relative distance from top-left corner of the given element to top-left corner of editor content DIV.
     * @param element The element to calculate from. If the given element is not in editor, return value will be null
     * @param addScroll When pass true, The return value will also add scrollLeft and scrollTop if any. So the value
     * may be different than what user is seeing from the view. When pass false, scroll position will be ignored.
     * @returns An [x, y] array which contains the left and top distances, or null if the given element is not in editor.
     */
    getRelativeDistanceToEditor(element: HTMLElement, addScroll?: boolean): number[] | null;

    /**
     * Add a Content Edit feature.
     * @param feature The feature to add
     */
    addContentEditFeature(feature: GenericContentEditFeature<PluginEvent>): void;

    /**
     * Remove a Content Edit feature.
     * @param feature The feature to remove
     */
    removeContentEditFeature(feature: GenericContentEditFeature<PluginEvent>): void;

    /**
     * Get style based format state from current selection, including font name/size and colors
     */
    getStyleBasedFormatState(node?: Node): StyleBasedFormatState;

    /**
     * Get the pendable format state from the current selection, including formats as underline, bold, italics
     * @param forceGetStateFromDOM If set to true, will not consider the cached format and will get the format state directly from DOM tree
     * @return The pending format state of editor.
     */
    getPendableFormatState(forceGetStateFromDOM?: boolean): PendableFormatState;

    /**
     * Ensure user will type into a container element rather than into the editor content DIV directly
     * @param position The position that user is about to type to
     * @param keyboardEvent Optional keyboard event object
     */
    ensureTypeInContainer(position: NodePosition, keyboardEvent?: KeyboardEvent): void;

    //#endregion

    //#region Dark mode APIs

    /**
     * Set the dark mode state and transforms the content to match the new state.
     * @param nextDarkMode The next status of dark mode. True if the editor should be in dark mode, false if not.
     */
    setDarkModeState(nextDarkMode?: boolean): void;

    /**
     * Check if the editor is in dark mode
     * @returns True if the editor is in dark mode, otherwise false
     */
    isDarkMode(): boolean;

    /**
     * Transform the given node and all its child nodes to dark mode color if editor is in dark mode
     * @param node The node to transform
     * @param direction The transform direction. @default ColorTransformDirection.LightToDark
     */
    transformToDarkColor(
        node: Node,
        direction?: ColorTransformDirection | CompatibleColorTransformDirection
    ): void;

    /**
     * Get a darkColorHandler object for this editor.
     */
    getDarkColorHandler(): DarkColorHandler;

    /**
     * Make the editor in "Shadow Edit" mode.
     * In Shadow Edit mode, all format change will finally be ignored.
     * This can be used for building a live preview feature for format button, to allow user
     * see format result without really apply it.
     * This function can be called repeated. If editor is already in shadow edit mode, we can still
     * use this function to do more shadow edit operation.
     */
    startShadowEdit(): void;

    /**
     * Leave "Shadow Edit" mode, all changes made during shadow edit will be discarded
     */
    stopShadowEdit(): void;

    /**
     * Check if editor is in Shadow Edit mode
     */
    isInShadowEdit(): boolean;

    /**
     * Check if the given experimental feature is enabled
     * @param feature The feature to check
     */
    isFeatureEnabled(feature: ExperimentalFeatures | CompatibleExperimentalFeatures): boolean;

    /**
     * Get a function to convert HTML string to trusted HTML string.
     * By default it will just return the input HTML directly. To override this behavior,
     * pass your own trusted HTML handler to EditorOptions.trustedHTMLHandler
     * See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/trusted-types
     */
    getTrustedHTMLHandler(): TrustedHTMLHandler;

    /**
     * Get current zoom scale, default value is 1
     * When editor is put under a zoomed container, need to pass the zoom scale number using EditorOptions.zoomScale
     * to let editor behave correctly especially for those mouse drag/drop behaviors
     * @returns current zoom scale number
     */
    getZoomScale(): number;

    /**
     * Set current zoom scale, default value is 1
     * When editor is put under a zoomed container, need to pass the zoom scale number using EditorOptions.zoomScale
     * to let editor behave correctly especially for those mouse drag/drop behaviors
     */
    setZoomScale(scale: number): void;

    /**
     * @deprecated Use getZoomScale() instead
     */
    getSizeTransformer(): SizeTransformer;

    /**
     * Retrieves the rect of the visible viewport of the editor.
     */
    getVisibleViewport(): Rect | null;
    //#endregion
}
