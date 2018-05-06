import EditorCore from './EditorCore';
import EditorOptions from './EditorOptions';
import createEditorCore from './createEditorCore';
import {
    ChangeSource,
    ContentPosition,
    DefaultFormat,
    ExtractContentEvent,
    InsertOption,
    PluginEvent,
    PluginEventType,
    PositionType,
    Rect,
} from 'roosterjs-editor-types';
import {
    BlockElement,
    Browser,
    ContentTraverser,
    NodeBlockElement,
    TextBeforePositionTraverser,
    Position,
    SelectionRange,
    applyFormat,
    contains,
    fromHtml,
    getBlockElementAtNode,
    getElementOrParentElement,
    getFirstLeafNode,
    getTagOfNode,
    isNodeEmpty,
    wrap,
} from 'roosterjs-editor-dom';

const IS_IE_OR_EDGE = Browser.isIE || Browser.isEdge;

/**
 * RoosterJs core editor class
 */
export default class Editor {
    private omitContentEditable: boolean;
    private disableRestoreSelectionOnFocus: boolean;
    private inIME: boolean;
    private core: EditorCore;
    private eventDisposers: (() => void)[];
    private defaultRange: Range;

    //#region Editor Lifecycle

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
        this.disableRestoreSelectionOnFocus = options.disableRestoreSelectionOnFocus;
        this.omitContentEditable = options.omitContentEditableAttributeChanges;
        this.defaultRange = this.getDocument().createRange();
        this.defaultRange.setStart(this.core.contentDiv, 0);

        // 3. Initialize plugins
        this.core.plugins.forEach(plugin => {
            if (!plugin.name) {
                plugin.name = (<Object>plugin).constructor.name;
            }
            plugin.initialize(this);
        });

        // 4. Ensure initial content and its format
        this.setContent(options.initialContent || this.core.contentDiv.innerHTML);
        this.fixContentStructure(getFirstLeafNode(contentDiv));

        // 5. Initialize undo service
        this.core.undo.initialize(this);
        this.core.plugins.push(this.core.undo);

        // 6. Create event handler to bind DOM events
        this.createEventHandlers();

        // 7. Finally make the container editable and set its selection styles
        if (!this.omitContentEditable) {
            contentDiv.setAttribute('contenteditable', 'true');
            let styles = contentDiv.style;
            styles.userSelect = styles.msUserSelect = styles.webkitUserSelect = 'text';
        }

        // 8. Disable these operations for firefox since its behavior is usually wrong
        // Catch any possible exception since this should not block the initialization of editor
        try {
            let document = this.core.document;
            document.execCommand('enableObjectResizing', false, false);
            document.execCommand('enableInlineTableEditing', false, false);
        } catch (e) {}

