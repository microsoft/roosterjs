import EditorCore from './EditorCore';
import EditorOptions from './EditorOptions';
import Undo from '../undo/Undo';
import UndoService from './UndoService';
import applyInlineStyle from '../coreAPI/applyInlineStyle';
import calcDefaultFormat from '../utils/calcDefaultFormat';
import insertNode from '../coreAPI/insertNode';
import { DOMEventHandler, createEventHandlers, triggerEvent } from '../coreAPI/createEventHandlers';
import { ensureInitialContent } from '../coreAPI/ensureInitialContent';
import {
    hasFocus,
    getCursorRect,
    getSelection,
    getSelectionRange,
    focus,
    saveSelectionRange,
    updateSelection,
} from '../coreAPI/selection';
import {
    ContentPosition,
    ContentScope,
    DefaultFormat,
    ExtractContentEvent,
    InlineElement,
    InsertOption,
    PluginEvent,
    PluginEventType,
    Rect,
    TraversingScoper,
} from 'roosterjs-editor-types';
import {
    BodyScoper,
    ContentTraverser,
    InlineElementFactory,
    SelectionBlockScoper,
    SelectionScoper,
    contains,
    fromHtml,
    getInlineElementAtNode,
    getTagOfNode,
    isNodeEmpty,
    wrapAll,
} from 'roosterjs-editor-dom';

export default class Editor {
    private undoService: UndoService;
    private suspendAddingUndoSnapshot: boolean;
    private omitContentEditableAttributeChanges: boolean;
    private core: EditorCore;
    private eventHandlers: DOMEventHandler[];

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
        this.core = {
            contentDiv: contentDiv,
            document: contentDiv.ownerDocument,
            inlineElementFactory: new InlineElementFactory(),
            defaultFormat: calcDefaultFormat(contentDiv, options.defaultFormat),
            customData: {},
            cachedSelectionRange: null,
            plugins: (options.plugins || []).filter(plugin => !!plugin),
            isInIME: false,
            disableRestoreSelectionOnFocus: options.disableRestoreSelectionOnFocus,
        };
        this.omitContentEditableAttributeChanges = options.omitContentEditableAttributeChanges;

        // 3. Initialize plugins
        this.core.plugins.forEach(plugin => plugin.initialize(this));

        // 4. Ensure initial content and its format
        if (options.initialContent) {
            this.setContent(options.initialContent);
        } else if (contentDiv.innerHTML != '') {
            this.triggerContentChangedEvent();
        }
        ensureInitialContent(this.core);

        // 5. Initialize undo service
        // This need to be after step 4 so that undo service can pickup initial content
        this.undoService = options.undo || new Undo();
        this.undoService.initialize(this);
        this.core.plugins.push(this.undoService);

        // 6. Finally make the container editable, set its selection styles and bind events
        if (!this.omitContentEditableAttributeChanges) {
            contentDiv.setAttribute('contenteditable', 'true');
            let styles = contentDiv.style;
            styles.userSelect = styles.msUserSelect = styles.webkitUserSelect = 'text';
        }

        this.eventHandlers = createEventHandlers(this.core);
    }

    /**
     * Dispose this editor, dispose all plugins and custom data
     */
    public dispose(): void {
        this.core.plugins.forEach(plugin => {
            plugin.dispose();
        });

        this.eventHandlers.forEach(handler => handler.dispose());
        this.eventHandlers = null;

        for (let key of Object.keys(this.core.customData)) {
            let data = this.core.customData[key];
            if (data && data.disposer) {
                data.disposer(data.value);
            }
            delete this.core.customData[key];
        }

        if (!this.omitContentEditableAttributeChanges) {
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
     * DOM query content in editor
     * @param selector Selector string to query
     * @returns Node list of the query result
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
        return getSelectionRange(this.core, true /*tryGetFromCache*/);
    }

    /**
     * Get current selection
     * @return current selection object
     */
    public getSelection(): Selection {
        return getSelection(this.core);
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
     * Update selection in editor
     * @param selectionRange The selection range to update to
     * @returns true if selection range is updated. Otherwise false.
     */
    public updateSelection(selectionRange: Range): boolean {
        return updateSelection(this.core, selectionRange);
    }

    /**
     * Save the current selection in editor so that when focus again, the selection can be restored
     */
    public saveSelectionRange() {
        saveSelectionRange(this.core);
    }

    /**
     * Get a rect representing the location of the cursor.
     * @returns a Rect object representing cursor location
     */
    public getCursorRect(): Rect {
        return getCursorRect(this.core);
    }

    /**
     * Apply inline style to current selection
     * @param styler The callback function to apply style
     */
    public applyInlineStyle(styler: (element: HTMLElement) => void): void {
        this.focus();
        applyInlineStyle(this.core, this.getContentTraverser(ContentScope.Selection), styler);
    }

    //#endregion

    //#region EVENT API

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
    public triggerContentChangedEvent(source: string = 'SetContent', data?: any) {
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
        this.undoService.undo();
    }

    /**
     * Redo next edit operation
     */
    public redo() {
        this.focus();
        this.undoService.redo();
    }

    /**
     * Run a callback with undo suspended.
     * @param callback The callback to run
     */
    public runWithoutAddingUndoSnapshot(callback: () => void) {
        try {
            this.suspendAddingUndoSnapshot = true;
            callback();
        } finally {
            this.suspendAddingUndoSnapshot = false;
        }
    }

    /**
     * Add an undo snapshot if undo is not suspended
     */
    public addUndoSnapshot() {
        if (!this.suspendAddingUndoSnapshot) {
            this.undoService.addUndoSnapshot();
        }
    }

    /**
     * Whether there is an available undo snapshot
     */
    public canUndo(): boolean {
        return this.undoService.canUndo();
    }

    /**
     * Whether there is an available redo snapshot
     */
    public canRedo(): boolean {
        return this.undoService.canRedo();
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
    public getCustomData<T>(
        key: string,
        getter: () => T,
        disposer?: (value: T) => void
    ): T {
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
        return this.core.isInIME;
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
        let selectionRange = this.getSelectionRange();
        if (scope != ContentScope.Body && !selectionRange) {
            return null;
        }

        let contentTraverser: ContentTraverser;
        let scoper: TraversingScoper;
        switch (scope) {
            case ContentScope.Block:
                scoper = new SelectionBlockScoper(
                    this.core.contentDiv,
                    selectionRange,
                    position,
                    this.core.inlineElementFactory
                );
                break;
            case ContentScope.Selection:
                scoper = new SelectionScoper(
                    this.core.contentDiv,
                    selectionRange,
                    this.core.inlineElementFactory
                );
                break;
            case ContentScope.Body:
                scoper = new BodyScoper(this.core.contentDiv, this.core.inlineElementFactory);
                break;
        }

        if (scoper) {
            contentTraverser = new ContentTraverser(
                this.core.contentDiv,
                scoper,
                this.core.inlineElementFactory
            );
        }

        return contentTraverser;
    }

    //#endregion
}
