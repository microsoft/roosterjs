import { isFeatureEnabled } from './isFeatureEnabled';
import {
    BlockElement,
    ChangeSource,
    ClipboardData,
    ColorTransformDirection,
    ContentChangedData,
    ContentPosition,
    CoreCreator,
    DarkColorHandler,
    DefaultFormat,
    DOMEventHandler,
    EditorCore,
    EditorOptions,
    EditorUndoState,
    ExperimentalFeatures,
    GenericContentEditFeature,
    GetContentMode,
    IContentTraverser,
    IEditor,
    InsertOption,
    IPositionContentSearcher,
    NodePosition,
    PendableFormatState,
    PluginEvent,
    PluginEventData,
    PluginEventFromType,
    PluginEventType,
    PositionType,
    QueryScope,
    Rect,
    Region,
    RegionType,
    SelectionPath,
    SelectionRangeEx,
    SizeTransformer,
    StyleBasedFormatState,
    TableSelection,
    TrustedHTMLHandler,
} from 'roosterjs-editor-types';
import {
    cacheGetEventData,
    collapseNodes,
    contains,
    ContentTraverser,
    deleteSelectedContent,
    getRegionsFromRange,
    findClosestElementAncestor,
    getBlockElementAtNode,
    getSelectionPath,
    getTagOfNode,
    isNodeEmpty,
    Position,
    PositionContentSearcher,
    queryElements,
    wrap,
    isPositionAtBeginningOf,
    toArray,
} from 'roosterjs-editor-dom';
import type {
    CompatibleChangeSource,
    CompatibleContentPosition,
    CompatibleExperimentalFeatures,
    CompatibleGetContentMode,
    CompatiblePluginEventType,
    CompatibleQueryScope,
    CompatibleRegionType,
} from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * Base class of editor
 */
