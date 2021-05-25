import { coreApiMap } from '../coreApi/coreApiMap';
import createCorePlugins, {
    getPluginState,
    PLACEHOLDER_PLUGIN_NAME,
} from '../corePlugins/createCorePlugins';
import {
    BlockElement,
    ChangeSource,
    ClipboardData,
    ColorTransformDirection,
    ContentPosition,
    CorePlugins,
    DefaultFormat,
    DOMEventHandler,
    EditorCore,
    EditorOptions,
    EditorPlugin,
    EditorUndoState,
    ExperimentalFeatures,
    GenericContentEditFeature,
    GetContentMode,
    IContentTraverser,
    IEditor,
    InsertOption,
    IPositionContentSearcher,
    NodePosition,
    PluginEvent,
    PluginEventData,
    PluginEventFromType,
    PluginEventType,
    PositionType,
    QueryScope,
    Region,
    RegionType,
    SelectionPath,
    StyleBasedFormatState,
} from 'roosterjs-editor-types';
import {
    cacheGetEventData,
    collapseNodes,
    contains,
    ContentTraverser,
    createRange,
    deleteSelectedContent,
    getRegionsFromRange,
    findClosestElementAncestor,
    fromHtml,
    getBlockElementAtNode,
    getSelectionPath,
    getTagOfNode,
    isNodeEmpty,
    safeInstanceOf,
    Position,
    PositionContentSearcher,
    queryElements,
    wrap,
    isPositionAtBeginningOf,
    arrayPush,
} from 'roosterjs-editor-dom';

/**
 * RoosterJs core editor class
 */
export default class Editor implements IEditor {
    private core: EditorCore;

    //#region Lifecycle

    /**
     * Creates an instance of Editor
     * @param contentDiv The DIV HTML element which will be the container element of editor
     * @param options An optional options object to customize the editor
     */
    constructor(contentDiv: HTMLDivElement, options: EditorOptions = {}) {
        // 1. Make sure all parameters are valid
        if (getTagOfNode(contentDiv) != 'DIV') {
            throw new Error('contentDiv must be an HTML DIV element');
        }

        // 2. Store options values to local variables
        const corePlugins = createCorePlugins(contentDiv, options);
        const plugins: EditorPlugin[] = [];
        Object.keys(corePlugins).forEach(
            (name: typeof PLACEHOLDER_PLUGIN_NAME | keyof CorePlugins) => {
                if (name == PLACEHOLDER_PLUGIN_NAME) {
                    arrayPush(plugins, options.plugins);
                } else {
                    plugins.push(corePlugins[name]);
                }
            }
        );
        this.core = {
            contentDiv,
            api: {
                ...coreApiMap,
                ...(options.coreApiOverride || {}),
            },
            plugins: plugins.filter(x => !!x),
            ...getPluginState(corePlugins),
        };

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
        this.core.plugins.reverse().forEach(plugin => plugin.dispose());
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
        return node ? this.core.api.insertNode(this.core, node, option) : false;
    }

