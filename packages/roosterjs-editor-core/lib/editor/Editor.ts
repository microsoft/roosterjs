import createEditorCore from './createEditorCore';
import EditorCore from '../interfaces/EditorCore';
import EditorOptions from '../interfaces/EditorOptions';
import { GenericContentEditFeature } from '../interfaces/ContentEditFeature';
import {
    BlockElement,
    ChangeSource,
    ContentPosition,
    DefaultFormat,
    DocumentCommand,
    ExtractContentEvent,
    InlineElement,
    InsertOption,
    NodePosition,
    NodeType,
    PluginEvent,
    PluginEventType,
    PositionType,
    QueryScope,
    SelectionPath,
    Rect,
} from 'roosterjs-editor-types';
import {
    Browser,
    collapseNodes,
    contains,
    ContentTraverser,
    createRange,
    findClosestElementAncestor,
    fromHtml,
    getBlockElementAtNode,
    getInlineElementAtNode,
    getPositionRect,
    getRangeFromSelectionPath,
    getSelectionPath,
    getTagOfNode,
    isNodeEmpty,
    Position,
    PositionContentSearcher,
    queryElements,
    wrap,
} from 'roosterjs-editor-dom';

/**
 * RoosterJs core editor class
 */
export default class Editor {
    private core: EditorCore;
    private eventDisposers: (() => void)[];
    private contenteditableChanged: boolean;

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
        this.core = createEditorCore(contentDiv, options);

        // 3. Initialize plugins
        this.core.plugins.forEach(plugin => plugin.initialize(this));

        // 4. Ensure initial content and its format
        this.setContent(options.initialContent || contentDiv.innerHTML || '');

        // 5. Create event handler to bind DOM events
        this.eventDisposers = [
            this.core.api.attachDomEvent(this.core, 'keypress', PluginEventType.KeyPress),
            this.core.api.attachDomEvent(this.core, 'keydown', PluginEventType.KeyDown),
            this.core.api.attachDomEvent(this.core, 'keyup', PluginEventType.KeyUp),
            this.core.api.attachDomEvent(this.core, 'mousedown', PluginEventType.MouseDown),
            this.core.api.attachDomEvent(
                this.core,
                !Browser.isIE ? 'input' : 'textinput',
                PluginEventType.Input
            ),
        ];

        // 6. Add additional content edit features to the editor if specified
        if (options.additionalEditFeatures) {
            options.additionalEditFeatures.forEach(feature => this.addContentEditFeature(feature));
        }

        // 7. Make the container editable and set its selection styles
        if (!options.omitContentEditableAttributeChanges && !contentDiv.isContentEditable) {
            contentDiv.setAttribute('contenteditable', 'true');
            let styles = contentDiv.style;
            styles.userSelect = styles.msUserSelect = styles.webkitUserSelect = 'text';
            this.contenteditableChanged = true;
        }

        // 8. Do proper change for browsers to disable some browser-specified behaviors.
        // Catch any possible exception since this should not block the initialization of editor
        try {
            // Disable these object resizing for firefox since other browsers don't have these behaviors
            if (Browser.isFirefox) {
                this.core.document.execCommand(DocumentCommand.EnableObjectResizing, false, <
                    string
                >(<any>false));
                this.core.document.execCommand(DocumentCommand.EnableInlineTableEditing, false, <
                    string
                >(<any>false));
            } else if (Browser.isIE) {
                // Change the default paragraph separater to DIV. This is mainly for IE since its default setting is P
                this.core.document.execCommand(
                    DocumentCommand.DefaultParagraphSeparator,
                    false,
                    'div'
                );
            }
        } catch (e) {}

        // 9. Let plugins know that we are ready
        this.triggerEvent(
            {
                eventType: PluginEventType.EditorReady,
            },
            true /*broadcast*/
        );