export class EditorBase<TEditorCore extends EditorCore, TEditorOptions extends EditorOptions>
    implements IEditor {
    private core: TEditorCore | null = null;

    //#region Lifecycle

    /**
     * Creates an instance of EditorBase
     * @param contentDiv The DIV HTML element which will be the container element of editor
     * @param options An optional options object to customize the editor
     */
    constructor(
        contentDiv: HTMLDivElement,
        options: TEditorOptions,
        coreCreator: CoreCreator<TEditorCore, TEditorOptions>
    ) {
        // 1. Make sure all parameters are valid
        if (getTagOfNode(contentDiv) != 'DIV') {
            throw new Error('contentDiv must be an HTML DIV element');
        }

        // 2. Create editor core
        this.core = coreCreator(contentDiv, options);

        // 3. Initialize plugins
        this.core.plugins.forEach(plugin => plugin.initialize(this));

        // 4. Ensure user will type in a container node, not the editor content DIV
        this.ensureTypeInContainer(
            new Position(this.core.contentDiv, PositionType.Begin).normalize()
        );
    }

    /**
     * Dispose this editor, dispose all plugins and custom data
     */
    public dispose(): void {
        const core = this.getCore();
        for (let i = core.plugins.length - 1; i >= 0; i--) {
            core.plugins[i].dispose();
        }

        core.darkColorHandler.reset();

        this.core = null;
    }

    /**
     * Get whether this editor is disposed
     * @returns True if editor is disposed, otherwise false
     */
    public isDisposed(): boolean {
        return !this.core;
    }

    //#endregion

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
    public insertNode(node: Node, option?: InsertOption): boolean {
        const core = this.getCore();
        return node ? core.api.insertNode(core, node, option ?? null) : false;
    }

    /**
     * Delete a node from editor content
     * @param node The node to delete
     * @returns true if node is deleted. Otherwise false
     */
    public deleteNode(node: Node): boolean {
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
    public replaceNode(
        existingNode: Node,
        toNode: Node,
        transformColorForDarkMode?: boolean
    ): boolean {
        const core = this.getCore();
        // Only replace the node when it falls within editor
        if (this.contains(existingNode) && toNode) {
            core.api.transformColor(
                core,
                transformColorForDarkMode ? toNode : null,
                true /*includeSelf*/,
                () => existingNode.parentNode?.replaceChild(toNode, existingNode),
                ColorTransformDirection.LightToDark
            );

            return true;
        }

        return false;
    }

    /**
     * Get BlockElement at given node
     * @param node The node to create InlineElement
     * @returns The BlockElement result
     */
    public getBlockElementAtNode(node: Node): BlockElement | null {
        return getBlockElementAtNode(this.getCore().contentDiv, node);
    }

    public contains(arg: Node | Range | null): boolean {
        if (!arg) {
            return false;
        }
        return contains(this.getCore().contentDiv, <Node>arg);
    }

    public queryElements(
        selector: string,
        scopeOrCallback:
            | QueryScope
            | CompatibleQueryScope
            | ((node: Node) => any) = QueryScope.Body,
        callback?: (node: Node) => any
    ) {
        const core = this.getCore();
        const result: HTMLElement[] = [];
        let scope = scopeOrCallback instanceof Function ? QueryScope.Body : scopeOrCallback;
        callback = scopeOrCallback instanceof Function ? scopeOrCallback : callback;

        let selectionEx = scope == QueryScope.Body ? null : this.getSelectionRangeEx();
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
    public collapseNodes(start: Node, end: Node, canSplitParent: boolean): Node[] {
        return collapseNodes(this.getCore().contentDiv, start, end, canSplitParent);
    }

    //#endregion

    //#region Content API

    /**
     * Check whether the editor contains any visible content
     * @param trim Whether trim the content string before check. Default is false
     * @returns True if there's no visible content, otherwise false
     */
    public isEmpty(trim?: boolean): boolean {
        return isNodeEmpty(this.getCore().contentDiv, trim);
    }

    /**
     * Get current editor content as HTML string
     * @param mode specify what kind of HTML content to retrieve
     * @returns HTML string representing current editor content
     */
    public getContent(
        mode: GetContentMode | CompatibleGetContentMode = GetContentMode.CleanHTML
    ): string {
        const core = this.getCore();
        return core.api.getContent(core, mode);
    }

    /**
     * Set HTML content to this editor. All existing content will be replaced. A ContentChanged event will be triggered
     * @param content HTML content to set in
     * @param triggerContentChangedEvent True to trigger a ContentChanged event. Default value is true
     */
    public setContent(content: string, triggerContentChangedEvent: boolean = true) {
        const core = this.getCore();
        core.api.setContent(core, content, triggerContentChangedEvent);
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
    public insertContent(content: string, option?: InsertOption) {
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

            let fragment = doc.createDocumentFragment();
            allNodes.forEach(node => fragment.appendChild(node));

            this.insertNode(fragment, option);
        }
    }

    /**
     * Delete selected content
     */
    public deleteSelectedContent(): NodePosition | null {
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
    public paste(
        clipboardData: ClipboardData,
        pasteAsText: boolean = false,
        applyCurrentFormat: boolean = false,
        pasteAsImage: boolean = false
    ) {
        const core = this.getCore();
        if (!clipboardData) {
            return;
        }

        if (clipboardData.snapshotBeforePaste) {
            // Restore original content before paste a new one
            this.setContent(clipboardData.snapshotBeforePaste);
        } else {
            clipboardData.snapshotBeforePaste = this.getContent(
                GetContentMode.RawHTMLWithSelection
            );
        }

        const range = this.getSelectionRange();
        const pos = range && Position.getStart(range);
        const fragment = core.api.createPasteFragment(
            core,
            clipboardData,
            pos,
            pasteAsText,
            applyCurrentFormat,
            pasteAsImage
        );
        if (fragment) {
            this.addUndoSnapshot(() => {
                this.insertNode(fragment);
                return clipboardData;
            }, ChangeSource.Paste);
        }
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
    public getSelectionRange(tryGetFromCache: boolean = true): Range | null {
        const core = this.getCore();
        return core.api.getSelectionRange(core, tryGetFromCache);
    }

    /**
     * Get current selection range from Editor.
     * It does a live pull on the selection, if nothing retrieved, return whatever we have in cache.
     * @param tryGetFromCache Set to true to retrieve the selection range from cache if editor doesn't own the focus now.
     * Default value is true
     * @returns current selection range, or null if editor never got focus before
     */
    public getSelectionRangeEx(): SelectionRangeEx {
        const core = this.getCore();
        return core.api.getSelectionRangeEx(core);
    }

    /**
     * Get current selection in a serializable format
     * It does a live pull on the selection, if nothing retrieved, return whatever we have in cache.
     * @returns current selection path, or null if editor never got focus before
     */
    public getSelectionPath(): SelectionPath | null {
        const range = this.getSelectionRange();
        return range && getSelectionPath(this.getCore().contentDiv, range);
    }

    /**
     * Check if focus is in editor now
     * @returns true if focus is in editor, otherwise false
     */
    public hasFocus(): boolean {
        const core = this.getCore();
        return core.api.hasFocus(core);
    }

    /**
     * Focus to this editor, the selection was restored to where it was before, no unexpected scroll.
     */
    public focus() {
        const core = this.getCore();
        core.api.focus(core);
    }

    public select(
        arg1: Range | SelectionRangeEx | NodePosition | Node | SelectionPath | null,
        arg2?: NodePosition | number | PositionType | TableSelection | null,
        arg3?: Node,
        arg4?: number | PositionType
    ): boolean {
        const core = this.getCore();

        return core.api.select(core, arg1, arg2, arg3, arg4);
    }

    /**
     * Get current focused position. Return null if editor doesn't have focus at this time.
     */
    public getFocusedPosition(): NodePosition | null {
        let sel = this.getDocument().defaultView?.getSelection();
        if (sel?.focusNode && this.contains(sel.focusNode)) {
            return new Position(sel.focusNode, sel.focusOffset);
        }

        let range = this.getSelectionRange();
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
    public getElementAtCursor(
        selector?: string,
        startFrom?: Node,
        event?: PluginEvent
    ): HTMLElement | null {
        event = startFrom ? undefined : event; // Only use cache when startFrom is not specified, for different start position can have different result

        return (
            cacheGetEventData(event ?? null, 'GET_ELEMENT_AT_CURSOR_' + selector, () => {
                if (!startFrom) {
                    let position = this.getFocusedPosition();
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
    public isPositionAtBeginning(position: NodePosition): boolean {
        return isPositionAtBeginningOf(position, this.getCore().contentDiv);
    }

    /**
     * Get impacted regions from selection
     */
    public getSelectedRegions(
        type: RegionType | CompatibleRegionType = RegionType.Table
    ): Region[] {
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

    public addDomEventHandler(
        nameOrMap: string | Record<string, DOMEventHandler>,
        handler?: DOMEventHandler
    ): () => void {
        const eventsToMap = typeof nameOrMap == 'string' ? { [nameOrMap]: handler! } : nameOrMap;
        const core = this.getCore();
        return core.api.attachDomEvent(core, eventsToMap);
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
        const core = this.getCore();
        let event = ({
            eventType,
            ...data,
        } as any) as PluginEventFromType<T>;
        core.api.triggerEvent(core, event, broadcast);

        return event;
    }

    /**
     * Trigger a ContentChangedEvent
     * @param source Source of this event, by default is 'SetContent'
     * @param data additional data for this event
     */
    public triggerContentChangedEvent(
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
    public undo() {
        this.focus();
        const core = this.getCore();
        core.api.restoreUndoSnapshot(core, -1 /*step*/);
    }

    /**
     * Redo next edit operation
     */
    public redo() {
        this.focus();
        const core = this.getCore();
        core.api.restoreUndoSnapshot(core, 1 /*step*/);
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
    public addUndoSnapshot(
        callback?: (start: NodePosition | null, end: NodePosition | null) => any,
        changeSource?: ChangeSource | CompatibleChangeSource | string,
        canUndoByBackspace?: boolean,
        additionalData?: ContentChangedData
    ) {
        const core = this.getCore();
        core.api.addUndoSnapshot(
            core,
            callback ?? null,
            changeSource ?? null,
            canUndoByBackspace ?? false,
            additionalData
        );
    }

    /**
     * Whether there is an available undo/redo snapshot
     */
    public getUndoState(): EditorUndoState {
        const { hasNewContent, snapshotsService } = this.getCore().undo;
        return {
            canUndo: hasNewContent || snapshotsService.canMove(-1 /*previousSnapshot*/),
            canRedo: snapshotsService.canMove(1 /*nextSnapshot*/),
        };
    }

    //#endregion

    //#region Misc

    /**
     * Get document which contains this editor
     * @returns The HTML document which contains this editor
     */
    public getDocument(): Document {
        return this.getCore().contentDiv.ownerDocument;
    }

    /**
     * Get the scroll container of the editor
     */
    public getScrollContainer(): HTMLElement {
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
    public getCustomData<T>(key: string, getter?: () => T, disposer?: (value: T) => void): T {
        const core = this.getCore();
        return (core.lifecycle.customData[key] = core.lifecycle.customData[key] || {
            value: getter ? getter() : undefined,
            disposer,
        }).value as T;
    }

    /**
     * Check if editor is in IME input sequence
     * @returns True if editor is in IME input sequence, otherwise false
     */
    public isInIME(): boolean {
        return this.getCore().domEvent.isInIME;
    }

    /**
     * Get default format of this editor
     * @returns Default format object of this editor
     */
    public getDefaultFormat(): DefaultFormat {
        return this.getCore().lifecycle.defaultFormat ?? {};
    }

    /**
     * Get a content traverser for the whole editor
     * @param startNode The node to start from. If not passed, it will start from the beginning of the body
     */
    public getBodyTraverser(startNode?: Node): IContentTraverser {
        return ContentTraverser.createBodyTraverser(this.getCore().contentDiv, startNode);
    }

    /**
     * Get a content traverser for current selection
     * @returns A content traverser, or null if editor never got focus before
     */
    public getSelectionTraverser(range?: Range): IContentTraverser | null {
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
    public getBlockTraverser(
        startFrom: ContentPosition | CompatibleContentPosition = ContentPosition.SelectionStart
    ): IContentTraverser | null {
        let range = this.getSelectionRange();
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
    public getContentSearcherOfCursor(event?: PluginEvent): IPositionContentSearcher | null {
        return cacheGetEventData(event ?? null, 'ContentSearcher', () => {
            let range = this.getSelectionRange();
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
    public runAsync(callback: (editor: IEditor) => void) {
        let win = this.getCore().contentDiv.ownerDocument.defaultView || window;
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
    public setEditorDomAttribute(name: string, value: string | null) {
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
    public getEditorDomAttribute(name: string): string | null {
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
    public addContentEditFeature(feature: GenericContentEditFeature<PluginEvent>) {
        const core = this.getCore();
        feature?.keys.forEach(key => {
            let array = core.edit.features[key] || [];
            array.push(feature);
            core.edit.features[key] = array;
        });
    }

    /**
     * Remove a Content Edit feature.
     * @param feature The feature to remove
     */
    public removeContentEditFeature(feature: GenericContentEditFeature<PluginEvent>) {
        const core = this.getCore();
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
    public getStyleBasedFormatState(node?: Node): StyleBasedFormatState {
        if (!node) {
            const range = this.getSelectionRange();
            node = (range && Position.getStart(range).normalize().node) ?? undefined;
        }
        const core = this.getCore();
        return core.api.getStyleBasedFormatState(core, node ?? null);
    }

    /**
     * Get the pendable format such as underline and bold
     * @param forceGetStateFromDOM If set to true, will force get the format state from DOM tree.
     * @returns The pending format state
     */
    public getPendableFormatState(forceGetStateFromDOM: boolean = false): PendableFormatState {
        const core = this.getCore();
        return core.api.getPendableFormatState(core, forceGetStateFromDOM);
    }

    /**
     * Ensure user will type into a container element rather than into the editor content DIV directly
     * @param position The position that user is about to type to
     * @param keyboardEvent Optional keyboard event object
     */
    public ensureTypeInContainer(position: NodePosition, keyboardEvent?: KeyboardEvent) {
        const core = this.getCore();
        core.api.ensureTypeInContainer(core, position, keyboardEvent);
    }

    //#endregion

    //#region Dark mode APIs

    /**
     * Set the dark mode state and transforms the content to match the new state.
     * @param nextDarkMode The next status of dark mode. True if the editor should be in dark mode, false if not.
     */
    public setDarkModeState(nextDarkMode?: boolean) {
        const isDarkMode = this.isDarkMode();

        if (isDarkMode == !!nextDarkMode) {
            return;
        }
        const core = this.getCore();

        core.api.transformColor(
            core,
            core.contentDiv,
            false /*includeSelf*/,
            null /*callback*/,
            nextDarkMode
                ? ColorTransformDirection.LightToDark
                : ColorTransformDirection.DarkToLight,
            true /*forceTransform*/,
            isDarkMode
        );

        this.triggerContentChangedEvent(
            nextDarkMode ? ChangeSource.SwitchToDarkMode : ChangeSource.SwitchToLightMode
        );
    }

    /**
     * Check if the editor is in dark mode
     * @returns True if the editor is in dark mode, otherwise false
     */
    public isDarkMode(): boolean {
        return this.getCore().lifecycle.isDarkMode;
    }

    /**
     * Transform the given node and all its child nodes to dark mode color if editor is in dark mode
     * @param node The node to transform
     */
    public transformToDarkColor(node: Node) {
        const core = this.getCore();
        core.api.transformColor(
            core,
            node,
            true /*includeSelf*/,
            null /*callback*/,
            ColorTransformDirection.LightToDark
        );
    }

    /**
     * Get a darkColorHandler object for this editor.
     */
    public getDarkColorHandler(): DarkColorHandler {
        return this.getCore().darkColorHandler;
    }

    /**
     * Make the editor in "Shadow Edit" mode.
     * In Shadow Edit mode, all format change will finally be ignored.
     * This can be used for building a live preview feature for format button, to allow user
     * see format result without really apply it.
     * This function can be called repeated. If editor is already in shadow edit mode, we can still
     * use this function to do more shadow edit operation.
     */
    public startShadowEdit() {
        const core = this.getCore();
        core.api.switchShadowEdit(core, true /*isOn*/);
    }

    /**
     * Leave "Shadow Edit" mode, all changes made during shadow edit will be discarded
     */
    public stopShadowEdit() {
        const core = this.getCore();
        core.api.switchShadowEdit(core, false /*isOn*/);
    }

    /**
     * Check if editor is in Shadow Edit mode
     */
    public isInShadowEdit() {
        return !!this.getCore().lifecycle.shadowEditFragment;
    }

    /**
     * Check if the given experimental feature is enabled
     * @param feature The feature to check
     */
    public isFeatureEnabled(
        feature: ExperimentalFeatures | CompatibleExperimentalFeatures
    ): boolean {
        return isFeatureEnabled(this.getCore().lifecycle.experimentalFeatures, feature);
    }

    /**
     * Get a function to convert HTML string to trusted HTML string.
     * By default it will just return the input HTML directly. To override this behavior,
     * pass your own trusted HTML handler to EditorOptions.trustedHTMLHandler
     * See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/trusted-types
     */
    getTrustedHTMLHandler(): TrustedHTMLHandler {
        return this.getCore().trustedHTMLHandler;
    }

    /**
     * @deprecated Use getZoomScale() instead
     */
    getSizeTransformer(): SizeTransformer {
        return this.getCore().sizeTransformer;
    }

    /**
     * Get current zoom scale, default value is 1
     * When editor is put under a zoomed container, need to pass the zoom scale number using EditorOptions.zoomScale
     * to let editor behave correctly especially for those mouse drag/drop behaviors
     * @returns current zoom scale number
     */
    getZoomScale(): number {
        return this.getCore().zoomScale;
    }

    /**
     * Set current zoom scale, default value is 1
     * When editor is put under a zoomed container, need to pass the zoom scale number using EditorOptions.zoomScale
     * to let editor behave correctly especially for those mouse drag/drop behaviors
     * @param scale The new scale number to set. It should be positive number and no greater than 10, otherwise it will be ignored.
     */
    setZoomScale(scale: number): void {
        const core = this.getCore();
        if (scale > 0 && scale <= 10) {
            const oldValue = core.zoomScale;
            core.zoomScale = scale;

            if (oldValue != scale) {
                this.triggerPluginEvent(
                    PluginEventType.ZoomChanged,
                    {
                        oldZoomScale: oldValue,
                        newZoomScale: scale,
                    },
                    true /*broadcast*/
                );
            }
        }
    }

    /**
     * Retrieves the rect of the visible viewport of the editor.
     */
    getVisibleViewport(): Rect | null {
        return this.getCore().getVisibleViewport();
    }

    /**
     * @returns the current EditorCore object
     * @throws a standard Error if there's no core object
     */
    protected getCore(): TEditorCore {
        if (!this.core) {
            throw new Error('Editor is already disposed');
        }
        return this.core;
    }

    //#endregion
}
