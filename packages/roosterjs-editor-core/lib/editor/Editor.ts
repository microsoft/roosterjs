import EditorCore from './EditorCore';
import EditorOptions from './EditorOptions';
import createEditorCore from './createEditorCore';
import {
    ChangeSource,
    ContentPosition,
    ContentScope,
    DefaultFormat,
    DocumentCommand,
    ExtractContentEvent,
    InlineElement,
    InsertOption,
    PluginEvent,
    PluginEventType,
    PositionType,
    QueryScope,
    Rect,
} from 'roosterjs-editor-types';
import {
    Browser,
    PositionContentSearcher,
    ContentTraverser,
    NodeBlockElement,
    Position,
    applyFormat,
    contains,
    fromHtml,
    getBlockElementAtNode,
    getElementOrParentElement,
    getFirstBlockElement,
    getInlineElementAtNode,
    getTagOfNode,
    isNodeEmpty,
    markSelection,
    queryElements,
    removeMarker,
    wrap,
} from 'roosterjs-editor-dom';

const KEY_BACKSPACE = 8;

/**
 * RoosterJs core editor class
 */
export default class Editor {
    private inIME: boolean;
    private core: EditorCore;
    private eventDisposers: (() => void)[];

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
        this.ensureInitialContent(options.initialContent || contentDiv.innerHTML || '');

        // 5. Initialize undo service
        // This need to be after step 4 so that undo service can pickup initial content
        this.core.undo.initialize(this);
        this.core.plugins.push(this.core.undo);

        // 6. Create event handler to bind DOM events
        this.createEventHandlers();

        // 7. Make the container editable and set its selection styles
        if (!this.core.omitContentEditable) {
            contentDiv.setAttribute('contenteditable', 'true');
            let styles = contentDiv.style;
            styles.userSelect = styles.msUserSelect = styles.webkitUserSelect = 'text';
        }

        // 8. Disable these operations for firefox since its behavior is usually wrong
        // Catch any possible exception since this should not block the initialization of editor
        try {
            this.core.document.execCommand(DocumentCommand.EnableObjectResizing, false, false);
            this.core.document.execCommand(DocumentCommand.EnableInlineTableEditing, false, false);
        } catch (e) {}