        // 10. Before give editor to user, make sure there is at least one DIV element to accept typing
        this.core.corePlugins.typeInContainer.ensureTypeInElement(
            new Position(contentDiv, PositionType.Begin)
        );
    }

    /**
     * Dispose this editor, dispose all plugins and custom data
     */
    public dispose(): void {
        this.triggerEvent(
            {
                eventType: PluginEventType.BeforeDispose,
            },
            true /*broadcast*/
        );

        this.core.plugins.forEach(plugin => plugin.dispose());
        this.eventDisposers.forEach(disposer => disposer());
        this.eventDisposers = null;

        for (let key of Object.keys(this.core.customData)) {
            let data = this.core.customData[key];
            if (data && data.disposer) {
                data.disposer(data.value);
            }
            delete this.core.customData[key];
        }

        if (this.contenteditableChanged) {
            let styles = this.core.contentDiv.style;
            styles.userSelect = styles.msUserSelect = styles.webkitUserSelect = '';
            this.core.contentDiv.removeAttribute('contenteditable');
        }

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
     * @param new node to replace to
     * @returns true if node is replaced. Otherwise false
     */
    public replaceNode(existingNode: Node, toNode: Node): boolean {
        // Only replace the node when it falls within editor
        if (existingNode && toNode && this.contains(existingNode)) {
            existingNode.parentNode.replaceChild(toNode, existingNode);
            return true;
        }

        return false;
    }

    /**
     * Get InlineElement at given node
     * @param node The node to create InlineElement
     * @returns The InlineElement result
     */
    public getInlineElementAtNode(node: Node): InlineElement {
        return getInlineElementAtNode(this.core.contentDiv, node);
    }

    /**
     * Get BlockElement at given node
     * @param node The node to create InlineElement
     * @returns The BlockElement result
     */
    public getBlockElementAtNode(node: Node): BlockElement {
        return getBlockElementAtNode(this.core.contentDiv, node);
    }

    /**
     * Check if the node falls in the editor content
     * @param node The node to check
     * @returns True if the given node is in editor content, otherwise false
     */
    public contains(node: Node): boolean;

    /**
     * Check if the range falls in the editor content
     * @param range The range to check
     * @returns True if the given range is in editor content, otherwise false
     */
    public contains(range: Range): boolean;

    public contains(arg: Node | Range): boolean {
        return contains(this.core.contentDiv, <Node>arg);
    }

    /**
     * Query HTML elements in editor by tag name
     * @param tag Tag name of the element to query
     * @param forEachCallback An optional callback to be invoked on each element in query result
     * @returns HTML Element array of the query result
     */
    public queryElements<T extends keyof HTMLElementTagNameMap>(
        tag: T,
        forEachCallback?: (node: HTMLElementTagNameMap[T]) => any
    ): HTMLElementTagNameMap[T][];

    /**
     * Query HTML elements in editor by a selector string
     * @param selector Selector string to query
     * @param forEachCallback An optional callback to be invoked on each node in query result
     * @returns HTML Element array of the query result
     */
    public queryElements<T extends HTMLElement = HTMLElement>(
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
    public queryElements<T extends keyof HTMLElementTagNameMap>(
        tag: T,
        scope: QueryScope,
        forEachCallback?: (node: HTMLElementTagNameMap[T]) => any
    ): HTMLElementTagNameMap[T][];

    /**
     * Query HTML elements with the given scope by a selector string
     * @param selector Selector string to query
     * @param scope The scope of the query, default value is QueryScope.Body
     * @param forEachCallback An optional callback to be invoked on each element in query result
     * @returns HTML Element array of the query result
     */
    public queryElements<T extends HTMLElement = HTMLElement>(
        selector: string,
        scope: QueryScope,
        forEachCallback?: (node: T) => any
    ): T[];

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
     * @param triggerExtractContentEvent Whether trigger ExtractContent event to all plugins
     * before return. Use this parameter to remove any temporary content added by plugins.
     * @param includeSelectionMarker Set to true if need include selection marker inside the content.
     * When restore this content, editor will set the selection to the position marked by these markers
     * @returns HTML string representing current editor content
     */
    public getContent(
        triggerExtractContentEvent: boolean = true,
        includeSelectionMarker: boolean = false
    ): string {
        let contentDiv = this.core.contentDiv;
        let content = contentDiv.innerHTML;
        let selectionPath: SelectionPath;

        if (
            includeSelectionMarker &&
            (selectionPath = getSelectionPath(contentDiv, this.getSelectionRange()))
        ) {
            content += `<!--${JSON.stringify(selectionPath)}-->`;
        }

        if (triggerExtractContentEvent) {
            let extractContentEvent: ExtractContentEvent = {
                eventType: PluginEventType.ExtractContent,
                content: content,
            };
            this.triggerEvent(extractContentEvent, true /*broadcast*/);
            content = extractContentEvent.content;
        }

        return content;
    }

    /**
     * Get plain text content inside editor
     * @returns The text content inside editor
     */
    public getTextContent(): string {
        return this.core.contentDiv.innerText;
    }

    /**
     * Set HTML content to this editor. All existing content will be replaced. A ContentChanged event will be triggered
     * @param content HTML content to set in
     * @param triggerContentChangedEvent True to trigger a ContentChanged event. Default value is true
     */
    public setContent(content: string, triggerContentChangedEvent: boolean = true) {
        let contentDiv = this.core.contentDiv;
        if (contentDiv.innerHTML != content) {
            contentDiv.innerHTML = content || '';

            let pathComment = contentDiv.lastChild;

            if (pathComment && pathComment.nodeType == NodeType.Comment) {
                try {
                    let path = JSON.parse(pathComment.nodeValue) as SelectionPath;
                    this.deleteNode(pathComment);
                    let range = getRangeFromSelectionPath(contentDiv, path);
                    this.select(range);
                } catch {}
            }

            if (triggerContentChangedEvent) {
                this.triggerContentChangedEvent();
            }
        }
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
            let allNodes = fromHtml(content, this.core.document);
            // If it is to insert on new line, and there are more than one node in the collection, wrap all nodes with
            // a parent DIV before calling insertNode on each top level sub node. Otherwise, every sub node may get wrapped
            // separately to show up on its own line
            if (option && option.insertOnNewLine && allNodes.length > 0) {
                allNodes = [wrap(allNodes)];
            }
            for (let i = 0; i < allNodes.length; i++) {
                this.insertNode(allNodes[i], option);
            }
        }
    }

    //#endregion

    //#region Focus and Selection

    /**
     * Get current selection range from Editor.
     * It does a live pull on the selection, if nothing retrieved, return whatever we have in cache.
     * @returns current selection range, or null if editor never got focus before
     */
    public getSelectionRange(): Range {
        return this.core.api.getSelectionRange(this.core, true /*tryGetFromCache*/);
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

    /**
     * Select content by range
     * @param range The range to select
     * @returns True if content is selected, otherwise false
     */
    public select(range: Range): boolean;

    /**
     * Select content by Position and collapse to this position
     * @param position The position to select
     * @returns True if content is selected, otherwise false
     */
    public select(position: NodePosition): boolean;

    /**
     * Select content by a start and end position
     * @param start The start position to select
     * @param end The end position to select, if this is the same with start, the selection will be collapsed
     * @returns True if content is selected, otherwise false
     */
    public select(start: NodePosition, end: NodePosition): boolean;

    /**
     * Select content by node
     * @param node The node to select
     * @returns True if content is selected, otherwise false
     */
    public select(node: Node): boolean;

    /**
     * Select content by node and offset, and collapse to this position
     * @param node The node to select
     * @param offset The offset of node to select, can be a number or value of PositionType
     * @returns True if content is selected, otherwise false
     */
    public select(node: Node, offset: number | PositionType): boolean;

    /**
     * Select content by start and end nodes and offsets
     * @param startNode The node to select start from
     * @param startOffset The offset to select start from
     * @param endNode The node to select end to
     * @param endOffset The offset to select end to
     * @returns True if content is selected, otherwise false
     */
    public select(
        startNode: Node,
        startOffset: number | PositionType,
        endNode: Node,
        endOffset: number | PositionType
    ): boolean;

    public select(arg1: any, arg2?: any, arg3?: any, arg4?: any): boolean {
        let range = arg1 instanceof Range ? arg1 : createRange(arg1, arg2, arg3, arg4);
        return this.core.api.selectRange(this.core, range);
    }

    /**
     * Get current selection
     * @return current selection object
     */
    public getSelection(): Selection {
        return this.core.document.defaultView.getSelection();
    }

    /**
     * Save the current selection in editor so that when focus again, the selection can be restored
     */
    public saveSelectionRange() {
        this.core.cachedSelectionRange = this.core.api.getSelectionRange(
            this.core,
            false /*tryGetFromCache*/
        );
    }

    /**
     * Restore the saved selection range and clear it
     */
    public restoreSavedRange() {
        this.select(this.core.cachedSelectionRange);
        this.core.cachedSelectionRange = null;
    }

    /**
     * Get current focused position. Return null if editor doesn't have focus at this time.
     */
    public getFocusedPosition(): NodePosition {
        let sel = this.getSelection();
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
     * Get a rect representing the location of the cursor.
     * @returns a Rect object representing cursor location
     */
    public getCursorRect(): Rect {
        let position = this.getFocusedPosition();
        return position && getPositionRect(position);
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
     */
    public getElementAtCursor(selector?: string, startFrom?: Node): HTMLElement {
        if (!startFrom) {
            let position = this.getFocusedPosition();
            startFrom = position && position.node;
        }
        return startFrom && findClosestElementAncestor(startFrom, this.core.contentDiv, selector);
    }

    //#endregion

    //#region EVENT API

    /**
     * Add a custom DOM event handler to handle events not handled by roosterjs.
     * Caller need to take the responsibility to dispose the handler properly
     * @param eventName DOM event name to handle
     * @param handler Handler callback
     * @returns A dispose function. Call the function to dispose this event handler
     */
    public addDomEventHandler(eventName: string, handler: (event: UIEvent) => void): () => void;

    /**
     * Add a bunch of custom DOM event handler to handle events not handled by roosterjs.
     * Caller need to take the responsibility to dispose the handler properly
     * @param handlerMap A event name => event handler map
     * @returns A dispose function. Call the function to dispose all event handlers added by this function
     */
    public addDomEventHandler(handlerMap: {
        [eventName: string]: (event: UIEvent) => void;
    }): () => void;

    public addDomEventHandler(
        nameOrMap:
            | string
            | {
                  [eventName: string]: (event: UIEvent) => void;
              },
        handler?: (event: UIEvent) => void
    ): () => void {
        if (nameOrMap instanceof Object) {
            let handlers = Object.keys(nameOrMap)
                .map(
                    eventName =>
                        nameOrMap[eventName] &&
                        this.core.api.attachDomEvent(
                            this.core,
                            eventName,
                            null /*pluginEventType*/,
                            nameOrMap[eventName]
                        )
                )
                .filter(x => x);
            return () => handlers.forEach(handler => handler());
        } else {
            return this.core.api.attachDomEvent(
                this.core,
                nameOrMap,
                null /*pluginEventType*/,
                handler
            );
        }
    }

    /**
     * Trigger an event to be dispatched to all plugins
     * @param pluginEvent The event object to trigger
     * @param broadcast indicates if the event needs to be dispatched to all plugins
     * True means to all, false means to allow exclusive handling from one plugin unless no one wants that
     */
    public triggerEvent(pluginEvent: PluginEvent, broadcast: boolean = true) {
        this.core.api.triggerEvent(this.core, pluginEvent, broadcast);
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
        this.triggerEvent({
            eventType: PluginEventType.ContentChanged,
            source: source,
            data: data,
        } as PluginEvent);
    }

    //#endregion

    //#region Undo API

    /**
     * Undo last edit operation
     */
    public undo() {
        this.focus();
        this.core.corePlugins.undo.undo();
    }

    /**
     * Redo next edit operation
     */
    public redo() {
        this.focus();
        this.core.corePlugins.undo.redo();
    }

    /**
     * Add undo snapshot, and execute a format callback function, then add another undo snapshot, then trigger
     * ContentChangedEvent with given change source.
     * If this function is called nested, undo snapshot will only be added in the outside one
     * @param callback The callback function to perform formatting, returns a data object which will be used as
     * the data field in ContentChangedEvent if changeSource is not null.
     * @param changeSource The change source to use when fire ContentChangedEvent. When the value is not null,
     * a ContentChangedEvent will be fired with change source equal to this value
     */
    public addUndoSnapshot(
        callback?: (start: NodePosition, end: NodePosition, snapshotBeforeCallback: string) => any,
        changeSource?: ChangeSource | string
    ) {
        this.core.api.editWithUndo(this.core, callback, changeSource);
    }

    /**
     * Perform an auto complete action in the callback, save a snapsnot of content before the action,
     * and trigger ContentChangedEvent with the change source if specified
     * @param callback The auto complete callback, return value will be used as data field of ContentChangedEvent
     * @param changeSource Chagne source of ContentChangedEvent. If not passed, no ContentChangedEvent will be  triggered
     */
    public performAutoComplete(callback: () => any, changeSource?: ChangeSource | string) {
        this.core.corePlugins.edit.performAutoComplete(callback, changeSource);
    }

    /**
     * Whether there is an available undo snapshot
     */
    public canUndo(): boolean {
        return this.core.corePlugins.undo.canUndo();
    }

    /**
     * Whether there is an available redo snapshot
     */
    public canRedo(): boolean {
        return this.core.corePlugins.undo.canRedo();
    }

    //#endregion

    //#region Misc

    /**
     * Get document which contains this editor
     * @returns The HTML document which contains this editor
     */
    public getDocument(): Document {
        return this.core.document;
    }

    /**
     * Get custom data related to this editor
     * @param key Key of the custom data
     * @param getter Getter function. If custom data for the given key doesn't exist,
     * call this function to get one and store it.
     * @param disposer An optional disposer function to dispose this custom data when
     * dispose editor.
     */
    public getCustomData<T>(key: string, getter: () => T, disposer?: (value: T) => void): T {
        return this.core.api.getCustomData(this.core, key, getter, disposer);
    }

    /**
     * Check if editor is in IME input sequence
     * @returns True if editor is in IME input sequence, otherwise false
     */
    public isInIME(): boolean {
        return this.core.corePlugins.domEvent.isInIME();
    }

    /**
     * Get default format of this editor
     * @returns Default format object of this editor
     */
    public getDefaultFormat(): DefaultFormat {
        return this.core.defaultFormat;
    }

    /**
     * Get a content traverser for the whole editor
     * @param startNode The node to start from. If not passed, it will start from the beginning of the body
     */
    public getBodyTraverser(startNode?: Node): ContentTraverser {
        return ContentTraverser.createBodyTraverser(this.core.contentDiv, startNode);
    }

    /**
     * Get a content traverser for current selection
     */
    public getSelectionTraverser(): ContentTraverser {
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
    ): ContentTraverser {
        let range = this.getSelectionRange();
        return (
            range && ContentTraverser.createBlockTraverser(this.core.contentDiv, range, startFrom)
        );
    }

    /**
     * Get a text traverser of current selection
     */
    public getContentSearcherOfCursor(): PositionContentSearcher {
        let range = this.getSelectionRange();
        return range && new PositionContentSearcher(this.core.contentDiv, Position.getStart(range));
    }

    /**
     * Run a callback function asynchronously
     * @param callback The callback function to run
     */
    public runAsync(callback: () => void) {
        let win = this.core.contentDiv.ownerDocument.defaultView || window;
        win.requestAnimationFrame(() => {
            if (!this.isDisposed() && callback) {
                callback();
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
     * Add a Content Edit feature. This is mostly called from ContentEdit plugin
     * @param feature The feature to add
     */
    public addContentEditFeature(feature: GenericContentEditFeature<PluginEvent>) {
        this.core.corePlugins.edit.addFeature(feature);
    }

    //#endregion
}