        // 9. Start a timer loop if required
        if (options.idleEventTimeSpanInSecond > 0) {
            this.startIdleLoop(options.idleEventTimeSpanInSecond * 1000);
        }
    }

    /**
     * Dispose this editor, dispose all plugins and custom data
     */
    public dispose() {
        if (this.core.idleLoopHandle > 0) {
            let win = this.core.contentDiv.ownerDocument.defaultView || window;
            win.clearInterval(this.core.idleLoopHandle);
            this.core.idleLoopHandle = 0;
        }

        this.core.plugins.forEach(plugin => {
            plugin.dispose();
        });

        this.eventDisposers.forEach(disposer => disposer());
        this.eventDisposers = null;

        for (let key of Object.keys(this.core.customData)) {
            let data = this.core.customData[key];
            if (data && data.disposer) {
                data.disposer(data.value);
            }
            delete this.core.customData[key];
        }

        if (!this.omitContentEditable) {
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
        if (this.contains(node)) {
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
        if (toNode && this.contains(existingNode)) {
            existingNode.parentNode.replaceChild(toNode, existingNode);
            return true;
        }

        return false;
    }

    /**
     * Get BlockElement at given node
     * @param node The node to create InlineElement
     * @requires The BlockElement result
     */
    public getBlockElementAtNode(node: Node): BlockElement {
        return this.contains(node) ? getBlockElementAtNode(this.core.contentDiv, node) : null;
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

    /**
     * Check if the selection range falls in the editor content
     * @param range The range to check
     * @returns True if the given range is in editor content, otherwise false
     */
    public contains(range: SelectionRange): boolean;

    public contains(arg: Node | Range | SelectionRange): boolean {
        return contains(this.core.contentDiv, <Node>arg);
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
     * @returns HTML string representing current editor content
     */
    public getContent(triggerExtractContentEvent: boolean = true): string {
        let content = this.core.contentDiv.innerHTML;

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
     * @param callbackBeforeTriggerContentChangedEvent An optional callback function, will be called before ContentChangedEvent is triggered
     */
    public setContent(content: string, callbackBeforeTriggerContentChangedEvent?: () => void) {
        this.core.contentDiv.innerHTML = content || '';
        if (callbackBeforeTriggerContentChangedEvent) {
            callbackBeforeTriggerContentChangedEvent();
        }
        this.triggerContentChangedEvent();
    }

    /**
     * Insert HTML content into editor
     * @param HTML content to insert
     * @param option Insert options. Default value is:
     *  position: ContentPosition.SelectionStart
     *  updateCursor: true
     *  replaceSelection: true
     *  insertOnNewLine: false
     * @param sanitize True to do sanitizeHtml before insert, otherwise false
     */
    public insertContent(content: string, option?: InsertOption, sanitize?: boolean) {
        if (content) {
            let allNodes = fromHtml(content, this.getDocument(), sanitize);
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
     * Query HTML elements in editor using querySelectorAll() method
     * @param selector Selector string to query
     * @param forEachCallback An optional callback to be invoked on each node in query result
     * @returns HTML Element list of the query result
     */
    public queryElements<T extends HTMLElement = HTMLElement>(
        selector: string,
        forEachCallback?: (node: T) => void
    ): T[] {
        let nodes = [].slice.call(this.core.contentDiv.querySelectorAll(selector)) as T[];
        if (forEachCallback) {
            nodes.forEach(forEachCallback);
        }
        return nodes;
    }

    //#endregion

    //#region Focus and Selection

    /**
     * Get a SelectionRange object represents current selection in editor.
     * When editor has a live selection, this will return the selection.
     * When editor doesn't have a live selection, but it has a cached selection, this will return the cached selection.
     * Otherwise, return a selection of beginning of editor
     */
    public getSelectionRange(): SelectionRange {
        return new SelectionRange(
            this.core.api.getLiveRange(this.core) || this.core.cachedRange || this.defaultRange
        );
    }

    /**
     * Get a Rect object represents the bounding rect of current focus point in editor.
     * If the editor doesn't have a live focus point, returns null
     */
    public getCursorRect(): Rect {
        let position = this.core.api.getFocusPosition(this.core);
        return position ? position.getRect() : null;
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
     * Select content by SelectionRange
     * @param range The SelectionRange object which represents the content range to select
     * @returns True if content is selected, otherwise false
     */
    public select(range: SelectionRange): boolean;

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
        return this.core.api.attachDomEvent(this.core, eventName, null /*pluginEventType*/, handler);
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
     * Add undo snapshot, and execute a format callback function, then add another undo snapshot if
     * addsnapshotAfterFormat is set to true, finally trigger ContentChangedEvent with given change source.
     * If this function is called nested, undo snapshot will only be added in the outside one
     * @param callback The callback function to perform formatting
     * @param preserveSelection Set to true to try preserve the selection after format
     * @param addsnapshotAfterFormat Whether should add an undo snapshot after format callback is called
     * @param changeSource The change source to use when fire ContentChangedEvent. Default value is 'Format'
     * If pass null, the event will not be fired.
     * @param dataCallback A callback function to retrieve the data for ContentChangedEvent
     * @param skipAddingUndoAfterFormat Set to true to only add undo snapshot before format. Default value is false
     */
    public formatWithUndo(
        callback: () => void | Node,
        preserveSelection: boolean = false,
        changeSource: ChangeSource | string = ChangeSource.Format,
        dataCallback?: () => any,
        skipAddingUndoAfterFormat: boolean = false
    ) {
        this.core.api.formatWithUndo(
            this.core,
            callback,
            preserveSelection,
            changeSource,
            dataCallback,
            skipAddingUndoAfterFormat
        );
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
        let customData = this.core.customData;
        return (customData[key] = customData[key] || {
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
        return new ContentTraverser(this.core.contentDiv);
    }

    /**
     * Get a content traverser for current selection
     */
    public getSelectionTraverser(): ContentTraverser {
        return new ContentTraverser(this.core.contentDiv, this.getSelectionRange());
    }

    /**
     * Get a content traverser for current block element start from specified position
     * @param startFrom Start position of the traverser
     */
    public getBlockTraverser(
        startFrom: ContentPosition = ContentPosition.SelectionStart
    ): ContentTraverser {
        let position = this.core.api.getFocusPosition(this.core)
        return position ? new ContentTraverser(this.core.contentDiv, position, startFrom) : null;
    }

    /**
     * Get a text traverser to help get text before current focused position
     */
    public getTextBeforePositionTraverser(): TextBeforePositionTraverser {
        return new TextBeforePositionTraverser(this.getBlockTraverser());
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
            this.core.api.attachDomEvent(this.core, 'keypress', PluginEventType.KeyPress, this.onKeyPress),
            this.core.api.attachDomEvent(this.core, 'keydown', PluginEventType.KeyDown),
            this.core.api.attachDomEvent(this.core, 'keyup', PluginEventType.KeyUp),
            this.core.api.attachDomEvent(this.core, 'mousedown', PluginEventType.MouseDown),
            this.core.api.attachDomEvent(this.core, 'mouseup', PluginEventType.MouseUp),
            this.core.api.attachDomEvent(this.core, 'compositionstart', null, () => (this.inIME = true)),
            this.core.api.attachDomEvent(this.core, 'compositionend', PluginEventType.CompositionEnd, (event: KeyboardEvent) => {
                this.inIME = false;
                this.onKeyPress(event);
            }),
            this.core.api.attachDomEvent(this.core, 'focus', null, () => {
                // Restore the last saved selection first
                if (this.core.cachedRange && !this.disableRestoreSelectionOnFocus) {
                    this.select(this.core.cachedRange);
                }
                this.core.cachedRange = null;
            }),
            this.core.api.attachDomEvent(this.core, IS_IE_OR_EDGE ? 'beforedeactivate' : 'blur', null, () => {
                this.core.cachedRange = this.core.api.getLiveRange(this.core);
            }),
        ];
    }

    /**
     * Check if user is typing right under the content div
     * When typing goes directly under content div, many things can go wrong
     * We fix it by wrapping it with a div and reposition cursor within the div
     */
    private onKeyPress = (event: KeyboardEvent) => {
        let range = this.core.api.getLiveRange(this.core);
        if (
            range &&
            range.collapsed &&
            getElementOrParentElement(range.startContainer) == this.core.contentDiv &&
            !this.select(this.fixContentStructure(range.startContainer), 0)
        ) {
            this.select(range);
        }
        this.stopPropagation(event);
    };

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

    /**
     * Check if user will type right under the content div
     * When typing goes directly under content div, many things can go wrong
     * We fix it by wrapping it with a div and reposition cursor within the div
     */
    private fixContentStructure(node: Node): Node {
        let block = this.getBlockElementAtNode(node);
        let startNode = block ? block.getStartNode() : null;
        let formatElement: HTMLElement;
        let nodeToSelect: Node;

        if (!block) {
            // Only reason we can't get the selection block is that we have an empty content div
            // which can happen when nothing is set to initial content, or user removes everything
            // (i.e. select all and DEL, or backspace from very end to begin).
            // The fix is to add a DIV wrapping, apply default format and move cursor over
            formatElement = fromHtml('<div><br></div>', this.getDocument())[0] as HTMLElement;
            this.core.contentDiv.appendChild(formatElement);

            // element points to a wrapping node we added "<div><br></div>". We should move the selection left to <br>
            nodeToSelect = formatElement.firstChild;
        } else if (block instanceof NodeBlockElement) {
            // if the block is empty, apply default format
            // Otherwise, leave it as it is as we don't want to change the style for existing data
            formatElement = isNodeEmpty(startNode) ? (startNode as HTMLElement) : null;
        } else if (startNode.parentNode == block.getEndNode().parentNode) {
            // Only fix the balanced start-end block where start and end node is under same parent
            // The focus node could be pointing to the content div, normalize it to have it point to a child first
            formatElement = wrap(block.getContentNodes());
        }

        if (formatElement) {
            applyFormat(formatElement, this.core.defaultFormat);
        }

        return nodeToSelect;
    }

    /**
     * Start a loop to trigger Idle event
     * @param core EditorCore object
     * @param interval Interval of idle event
     */
    private startIdleLoop(interval: number) {
        let win = this.core.contentDiv.ownerDocument.defaultView || window;
        this.core.idleLoopHandle = win.setInterval(() => {
            if (this.core.ignoreIdleEvent) {
                this.core.ignoreIdleEvent = false;
            } else {
                this.triggerEvent(
                    {
                        eventType: PluginEventType.Idle,
                    },
                    true /*broadcast*/
                );
            }
        }, interval);
    }

    //#endregion
}