        // 9. Finally, let plugins know that we are ready
        this.triggerEvent(
            {
                eventType: PluginEventType.EditorReady,
            },
            true /*broadcast*/
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

        if (!this.core.omitContentEditable) {
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
     * @requires The InlineElement result
     */
    public getInlineElementAtNode(node: Node): InlineElement {
        return getInlineElementAtNode(this.core.contentDiv, node);
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
        let content = '';
        if (includeSelectionMarker) {
            this.runWithSelectionMarker(() => {
                content = this.core.contentDiv.innerHTML;
            }, false /*useInlineMarker*/);
        } else {
            content = this.core.contentDiv.innerHTML;
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
     */
    public setContent(content: string, triggerContentChangedEvent: boolean = true) {
        if (this.core.contentDiv.innerHTML != content) {
            this.core.contentDiv.innerHTML = content || '';

            this.removeSelectionMarker(true /*applySelection*/);

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

    /**
     * @deprecated Use queryElements instead
     */
    public queryContent(selector: string): NodeListOf<Element> {
        return this.core.contentDiv.querySelectorAll(selector);
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
     * @deprecated
     * Get current selection
     * @return current selection object
     */
    public getSelection(): Selection {
        return this.core.document.defaultView.getSelection();
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
    public select(position: Position): boolean;

    /**
     * Select content by a start and end position
     * @param start The start position to select
     * @param end The end position to select, if this is the same with start, the selection will be collapsed
     * @returns True if content is selected, otherwise false
     */
    public select(start: Position, end: Position): boolean;

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
        return this.core.api.select(this.core, arg1, arg2, arg3, arg4);
    }

    /**
     * Insert selection marker element into content, so that after doing some modification,
     * we can still restore the selection as long as the selection marker is still there
     * @returns True if selection markers are added, otherwise false.
     */
    public runWithSelectionMarker(callback: () => any, useInlineMarker?: boolean) {
        let selectionMarked = markSelection(
            this.core.contentDiv,
            this.getSelectionRange(),
            useInlineMarker
        );
        try {
            if (callback) {
                callback();
            }
        } finally {
            if (selectionMarked) {
                // In safari the selection will be lost after inserting markers, so need to restore it
                // For other browsers we just need to delete markers here
                this.removeSelectionMarker(Browser.isSafari || Browser.isChrome /*applySelection*/);
            }
        }
    }

    /**
     * @deprecated Use select() instead
     * Update selection in editor
     * @param selectionRange The selection range to update to
     * @returns true if selection range is updated. Otherwise false.
     */
    public updateSelection(selectionRange: Range): boolean {
        return this.select(selectionRange);
    }

    /**
     * @deprecated
     * Save the current selection in editor so that when focus again, the selection can be restored
     */
    public saveSelectionRange() {
        this.core.cachedSelectionRange = this.core.api.getSelectionRange(
            this.core,
            false /*tryGetFromCache*/
        );
    }

    /**
     * Get a rect representing the location of the cursor.
     * @returns a Rect object representing cursor location
     */
    public getCursorRect(): Rect {
        let selection = this.core.document.defaultView.getSelection();

        if (!selection || !selection.focusNode) {
            return null;
        }

        let position = new Position(selection.focusNode, selection.focusOffset);
        return position.getRect();
    }

    /**
     * @deprecated This function will be moved to roosterjs-editor-api in next major release
     * Apply inline style to current selection
     * @param callback The callback function to apply style
     */
    public applyInlineStyle(callback: (element: HTMLElement) => any) {
        this.focus();
        let range = this.getSelectionRange();
        let collapsed = range && range.collapsed;

        if (collapsed) {
            this.addUndoSnapshot();

            // Create a new span to hold the style.
            // Some content is needed to position selection into the span
            // for here, we inject ZWS - zero width space
            let element = fromHtml('<SPAN>\u200B</SPAN>', this.getDocument())[0] as HTMLElement;
            callback(element);
            this.insertNode(element);

            // reset selection to be after the ZWS (rather than selecting it)
            // This is needed so that the cursor still looks blinking inside editor
            // This also means an extra ZWS will be in editor
            this.select(element, PositionType.End);
        } else {
            this.addUndoSnapshot(() => {
                // This is start and end node that get the style. The start and end needs to be recorded so that selection
                // can be re-applied post-applying style
                let firstNode: Node;
                let lastNode: Node;
                let contentTraverser = this.getSelectionTraverser();

                // Just loop through all inline elements in the selection and apply style for each
                let inlineElement = contentTraverser.currentInlineElement;
                while (inlineElement) {
                    // Need to obtain next inline first. Applying styles changes DOM which may mess up with the navigation
                    let nextInline = contentTraverser.getNextInlineElement();
                    inlineElement.applyStyle(element => {
                        callback(element as HTMLElement);
                        firstNode = firstNode || element;
                        lastNode = element;
                    });

                    inlineElement = nextInline;
                }

                // When selectionStartNode/EndNode is set, it means there is DOM change. Re-create the selection
                if (firstNode && lastNode) {
                    this.select(firstNode, PositionType.Before, lastNode, PositionType.After);
                }
            }, ChangeSource.Format);
        }
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
    public addDomEventHandler(eventName: string, handler: (event: UIEvent) => void): () => void {
        return this.core.api.attachDomEvent(
            this.core,
            eventName,
            null /*pluginEventType*/,
            handler
        );
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
        this.onContentChange();
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
        this.core.undo.undo();
    }

    /**
     * Redo next edit operation
     */
    public redo() {
        this.focus();
        this.core.undo.redo();
    }

    /**
     * @deprecated Use editWithUndo() instead
     */
    public runWithoutAddingUndoSnapshot(callback: () => void) {
        try {
            this.core.suspendUndo = true;
            callback();
        } finally {
            this.core.suspendUndo = false;
        }
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
        callback?: (start: Position, end: Position) => any,
        changeSource?: ChangeSource | string
    ) {
        this.core.api.editWithUndo(
            this.core,
            callback,
            changeSource,
            true /*addUndoSnapshotBeforeAction*/
        );
    }

    /**
     * Perform an auto complete action in the callback, save a snapsnot of content before the action,
     * and trigger ContentChangedEvent with the change source if specified
     * @param callback The auto complete callback, return value will be used as data field of ContentChangedEvent
     * @param changeSource Chagne source of ContentChangedEvent. If not passed, no ContentChangedEvent will be  triggered
     */
    public performAutoComplete(
        callback: (start: Position, end: Position) => any,
        changeSource?: ChangeSource
    ) {
        let snapshot = this.getContent(
            false /*triggerContentChangedEvent*/,
            true /*markSelection*/
        );
        this.core.api.editWithUndo(
            this.core,
            callback,
            changeSource,
            false /*addUndoSnapshotBeforeAction*/
        );
        this.core.snapshotBeforeAutoComplete = snapshot;
    }

    /**
     * Whether there is an available undo snapshot
     */
    public canUndo(): boolean {
        return this.core.undo.canUndo();
    }

    /**
     * Whether there is an available redo snapshot
     */
    public canRedo(): boolean {
        return this.core.undo.canRedo();
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
        return (this.core.customData[key] = this.core.customData[key] || {
            value: getter(),
            disposer: disposer,
        }).value;
    }

    /**
     * Check if editor is in IME input sequence
     * @returns True if editor is in IME input sequence, otherwise false
     */
    public isInIME(): boolean {
        return this.inIME;
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
     */
    public getBodyTraverser(): ContentTraverser {
        return ContentTraverser.createBodyTraverser(this.core.contentDiv);
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
     * @deprecated Use getBodyTraverser, getSelectionTraverser, getBlockTraverser instead
     */
    public getContentTraverser(
        scope: ContentScope,
        position: ContentPosition = ContentPosition.SelectionStart
    ): ContentTraverser {
        switch (scope) {
            case ContentScope.Block:
                return this.getBlockTraverser();
            case ContentScope.Selection:
                return this.getSelectionTraverser();
            case ContentScope.Body:
                return this.getBodyTraverser();
        }

        return null;
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

    //#endregion

    //#region Private functions
    private createEventHandlers() {
        this.eventDisposers = [
            this.core.api.attachDomEvent(this.core, 'input', null, this.stopPropagation),
            this.core.api.attachDomEvent(
                this.core,
                'keypress',
                PluginEventType.KeyPress,
                this.onKeyPress
            ),
            this.core.api.attachDomEvent(
                this.core,
                'keydown',
                PluginEventType.KeyDown,
                this.onKeyDown
            ),
            this.core.api.attachDomEvent(
                this.core,
                'keyup',
                PluginEventType.KeyUp,
                this.stopPropagation
            ),
            this.core.api.attachDomEvent(
                this.core,
                'mousedown',
                PluginEventType.MouseDown,
                this.onContentChange
            ),
            this.core.api.attachDomEvent(this.core, 'mouseup', PluginEventType.MouseUp),
            this.core.api.attachDomEvent(
                this.core,
                'compositionstart',
                null,
                () => (this.inIME = true)
            ),
            this.core.api.attachDomEvent(
                this.core,
                'compositionend',
                PluginEventType.CompositionEnd,
                () => (this.inIME = false)
            ),
            this.core.api.attachDomEvent(this.core, 'focus', null, () => {
                // Restore the last saved selection first
                if (this.core.cachedSelectionRange && !this.core.disableRestoreSelectionOnFocus) {
                    this.select(this.core.cachedSelectionRange);
                }
                this.core.cachedSelectionRange = null;
            }),
            this.core.api.attachDomEvent(
                this.core,
                Browser.isIEOrEdge ? 'beforedeactivate' : 'blur',
                null,
                () => {
                    this.saveSelectionRange();
                }
            ),
        ];
    }

    private stopPropagation = (event: KeyboardEvent) => {
        if (
            !event.ctrlKey &&
            !event.altKey &&
            !event.metaKey &&
            (event.which == 32 || // Space
            (event.which >= 65 && event.which <= 90) || // A-Z
            (event.which >= 48 && event.which <= 57) || // 0-9
            (event.which >= 96 && event.which <= 105) || // 0-9 on num pad
            (event.which >= 186 && event.which <= 192) || // ';', '=', ',', '-', '.', '/', '`'
                (event.which >= 219 && event.which <= 222))
        ) {
            // '[', '\', ']', '''
            event.stopPropagation();
        }
    };

    private onContentChange = (event?: KeyboardEvent) => {
        if (this.core.snapshotBeforeAutoComplete !== null) {
            if (event && event.which == KEY_BACKSPACE) {
                event.preventDefault();
                this.setContent(
                    this.core.snapshotBeforeAutoComplete,
                    false /*triggerContentChangedEvent*/
                );
            }
            this.core.snapshotBeforeAutoComplete = null;
        }
    };

    private onKeyDown = (event: KeyboardEvent) => {
        this.stopPropagation(event);
        this.onContentChange(event);
    };

    // Check if user is typing right under the content div
    // When typing goes directly under content div, many things can go wrong
    // We fix it by wrapping it with a div and reposition cursor within the div
    // TODO: we only fix the case when selection is collapsed
    // When selection is not collapsed, i.e. users press ctrl+A, and then type
    // We don't have a good way to fix that for the moment
    private onKeyPress = (event: KeyboardEvent) => {
        let range = this.getSelectionRange();
        if (
            range &&
            range.collapsed &&
            getElementOrParentElement(range.startContainer) == this.core.contentDiv
        ) {
            let position = Position.getStart(range).normalize();
            let blockElement = getBlockElementAtNode(this.core.contentDiv, position.node);

            if (!blockElement) {
                // Only reason we don't get the selection block is that we have an empty content div
                // which can happen when users removes everything (i.e. select all and DEL, or backspace from very end to begin)
                // The fix is to add a DIV wrapping, apply default format and move cursor over
                let node = fromHtml('<div><br></div>', this.core.document)[0];
                let element = this.core.contentDiv.appendChild(node) as HTMLElement;
                applyFormat(element, this.core.defaultFormat);
                // element points to a wrapping node we added "<div><br></div>". We should move the selection left to <br>
                this.select(element.firstChild, PositionType.Begin);
            } else if (
                blockElement.getStartNode().parentNode == blockElement.getEndNode().parentNode
            ) {
                // Only fix the balanced start-end block where start and end node is under same parent
                // The focus node could be pointing to the content div, normalize it to have it point to a child first
                let element = wrap(blockElement.getContentNodes());
                if (getTagOfNode(blockElement.getStartNode()) == 'BR') {
                    // if the block is just BR, apply default format
                    // Otherwise, leave it as it is as we don't want to change the style for existing data
                    applyFormat(element, this.core.defaultFormat);
                }
                // Last restore the selection using the normalized editor point
                this.select(position);
            }
        }
        this.stopPropagation(event);
    };

    private ensureInitialContent(initialContent: string) {
        this.setContent(initialContent);

        let firstBlock = getFirstBlockElement(this.core.contentDiv);
        let defaultFormatBlockElement: HTMLElement;

        if (!firstBlock) {
            // No first block, let's create one
            let nodes = fromHtml('<div><br></div>', this.core.document);
            defaultFormatBlockElement = this.core.contentDiv.appendChild(nodes[0]) as HTMLElement;
        } else if (firstBlock instanceof NodeBlockElement) {
            // There is a first block and it is a Node (P, DIV etc.) block
            // Check if it is empty block and apply default format if so
            // TODO: what about first block contains just an image? testing getTextContent won't tell that
            // Probably it is no harm since apply default format on an image block won't change anything for the image
            if (firstBlock.getTextContent() == '') {
                defaultFormatBlockElement = firstBlock.getStartNode() as HTMLElement;
            }
        }

        if (defaultFormatBlockElement) {
            applyFormat(defaultFormatBlockElement, this.core.defaultFormat);
        }
    }

    private removeSelectionMarker(applySelection: boolean) {
        let range = removeMarker(this.core.contentDiv, applySelection);
        if (range) {
            this.select(range);
        }
    }

    //#endregion
}