    /**
     * Delete a node from editor content
     * @param node The node to delete
     * @returns true if node is deleted. Otherwise false
     */
    public deleteNode(node: Node): boolean {
        // Only remove the node when it falls within editor
        if (node && this.contains(node)) {
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
        // Only replace the node when it falls within editor
        if (this.contains(existingNode) && toNode) {
            this.core.api.transformColor(
                this.core,
                transformColorForDarkMode ? toNode : null,
                true /*includeSelf*/,
                () => existingNode.parentNode.replaceChild(toNode, existingNode),
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
    public getBlockElementAtNode(node: Node): BlockElement {
        return getBlockElementAtNode(this.core.contentDiv, node);
    }

    public contains(arg: Node | Range): boolean {
        return contains(this.core.contentDiv, <Node>arg);
    }

    public queryElements(
        selector: string,
        scopeOrCallback: QueryScope | ((node: Node) => any) = QueryScope.Body,
        callback?: (node: Node) => any
    ) {
        let scope = scopeOrCallback instanceof Function ? QueryScope.Body : scopeOrCallback;
        callback = scopeOrCallback instanceof Function ? scopeOrCallback : callback;

        let range = scope == QueryScope.Body ? null : this.getSelectionRange();
        return queryElements(this.core.contentDiv, selector, callback, scope, range);
    }

    /**
     * Collapse nodes within the given start and end nodes to their common ascenstor node,
     * split parent nodes if necessary
     * @param start The start node
     * @param end The end node
     * @param canSplitParent True to allow split parent node there are nodes before start or after end under the same parent
     * and the returned nodes will be all nodes from start trhough end after splitting
     * False to disallow split parent
     * @returns When cansplitParent is true, returns all node from start through end after splitting,
     * otherwise just return start and end
     */
    public collapseNodes(start: Node, end: Node, canSplitParent: boolean): Node[] {
        return collapseNodes(this.core.contentDiv, start, end, canSplitParent);
    }

    //#endregion

    //#region Content API

    /**
     * Check whether the editor contains any visible content
     * @param trim Whether trime the content string before check. Default is false
     * @returns True if there's no visible content, otherwise false
     */
    public isEmpty(trim?: boolean): boolean {
        return isNodeEmpty(this.core.contentDiv, trim);
    }

    /**
     * Get current editor content as HTML string
     * @param mode specify what kind of HTML content to retrieve
     * @returns HTML string representing current editor content
     */
    public getContent(mode: GetContentMode = GetContentMode.CleanHTML): string {
        return this.core.api.getContent(this.core, mode);
    }

    /**
     * Set HTML content to this editor. All existing content will be replaced. A ContentChanged event will be triggered
     * @param content HTML content to set in
     * @param triggerContentChangedEvent True to trigger a ContentChanged event. Default value is true
     */
    public setContent(content: string, triggerContentChangedEvent: boolean = true) {
        this.core.api.setContent(this.core, content, triggerContentChangedEvent);
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
            let allNodes = fromHtml(content, doc);

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
    public deleteSelectedContent(): NodePosition {
        const range = this.getSelectionRange();
        return range && !range.collapsed && deleteSelectedContent(this.core.contentDiv, range);
    }

    /**
     * Paste into editor using a clipboardData object
     * @param clipboardData Clipboard data retrieved from clipboard
     * @param pasteAsText Force pasting as plain text. Default value is false
     * @param applyCurrentStyle True if apply format of current selection to the pasted content,
     * false to keep original foramt.  Default value is false. When pasteAsText is true, this parameter is ignored
     */
    public paste(
        clipboardData: ClipboardData,
        pasteAsText?: boolean,
        applyCurrentFormat?: boolean
    ) {
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
        const fragment = this.core.api.createPasteFragment(
            this.core,
            clipboardData,
            pos,
            pasteAsText,
            applyCurrentFormat
        );

        this.addUndoSnapshot(() => {
            this.insertNode(fragment);
            return clipboardData;
        }, ChangeSource.Paste);
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
    public getSelectionRange(tryGetFromCache: boolean = true): Range {
        return this.core.api.getSelectionRange(this.core, tryGetFromCache);
    }

    /**
     * Get current selection in a serializable format
     * It does a live pull on the selection, if nothing retrieved, return whatever we have in cache.
     * @returns current selection path, or null if editor never got focus before
     */
    public getSelectionPath(): SelectionPath {
        const range = this.getSelectionRange();
        return range && getSelectionPath(this.core.contentDiv, range);
    }

    /**
     * Check if focus is in editor now
     * @returns true if focus is in editor, otherwise false
     */
    public hasFocus(): boolean {
        return this.core.api.hasFocus(this.core);
    }

    /**
     * Focus to this editor, the selection was restored to where it was before, no unexpected scroll.
     */
    public focus() {
        this.core.api.focus(this.core);
    }

    public select(arg1: any, arg2?: any, arg3?: any, arg4?: any): boolean {
        let range = !arg1
            ? null
            : safeInstanceOf(arg1, 'Range')
            ? arg1
            : Array.isArray(arg1.start) && Array.isArray(arg1.end)
            ? createRange(
                  this.core.contentDiv,
                  (<SelectionPath>arg1).start,
                  (<SelectionPath>arg1).end
              )
            : createRange(arg1, arg2, arg3, arg4);
        return this.contains(range) && this.core.api.selectRange(this.core, range);
    }

    /**
     * Get current focused position. Return null if editor doesn't have focus at this time.
     */
    public getFocusedPosition(): NodePosition {
        let sel = this.getDocument().defaultView?.getSelection();
        if (this.contains(sel && sel.focusNode)) {
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
     * When expectedTags is specified, return value is the first anscestor of current node which has
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
    ): HTMLElement {
        event = startFrom ? null : event; // Only use cache when startFrom is not specified, for different start position can have different result

        return cacheGetEventData(event, 'GET_ELEMENT_AT_CURSOR_' + selector, () => {
            if (!startFrom) {
                let position = this.getFocusedPosition();
                startFrom = position && position.node;
            }
            return (
                startFrom && findClosestElementAncestor(startFrom, this.core.contentDiv, selector)
            );
        });
    }

    /**
     * Check if this position is at beginning of the editor.
     * This will return true if all nodes between the beginning of target node and the position are empty.
     * @param position The position to check
     * @returns True if position is at beginning of the editor, otherwise false
     */
    public isPositionAtBeginning(position: NodePosition): boolean {
        return isPositionAtBeginningOf(position, this.core.contentDiv);
    }

    /**
     * Get impacted regions from selection
     */
    public getSelectedRegions(type: RegionType = RegionType.Table): Region[] {
        const range = this.getSelectionRange();
        return range ? getRegionsFromRange(this.core.contentDiv, range, type) : [];
    }

    //#endregion

    //#region EVENT API

    public addDomEventHandler(
        nameOrMap: string | Record<string, DOMEventHandler>,
        handler?: DOMEventHandler
    ): () => void {
        const eventsToMap = typeof nameOrMap == 'string' ? { [nameOrMap]: handler } : nameOrMap;
        return this.core.api.attachDomEvent(this.core, eventsToMap);
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
    public triggerPluginEvent<T extends PluginEventType>(
        eventType: T,
        data: PluginEventData<T>,
        broadcast?: boolean
    ): PluginEventFromType<T> {
        let event = ({
            eventType,
            ...data,
        } as any) as PluginEventFromType<T>;
        this.core.api.triggerEvent(this.core, event, broadcast);

        return event;
    }

    /**
     * Trigger a ContentChangedEvent
     * @param source Source of this event, by default is 'SetContent'
     * @param data additional data for this event
     */
    public triggerContentChangedEvent(
        source: ChangeSource | string = ChangeSource.SetContent,
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
        this.core.api.restoreUndoSnapshot(this.core, -1 /*step*/);
    }

    /**
     * Redo next edit operation
     */
    public redo() {
        this.focus();
        this.core.api.restoreUndoSnapshot(this.core, 1 /*step*/);
    }

    /**
     * Add undo snapshot, and execute a format callback function, then add another undo snapshot, then trigger
     * ContentChangedEvent with given change source.
     * If this function is called nested, undo snapshot will only be added in the outside one
     * @param callback The callback function to perform formatting, returns a data object which will be used as
     * the data field in ContentChangedEvent if changeSource is not null.
     * @param changeSource The change source to use when fire ContentChangedEvent. When the value is not null,
     * a ContentChangedEvent will be fired with change source equal to this value
     * @param canUndoByBackspace True if this action can be undone when user press Backspace key (aka Auto Complelte).
     */
    public addUndoSnapshot(
        callback?: (start: NodePosition, end: NodePosition) => any,
        changeSource?: ChangeSource | string,
        canUndoByBackspace?: boolean
    ) {
        this.core.api.addUndoSnapshot(this.core, callback, changeSource, canUndoByBackspace);
    }

    /**
     * Whether there is an available undo/redo snapshot
     */
    public getUndoState(): EditorUndoState {
        const { hasNewContent, snapshotsService } = this.core.undo;
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
        return this.core.contentDiv.ownerDocument;
    }

    /**
     * Get the scroll container of the editor
     */
    public getScrollContainer(): HTMLElement {
        return this.core.domEvent.scrollContainer;
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
        return (this.core.lifecycle.customData[key] = this.core.lifecycle.customData[key] || {
            value: getter ? getter() : undefined,
            disposer,
        }).value as T;
    }

    /**
     * Check if editor is in IME input sequence
     * @returns True if editor is in IME input sequence, otherwise false
     */
    public isInIME(): boolean {
        return this.core.domEvent.isInIME;
    }

    /**
     * Get default format of this editor
     * @returns Default format object of this editor
     */
    public getDefaultFormat(): DefaultFormat {
        return this.core.lifecycle.defaultFormat;
    }

    /**
     * Get a content traverser for the whole editor
     * @param startNode The node to start from. If not passed, it will start from the beginning of the body
     */
    public getBodyTraverser(startNode?: Node): IContentTraverser {
        return ContentTraverser.createBodyTraverser(this.core.contentDiv, startNode);
    }

    /**
     * Get a content traverser for current selection
     */
    public getSelectionTraverser(): IContentTraverser {
        let range = this.getSelectionRange();
        return (
            range &&
            ContentTraverser.createSelectionTraverser(
                this.core.contentDiv,
                this.getSelectionRange()
            )
        );
    }

    /**
     * Get a content traverser for current block element start from specified position
     * @param startFrom Start position of the traverser. Default value is ContentPosition.SelectionStart
     */
    public getBlockTraverser(
        startFrom: ContentPosition = ContentPosition.SelectionStart
    ): IContentTraverser {
        let range = this.getSelectionRange();
        return (
            range && ContentTraverser.createBlockTraverser(this.core.contentDiv, range, startFrom)
        );
    }

    /**
     * Get a text traverser of current selection
     * @param event Optional, if specified, editor will try to get cached result from the event object first.
     * If it is not cached before, query from DOM and cache the result into the event object
     */
    public getContentSearcherOfCursor(event?: PluginEvent): IPositionContentSearcher {
        return cacheGetEventData(event, 'CONTENTSEARCHER', () => {
            let range = this.getSelectionRange();
            return (
                range && new PositionContentSearcher(this.core.contentDiv, Position.getStart(range))
            );
        });
    }

    /**
     * Run a callback function asynchronously
     * @param callback The callback function to run
     */
    public runAsync(callback: (editor: IEditor) => void) {
        let win = this.core.contentDiv.ownerDocument.defaultView || window;
        win.requestAnimationFrame(() => {
            if (!this.isDisposed() && callback) {
                callback(this);
            }
        });
    }

    /**
     * Set DOM attribute of editor content DIV
     * @param name Name of the attribute
     * @param value Value of the attribute
     */
    public setEditorDomAttribute(name: string, value: string) {
        if (value === null) {
            this.core.contentDiv.removeAttribute(name);
        } else {
            this.core.contentDiv.setAttribute(name, value);
        }
    }

    /**
     * get DOM attribute of editor content DIV
     * @param name Name of the attribute
     */
    public getEditorDomAttribute(name: string): string {
        return this.core.contentDiv.getAttribute(name);
    }

    /**
     * Add a Content Edit feature.
     * @param feature The feature to add
     */
    public addContentEditFeature(feature: GenericContentEditFeature<PluginEvent>) {
        feature?.keys.forEach(key => {
            let array = this.core.edit.features[key] || [];
            array.push(feature);
            this.core.edit.features[key] = array;
        });
    }

    /**
     * Get style based format state from current selection, including font name/size and colors
     */
    public getStyleBasedFormatState(node?: Node): StyleBasedFormatState {
        if (!node) {
            const range = this.getSelectionRange();
            node = range && Position.getStart(range).normalize().node;
        }
        return this.core.api.getStyleBasedFormatState(this.core, node);
    }

    /**
     * Ensure user will type into a container element rather than into the editor content DIV directly
     * @param position The position that user is about to type to
     * @param keyboardEvent Optional keyboard event object
     */
    public ensureTypeInContainer(position: NodePosition, keyboardEvent?: KeyboardEvent) {
        this.core.api.ensureTypeInContainer(this.core, position, keyboardEvent);
    }

    //#endregion

    //#region Dark mode APIs

    /**
     * Set the dark mode state and transforms the content to match the new state.
     * @param nextDarkMode The next status of dark mode. True if the editor should be in dark mode, false if not.
     */
    public setDarkModeState(nextDarkMode?: boolean) {
        if (this.isDarkMode() == nextDarkMode) {
            return;
        }

        const currentContent = this.getContent(GetContentMode.CleanHTML);

        this.triggerContentChangedEvent(
            nextDarkMode ? ChangeSource.SwitchToDarkMode : ChangeSource.SwitchToLightMode
        );
        this.setContent(currentContent);
    }

    /**
     * Check if the editor is in dark mode
     * @returns True if the editor is in dark mode, otherwise false
     */
    public isDarkMode(): boolean {
        return this.core.lifecycle.isDarkMode;
    }

    /**
     * Make the editor in "Shadow Edit" mode.
     * In Shadow Edit mode, all format change will finally be ignored.
     * This can be used for building a live preview feature for format button, to allow user
     * see format result without really apply it.
     * This function can be called repeatly. If editor is already in shadow edit mode, we can still
     * use this function to do more shadow edit operation.
     */
    public startShadowEdit() {
        this.core.api.switchShadowEdit(this.core, true /*isOn*/);
    }

    /**
     * Leave "Shadow Edit" mode, all changes made during shadow edit will be discarded
     */
    public stopShadowEdit() {
        this.core.api.switchShadowEdit(this.core, false /*isOn*/);
    }

    /**
     * Check if editor is in Shadow Edit mode
     */
    public isInShadowEdit() {
        return !!this.core.lifecycle.shadowEditFragment;
    }

    /**
     * Check if the given experimental feature is enabled
     * @param feature The feature to check
     */
    public isFeatureEnabled(feature: ExperimentalFeatures): boolean {
        return this.core.lifecycle.experimentalFeatures.indexOf(feature) >= 0;
    }

    //#endregion
}
