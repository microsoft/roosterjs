import EditorCore from './EditorCore';
import EditorOptions from './EditorOptions';
import formatWithUndo from '../coreAPI/formatWithUndo';
import attachDomEvent from '../coreAPI/attachDomEvent';
import browserData from '../utils/BrowserData';
import focus from '../coreAPI/focus';
import getContentTraverser from '../coreAPI/getContentTraverser';
import getLiveRange from '../coreAPI/getLiveRange';
import hasFocus from '../coreAPI/hasFocus';
import insertNode from '../coreAPI/insertNode';
import select from '../coreAPI/select';
import triggerEvent from '../coreAPI/triggerEvent';
import {
    ChangeSource,
    ContentPosition,
    ContentScope,
    DefaultFormat,
    ExtractContentEvent,
    InsertOption,
    NodeType,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';
import {
    ContentTraverser,
    EditorSelection,
    NodeBlockElement,
    InlineElement,
    Position,
    PositionType,
    SelectionRange,
    applyFormat,
    contains,
    fromHtml,
    getFirstBlockElement,
    getInlineElementAtNode,
    getTagOfNode,
    isNodeEmpty,
    wrapAll,
} from 'roosterjs-editor-dom';

const IS_IE_OR_EDGE = browserData.isIE || browserData.isEdge;

export default class Editor {
    private omitContentEditable: boolean;
    private disableRestoreSelectionOnFocus: boolean;
    private inIME: boolean;
    private core: EditorCore;
    private eventDisposers: (() => void)[];
    private defaultRange: Range;

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
        this.core = EditorCore.create(contentDiv, options);
        this.disableRestoreSelectionOnFocus = options.disableRestoreSelectionOnFocus;
        this.omitContentEditable = options.omitContentEditableAttributeChanges;
        this.defaultRange = this.createDefaultRange();

        // 3. Initialize plugins
        this.core.plugins.forEach(plugin => plugin.initialize(this));

        // 4. Ensure initial content and its format
        this.ensureInitialContent(options.initialContent);

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
            this.core.document.execCommand('enableObjectResizing', false, false);
            this.core.document.execCommand('enableInlineTableEditing', false, false);
        } catch (e) {}
    }

    /**
     * Dispose this editor, dispose all plugins and custom data
     */
    public dispose(): void {
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
        return node ? insertNode(this.core, node, option) : false;
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
     * Get InlineElement at given node
     * @param node The node to create InlineElement
     * @requires The InlineElement result
     */
    public getInlineElementAtNode(node: Node): InlineElement {
        return getInlineElementAtNode(this.core.contentDiv, node, this.core.inlineElementFactory);
    }

    /**
     * Check if the node falls in the editor content
     * @param node The node to check
     * @returns True if the given node is in editor content, otherwise false
     */
    public contains(node: Node): boolean {
        return contains(this.core.contentDiv, node);
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
     */
    public setContent(content: string) {
        this.core.contentDiv.innerHTML = content || '';
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
     */
    public insertContent(content: string, option?: InsertOption) {
        if (content) {
            let allNodes = fromHtml(content, this.core.document);
            // If it is to insert on new line, and there are more than one node in the collection, wrap all nodes with
            // a parent DIV before calling insertNode on each top level sub node. Otherwise, every sub node may get wrapped
            // separately to show up on its own line
            if (option && option.insertOnNewLine && allNodes.length > 0) {
                allNodes = [wrapAll(allNodes)];
            }
            for (let i = 0; i < allNodes.length; i++) {
                this.insertNode(allNodes[i], option);
            }
        }
    }

    /**
     * DOM query nodes in editor
     * @param selector Selector string to query
     * @returns Node list of the query result
     */
    public queryNodes(selector: string): Node[] {
        let nodes = this.core.contentDiv.querySelectorAll(selector);
        return <Node[]>Array.apply(null, nodes);
    }

    //#endregion

    //#region Focus and Selection

    public getSelectionRange(): SelectionRange {
        return new SelectionRange(
            getLiveRange(this.core) || this.core.cachedRange || this.defaultRange
        );
    }

    /**
     * Check if focus is in editor now
     * @returns true if focus is in editor, otherwise false
     */
    public hasFocus(): boolean {
        return hasFocus(this.core);
    }

    /**
     * Focus to this editor, the selection was restored to where it was before, no unexpected scroll.
     */
    public focus() {
        focus(this.core);
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
        return select(this.core, arg1, arg2, arg3, arg4);
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
        return attachDomEvent(this.core, eventName, null /*pluginEventType*/, handler);
    }

    /**
     * Trigger an event to be dispatched to all plugins
     * @param pluginEvent The event object to trigger
     * @param broadcast indicates if the event needs to be dispatched to all plugins
     * True means to all, false means to allow exclusive handling from one plugin unless no one wants that
     */
    public triggerEvent(pluginEvent: PluginEvent, broadcast: boolean = true) {
        triggerEvent(this.core, pluginEvent, broadcast);
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
        formatWithUndo(this.core, callback, preserveSelection, skipAddingUndoAfterFormat);
        if (changeSource) {
            this.triggerContentChangedEvent(changeSource, dataCallback ? dataCallback() : null);
        }
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
     * Get a content traverser that can be used to travse content within editor
     * @param scope Content scope type. There are 3 kinds of scoper:
     * 1) SelectionBlockScoper is a block based scoper that restrict traversing within the block where the selection is
     *    it allows traversing from start, end or selection start position
     *    this is commonly used to parse content from cursor as user type up to the begin or end of block
     * 2) SelectionScoper restricts traversing within the selection. It is commonly used for applying style to selection
     * 3) BodyScoper will traverse the entire editor body from the beginning (ignoring the passed in position parameter)
     * @param position Start position of the traverser
     * @returns A content traverser to help travse among InlineElemnt/BlockElement within scope
     */
    public getContentTraverser(
        scope: ContentScope,
        position: ContentPosition = ContentPosition.SelectionStart
    ): ContentTraverser {
        return getContentTraverser(this.core, scope, position);
    }

    //#endregion

    //#region Private functions
    private createEventHandlers() {
        this.eventDisposers = [
            attachDomEvent(this.core, 'keypress', PluginEventType.KeyPress, this.onKeyPress),
            attachDomEvent(this.core, 'keydown', PluginEventType.KeyDown),
            attachDomEvent(this.core, 'keyup', PluginEventType.KeyUp),
            attachDomEvent(this.core, 'mousedown', PluginEventType.MouseDown),
            attachDomEvent(this.core, 'mouseup', PluginEventType.MouseUp),
            attachDomEvent(this.core, 'compositionstart', null, () => (this.inIME = true)),
            attachDomEvent(
                this.core,
                'compositionend',
                PluginEventType.CompositionEnd,
                () => (this.inIME = false)
            ),
            attachDomEvent(this.core, 'focus', null, () => {
                // Restore the last saved selection first
                if (this.core.cachedRange && !this.disableRestoreSelectionOnFocus) {
                    this.select(this.core.cachedRange);
                }
                this.core.cachedRange = null;
            }),
            attachDomEvent(this.core, IS_IE_OR_EDGE ? 'beforedeactivate' : 'blur', null, () => {
                this.core.cachedRange = getLiveRange(this.core);
            }),
        ];
    }

    // Check if user is typing right under the content div
    // When typing goes directly under content div, many things can go wrong
    // We fix it by wrapping it with a div and reposition cursor within the div
    // TODO: we only fix the case when selection is collapsed
    // When selection is not collapsed, i.e. users press ctrl+A, and then type
    // We don't have a good way to fix that for the moment
    private onKeyPress = () => {
        let range = this.getSelectionRange();
        let focusNode: Node;
        if (
            range.collapsed &&
            (focusNode = range.start.node) &&
            (focusNode == this.core.contentDiv ||
                (focusNode.nodeType == NodeType.Text &&
                    focusNode.parentNode == this.core.contentDiv))
        ) {
            let editorSelection = new EditorSelection(
                this.core.contentDiv,
                range,
                this.core.inlineElementFactory
            );
            let blockElement = editorSelection.startBlockElement;
            if (!blockElement) {
                // Only reason we don't get the selection block is that we have an empty content div
                // which can happen when users removes everything (i.e. select all and DEL, or backspace from very end to begin)
                // The fix is to add a DIV wrapping, apply default format and move cursor over
                let nodes = fromHtml('<div><br></div>', this.core.document);
                let element = this.core.contentDiv.appendChild(nodes[0]) as HTMLElement;
                applyFormat(element, this.core.defaultFormat);
                // element points to a wrapping node we added "<div><br></div>". We should move the selection left to <br>
                this.select(element.firstChild, 0);
            } else if (
                blockElement.getStartNode().parentNode == blockElement.getEndNode().parentNode
            ) {
                // Only fix the balanced start-end block where start and end node is under same parent
                // The focus node could be pointing to the content div, normalize it to have it point to a child first
                let focusOffset = range.start.offset;
                let element = wrapAll(blockElement.getContentNodes()) as HTMLElement;
                if (getTagOfNode(blockElement.getStartNode()) == 'BR') {
                    // if the block is just BR, apply default format
                    // Otherwise, leave it as it is as we don't want to change the style for existing data
                    applyFormat(element, this.core.defaultFormat);
                }
                // Last restore the selection using the normalized editor point
                this.select(new Position(focusNode, focusOffset).normalize());
            }
        }
    };

    private ensureInitialContent(initialContent: string) {
        if (initialContent) {
            this.setContent(initialContent);
        } else if (this.core.contentDiv.innerHTML != '') {
            this.triggerContentChangedEvent();
        }

        let firstBlock = getFirstBlockElement(this.core.contentDiv, this.core.inlineElementFactory);
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

    private createDefaultRange() {
        let range = this.core.document.createRange();
        range.setStart(this.core.contentDiv, 0);
        range.collapse(true);
        return range;
    }
    //#endregion
}
