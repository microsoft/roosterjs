import EditorOptions from './EditorOptions';
import EditorPlugin from './EditorPlugin';
import UndoService from './UndoService';
import Undo from '../undo/Undo';
import applyInlineStyle from '../utils/applyInlineStyle';
import browserData from '../utils/BrowserData';
import getCursorRect from '../utils/getCursorRect';
import isVoidHtmlElement from '../utils/isVoidHtmlElement';
import {
    getSelection,
    isRangeInContainer,
    tryGetSelectionRange,
    updateSelectionToRange,
} from '../utils/selection';
import {
    ContentPosition,
    ContentScope,
    DefaultFormat,
    EditorPoint,
    ExtractContentEvent,
    InlineElement,
    NodeBoundary,
    NodeType,
    InsertOption,
    PluginDomEvent,
    PluginEvent,
    PluginEventType,
    Rect,
    TraversingScoper,
} from 'roosterjs-editor-types';
import {
    BodyScoper,
    ContentTraverser,
    EditorSelection,
    InlineElementFactory,
    NodeBlockElement,
    SelectionBlockScoper,
    SelectionScoper,
    applyFormat,
    contains,
    fromHtml,
    getInlineElementAtNode,
    getFirstLeafNode,
    getFirstBlockElement,
    getTagOfNode,
    isNodeEmpty,
    normalizeEditorPoint,
    wrapAll,
} from 'roosterjs-editor-dom';
import { insertNodeAtBegin, insertNodeAtEnd, insertNodeAtSelection } from '../utils/insertNode';

const HTML_EMPTY_DIV = '<div></div>';
const HTML_EMPTY_DIV_BLOCK = '<div><br></div>';

export default class Editor {
    private plugins: EditorPlugin[];
    private defaultFormat: DefaultFormat;
    private cachedSelectionRange: Range;
    private inlineElementFactory = new InlineElementFactory();
    private isBeforeDeactivateEventSupported: boolean;
    private undoService: UndoService;
    private isInIMESequence: boolean;
    private suspendAddingUndoSnapshot: boolean;

    /**
     * Creates an instance of Editor
     * @param contentDiv The DIV HTML element which will be the container element of editor
     * @param options An optional options object to customize the editor
     */
    constructor(private contentDiv: HTMLDivElement, options: EditorOptions = {}) {
        // 1. Make sure all parameters are valid
        if (getTagOfNode(contentDiv) != 'DIV') {
            throw new Error('contentDiv must be an HTML DIV element');
        }

        // 2. Store options values to local variables
        this.defaultFormat = options.defaultFormat;
        this.plugins = options.plugins || [];

        // 3. Initialize plugins
        this.initializePlugins();

        // 4. Ensure initial content and its format
        this.ensureInitialContent(options.initialContent);

        // 5. Initialize undo service
        // This need to be after step 4 so that undo service can pickup initial content
        this.undoService = options.undo || new Undo();
        this.undoService.initialize(this);
        this.plugins.push(this.undoService);

        // 6. Finally make the container editalbe, set its selection styles and bind events
        this.contentDiv.setAttribute('contenteditable', 'true');
        let styles = this.contentDiv.style;
        styles.userSelect = styles.msUserSelect = styles.webkitUserSelect = 'text';
        this.bindEvents();
    }

    public dispose(): void {
        this.disposePlugins();
        this.unbindEvents();
    }

    public getSelectionRange(): Range {
        // When we have the focus, we should try to do a live pull on the selection.
        // Otherwise, return whatever we have in cache.
        let selectionRange = this.hasFocus() ? tryGetSelectionRange(this.contentDiv) : null;
        return selectionRange || this.cachedSelectionRange;
    }

    public getDocument(): Document {
        return this.contentDiv.ownerDocument;
    }

    public getSelection(): Selection {
        return getSelection(this.getDocument());
    }

    public hasFocus(): boolean {
        let activeElement = this.getDocument().activeElement;
        return activeElement && (this.contentDiv == activeElement || this.contains(activeElement));
    }

    public focus(resetCursor: boolean = false): void {
        // This is more than just focus. What we want to achieve here are:
        // - focus is moved to editor
        // - the selection was restored to where it was before
        // - no unexpected scroll
        // The browser HTMLElement.focus() has some unexpected side effects which we cannot directly use, i.e.
        // - it always reset selection to begin
        // - can cause a reposition of cursor to re-align it in view port (unexpected scroll) when editor is not entirely in view port
        // We use the selection API to change selection to point within editor which has same effects of moving focus to editor without
        // those side effects of browser focus().
        if (resetCursor) {
            // If resetCursor is requested, just set selection to beginning of content
            this.setSelectionToBegin();
        } else if (!this.hasFocus() || !tryGetSelectionRange(this.contentDiv)) {
            // Focus (document.activeElement indicates) and selection are mostly in sync, but could be out of sync in some extreme cases.
            // i.e. if you programmatically change window selection to point to a non-focusable DOM element (i.e. tabindex=-1 etc.).
            // On Chrome/Firefox, it does not change document.activeElement. On Edge/IE, it change document.activeElement to be body
            // Although on Chrome/Firefox, document.activeElement points to editor, you cannot really type which we don't want (no cursor).
            // So here we always does a live selection pull on DOM and make it point in Editor. The pitfall is, the cursor could be reset
            // to very begin to of editor since we don't really have last saved selection (created on blur which does not fire in this case).
            // It should be better than the case you cannot type
            if (!this.restoreLastSavedSelection()) {
                this.setSelectionToBegin();
            }
        }

        // remember to clear cachedSelectionRange
        this.cachedSelectionRange = null;

        // This is more a fallback to ensure editor gets focus if it didn't manage to move focus to editor
        if (!this.hasFocus()) {
            // TODO: should we add a try-catch?
            this.contentDiv.focus();
        }
    }

    // Apply inline style to current selection
    public applyInlineStyle(styler: (element: HTMLElement) => void): void {
        this.focus();
        applyInlineStyle(this.contentDiv, this.getContentTraverser(ContentScope.Selection), styler);
    }

    public undo(): void {
        this.focus();
        this.undoService.undo();
    }

    public redo(): void {
        this.focus();
        this.undoService.redo();
    }

    public runWithoutAddingUndoSnapshot(callback: () => void) {
        try {
            this.suspendAddingUndoSnapshot = true;
            callback();
        } finally {
            this.suspendAddingUndoSnapshot = false;
        }
    }

    public addUndoSnapshot(): void {
        if (
            this.undoService &&
            this.undoService.addUndoSnapshot &&
            !this.suspendAddingUndoSnapshot
        ) {
            this.undoService.addUndoSnapshot();
        }
    }

    public canUndo(): boolean {
        return this.undoService
            ? this.undoService.canUndo ? this.undoService.canUndo() : true
            : false;
    }

    public canRedo(): boolean {
        return this.undoService
            ? this.undoService.canRedo ? this.undoService.canRedo() : true
            : false;
    }

    public getContent(triggerExtractContentEvent: boolean = true): string {
        let content = this.contentDiv.innerHTML;

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

    public setContent(content: string): void {
        this.contentDiv.innerHTML = content || '';
        this.ensureInitialContent();
        this.triggerEvent(
            {
                eventType: PluginEventType.ContentChanged,
                source: 'SetContent',
            } as PluginEvent,
            true /* broadcast */
        );
    }

    public isEmpty(trim?: boolean): boolean {
        return isNodeEmpty(this.contentDiv, trim);
    }

    // Insert content into editor
    public insertContent(content: string, option?: InsertOption): void {
        if (content) {
            let allNodes = fromHtml(content, this.getDocument());
            // If it is to insert on new line, and there are more than one node in the collection, wrap all nodes with
            // a parent DIV before calling insertNode on each top level sub node. Otherwise, every sub node may get wrapped
            // separately to show up on its own line
            if (option && option.insertOnNewLine && allNodes.length > 0) {
                allNodes = [wrapAll(allNodes, HTML_EMPTY_DIV)];
            }
            for (let i = 0; i < allNodes.length; i++) {
                this.insertNode(allNodes[i], option);
            }
        }
    }

    // Insert node into editor
    public insertNode(node: Node, option?: InsertOption): boolean {
        if (!node) {
            return false;
        }

        option = option || {
            position: ContentPosition.SelectionStart,
            updateCursor: true,
            replaceSelection: true,
            insertOnNewLine: false,
        };

        if (option.updateCursor) {
            this.focus();
        }

        switch (option.position) {
            case ContentPosition.Begin:
                insertNodeAtBegin(this.contentDiv, this.inlineElementFactory, node, option);
                break;
            case ContentPosition.End:
                insertNodeAtEnd(this.contentDiv, this.inlineElementFactory, node, option);
                break;
            case ContentPosition.SelectionStart:
                insertNodeAtSelection(
                    this.contentDiv,
                    this.inlineElementFactory,
                    this.getSelectionRange(),
                    node,
                    option
                );
                break;
            case ContentPosition.Outside:
                this.contentDiv.parentNode.insertBefore(node, this.contentDiv.nextSibling);
                break;
        }

        return true;
    }

    // Delete a node
    public deleteNode(node: Node): boolean {
        // Only remove the node when it falls within editor
        if (node && this.contains(node)) {
            this.focus();
            node.parentNode.removeChild(node);
            return true;
        }

        return false;
    }

    // Replace a node with another node
    public replaceNode(existingNode: Node, toNode: Node): boolean {
        // Only replace the node when it falls within editor
        if (existingNode && toNode && this.contains(existingNode)) {
            this.focus();

            existingNode.parentNode.replaceChild(toNode, existingNode);
            return true;
        }

        return false;
    }

    public getInlineElementAtNode(node: Node): InlineElement {
        return getInlineElementAtNode(this.contentDiv, node, this.inlineElementFactory);
    }

    // Trigger an event to be dispatched to all plugins
    // broadcast indicates if the event needs to be dispatched to all plugins
    // true means to all, false means to allow exclusive handling from one plugin unless no one wants that
    public triggerEvent(pluginEvent: PluginEvent, broadcast: boolean = true): void {
        let isHandledExclusively = false;
        if (!broadcast) {
            for (let i = 0; i < this.plugins.length; i++) {
                let plugin = this.plugins[i];
                if (
                    plugin.willHandleEventExclusively &&
                    plugin.onPluginEvent &&
                    plugin.willHandleEventExclusively(pluginEvent)
                ) {
                    plugin.onPluginEvent(pluginEvent);
                    isHandledExclusively = true;
                    break;
                }
            }
        }

        if (!isHandledExclusively) {
            this.plugins.forEach(plugin => {
                if (plugin.onPluginEvent) {
                    plugin.onPluginEvent(pluginEvent);
                }
            });
        }
    }

    // Get a content traverser that can be used to travse content within editor
    public getContentTraverser(
        scope: ContentScope,
        position: ContentPosition = ContentPosition.SelectionStart
    ): ContentTraverser {
        // TODO: so far we only provides three scopers
        // 1) SelectionBlockScoper is a block based scoper that restrict traversing within the block where the selection is
        //    it allows traversing from start, end or selection start position
        //    this is commonly used to parse content from cursor as user type up to the begin or end of block
        // 2) SelectionScoper restricts traversing within the selection. It is commonly used for applying style to selection
        // 3) BodyScoper will traverse the entire editor body from the beginning (ignoring the passed in position parameter)
        // When more scopers are needed, this needs to be modified
        let selectionRange = this.getSelectionRange();
        if (scope != ContentScope.Body && !selectionRange) {
            return null;
        }

        let contentTraverser: ContentTraverser;
        let scoper: TraversingScoper;
        switch (scope) {
            case ContentScope.Block:
                scoper = new SelectionBlockScoper(
                    this.contentDiv,
                    selectionRange,
                    position,
                    this.inlineElementFactory
                );
                break;
            case ContentScope.Selection:
                scoper = new SelectionScoper(
                    this.contentDiv,
                    selectionRange,
                    this.inlineElementFactory
                );
                break;
            case ContentScope.Body:
                scoper = new BodyScoper(this.contentDiv, this.inlineElementFactory);
                break;
        }

        if (scoper) {
            contentTraverser = new ContentTraverser(
                this.contentDiv,
                scoper,
                this.inlineElementFactory
            );
        }

        return contentTraverser;
    }

    // Update selection in editor
    public updateSelection(selectionRange: Range): boolean {
        let selectionUpdated = false;
        if (isRangeInContainer(selectionRange, this.contentDiv)) {
            selectionUpdated = updateSelectionToRange(this.getDocument(), selectionRange);

            // When the selection is updated when editor does not have the focus, also update the cached selection range
            if (selectionUpdated && !this.hasFocus()) {
                this.cachedSelectionRange = selectionRange;
            }

            selectionUpdated = true;
        }

        return selectionUpdated;
    }

    // DOM query content in editor
    public queryContent(selector: string): NodeListOf<Element> {
        return this.contentDiv.querySelectorAll(selector);
    }

    // Check if editor is in IME input sequence
    public isInIME(): boolean {
        return this.isInIMESequence;
    }

    // Check if the node falls in the contentDiv
    public contains(node: Node): boolean {
        return node && contains(this.contentDiv, node);
    }

    // Save the current selection in editor
    public saveSelectionRange(): void {
        let range = tryGetSelectionRange(this.contentDiv);
        if (range) {
            this.cachedSelectionRange = range;
        }
    }

    // Get a rect representing the location of the cursor.
    public getCursorRect(): Rect {
        return getCursorRect(this.contentDiv);
    }

    private bindEvents(): void {
        this.isBeforeDeactivateEventSupported = browserData.isIE || browserData.isEdge;
        this.contentDiv.addEventListener('keypress', this.onKeyPress);
        this.contentDiv.addEventListener('keydown', this.onKeyDown);
        this.contentDiv.addEventListener('keyup', this.onKeyUp);
        this.contentDiv.addEventListener('mouseup', this.onMouseUp);
        this.contentDiv.addEventListener('compositionstart', this.onCompositionStart);
        this.contentDiv.addEventListener('compositionend', this.onCompositionEnd);
        this.contentDiv.addEventListener('blur', this.onBlur);
        this.contentDiv.addEventListener('focus', this.onFocus);
        this.contentDiv.addEventListener('mouseover', this.onMouseOver);
        this.contentDiv.addEventListener('mouseout', this.onMouseOut);
        this.contentDiv.addEventListener('paste', this.onPaste);
        this.contentDiv.addEventListener('copy', this.onCopy);

        // we do saving selection when editor loses focus, which normally can be done in onBlur event
        // Edge and IE, however attempting to save selection from onBlur is too late
        // There is an Edge and IE only beforedeactivate event where we can save selection
        if (this.isBeforeDeactivateEventSupported) {
            this.contentDiv.addEventListener('beforedeactivate', this.onBeforeDeactivate);
        }
    }

    private unbindEvents(): void {
        this.contentDiv.removeEventListener('keypress', this.onKeyPress);
        this.contentDiv.removeEventListener('keydown', this.onKeyDown);
        this.contentDiv.removeEventListener('keyup', this.onKeyUp);
        this.contentDiv.removeEventListener('mouseup', this.onMouseUp);
        this.contentDiv.removeEventListener('compositionstart', this.onCompositionStart);
        this.contentDiv.removeEventListener('compositionend', this.onCompositionEnd);
        this.contentDiv.removeEventListener('blur', this.onBlur);
        this.contentDiv.removeEventListener('focus', this.onFocus);
        this.contentDiv.removeEventListener('mouseover', this.onMouseOver);
        this.contentDiv.removeEventListener('mouseout', this.onMouseOut);
        this.contentDiv.removeEventListener('paste', this.onPaste);
        this.contentDiv.removeEventListener('copy', this.onCopy);

        if (this.isBeforeDeactivateEventSupported) {
            this.contentDiv.removeEventListener('beforedeactivate', this.onBeforeDeactivate);
        }
    }

    private initializePlugins(): void {
        this.plugins.forEach(plugin => {
            if (!plugin) {
                throw new Error('options.plugins must not contain null plugin');
            }

            plugin.initialize(this);
        });
    }

    private disposePlugins(): void {
        this.plugins.forEach(plugin => {
            plugin.dispose();
        });
    }

    private onBlur = (event: FocusEvent) => {
        // For browsers that do not support beforedeactivate, still do the saving selection in onBlur
        // Also check if there's already a selection range cache because in Chrome onBlur can be triggered multiple times when user clicks to other places,
        // in that case the second time when fetching the selection range may result in a wrong selection.
        if (!this.isBeforeDeactivateEventSupported && !this.cachedSelectionRange) {
            this.saveSelectionRange();
        }
        this.dispatchDomEventToPlugin(PluginEventType.Blur, event);
    };

    private onBeforeDeactivate = () => {
        // this should fire up only for edge and IE
        if (!this.cachedSelectionRange) {
            this.saveSelectionRange();
        }
    };

    private onKeyPress = (event: KeyboardEvent) => {
        // Check if user is typing right under the content div
        // When typing goes directly under content div, many things can go wrong
        // We fix it by wrapping it with a div and reposition cursor within the div
        // TODO: we only fix the case when selection is collapsed
        // When selection is not collapsed, i.e. users press ctrl+A, and then type
        // We don't have a good way to fix that for the moment
        let selectionRange = this.getSelectionRange();
        let focusNode: Node;
        if (
            selectionRange &&
            selectionRange.collapsed &&
            (focusNode = selectionRange.startContainer) &&
            (focusNode == this.contentDiv ||
                (focusNode.nodeType == NodeType.Text && focusNode.parentNode == this.contentDiv))
        ) {
            let editorSelection = new EditorSelection(
                this.contentDiv,
                selectionRange,
                this.inlineElementFactory
            );
            let blockElement = editorSelection.startBlockElement;
            if (!blockElement) {
                // Only reason we don't get the selection block is that we have an empty content div
                // which can happen when users removes everything (i.e. select all and DEL, or backspace from very end to begin)
                // The fix is to add a DIV wrapping, apply default format and move cursor over
                let nodes = fromHtml(HTML_EMPTY_DIV_BLOCK, this.getDocument());
                let element = this.contentDiv.appendChild(nodes[0]) as HTMLElement;
                applyFormat(element, this.defaultFormat);
                // element points to a wrapping node we added "<div><br></div>". We should move the selection left to <br>
                this.updateSelectionToEditorPoint({
                    containerNode: element.firstChild,
                    offset: NodeBoundary.Begin,
                });
            } else if (
                blockElement.getStartNode().parentNode == blockElement.getEndNode().parentNode
            ) {
                // Only fix the balanced start-end block where start and end node is under same parent
                // The focus node could be pointing to the content div, normalize it to have it point to a child first
                let focusOffset = selectionRange.startOffset;
                let editorPoint = normalizeEditorPoint(focusNode, focusOffset);
                let element = wrapAll(
                    blockElement.getContentNodes(),
                    HTML_EMPTY_DIV
                ) as HTMLElement;
                if (getTagOfNode(blockElement.getStartNode()) == 'BR') {
                    // if the block is just BR, apply default format
                    // Otherwise, leave it as it is as we don't want to change the style for existing data
                    applyFormat(element, this.defaultFormat);
                }
                // Last restore the selection using the normalized editor point
                this.updateSelectionToEditorPoint(editorPoint);
            }
        }

        this.dispatchDomEventToPlugin(PluginEventType.KeyPress, event);
    };

    private onKeyDown = (event: KeyboardEvent) => {
        this.dispatchDomEventToPlugin(PluginEventType.KeyDown, event);
    };

    private onKeyUp = (event: KeyboardEvent) => {
        this.dispatchDomEventToPlugin(PluginEventType.KeyUp, event);
    };

    private onCompositionStart = (event: CompositionEvent) => {
        this.isInIMESequence = true;
    };

    private onCompositionEnd = (event: CompositionEvent) => {
        this.isInIMESequence = false;
        this.dispatchDomEventToPlugin(PluginEventType.CompositionEnd, event);
    };

    private onMouseUp = (event: MouseEvent) => {
        this.dispatchDomEventToPlugin(PluginEventType.MouseUp, event);
    };

    private onMouseOver = (event: MouseEvent) => {
        this.dispatchDomEventToPlugin(PluginEventType.MouseOver, event);
    };

    private onMouseOut = (event: MouseEvent) => {
        this.dispatchDomEventToPlugin(PluginEventType.MouseOut, event);
    };

    private onPaste = (event: ClipboardEvent) => {
        this.dispatchDomEventToPlugin(PluginEventType.Paste, event);
    };

    private onCopy = (event: ClipboardEvent) => {
        this.dispatchDomEventToPlugin(PluginEventType.Copy, event);
    };

    private onFocus = (event: FocusEvent) => {
        // Restore the last saved selection first
        if (this.cachedSelectionRange) {
            this.restoreLastSavedSelection();
        }

        this.cachedSelectionRange = null;
        this.dispatchDomEventToPlugin(PluginEventType.Focus, event);
    };

    // Dispatch DOM event to plugin
    private dispatchDomEventToPlugin(eventType: PluginEventType, rawEvent: Event): void {
        let pluginEvent: PluginDomEvent = {
            eventType: eventType,
            rawEvent: rawEvent,
        };

        this.triggerEvent(pluginEvent, false /*broadcast*/);
    }

    // Ensure initial content exist in editor
    private ensureInitialContent(initialContent?: string): void {
        // Use the initial content to overwrite any existing content if specified
        if (initialContent) {
            this.setContent(initialContent);
        }

        let firstBlock = getFirstBlockElement(this.contentDiv, this.inlineElementFactory);
        let defaultFormatBlockElement: HTMLElement;

        if (!firstBlock) {
            // No first block, let's create one
            let nodes = fromHtml(HTML_EMPTY_DIV_BLOCK, this.getDocument());
            defaultFormatBlockElement = this.contentDiv.appendChild(nodes[0]) as HTMLElement;
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
            applyFormat(defaultFormatBlockElement, this.defaultFormat);
        }
    }

    private setSelectionToBegin(): boolean {
        let selectionUpdated = false;
        let range: Range;
        let firstNode = getFirstLeafNode(this.contentDiv);
        if (firstNode) {
            if (firstNode.nodeType == NodeType.Text) {
                // First node is text, move range to the begin
                range = this.getDocument().createRange();
                range.setStart(firstNode, 0);
            } else if (firstNode.nodeType == NodeType.Element) {
                if (isVoidHtmlElement(firstNode as HTMLElement)) {
                    // First node is a html void element (void elements cannot have child nodes), move range before it
                    range = this.getDocument().createRange();
                    range.setStartBefore(firstNode);
                } else {
                    // Other html element, move range inside it
                    range = this.getDocument().createRange();
                    range.setStart(firstNode, 0);
                }
            }
        } else {
            // No first node, likely we have an empty content DIV, move range inside it
            range = this.getDocument().createRange();
            range.setStart(this.contentDiv, 0);
        }

        if (range) {
            selectionUpdated = updateSelectionToRange(this.getDocument(), range);
        }

        return selectionUpdated;
    }

    // Update selection to an editor point
    private updateSelectionToEditorPoint(editorPoint: EditorPoint): boolean {
        if (!editorPoint.containerNode || !this.contains(editorPoint.containerNode)) {
            return false;
        }

        let range = this.getDocument().createRange();
        if (
            editorPoint.containerNode.nodeType == NodeType.Text &&
            editorPoint.offset < editorPoint.containerNode.nodeValue.length
        ) {
            range.setStart(editorPoint.containerNode, editorPoint.offset);
        } else {
            if (editorPoint.offset == NodeBoundary.Begin) {
                range.setStartBefore(editorPoint.containerNode);
            } else {
                range.setStartAfter(editorPoint.containerNode);
            }
        }

        range.collapse(true /* toStart */);
        return updateSelectionToRange(this.getDocument(), range);
    }

    private restoreLastSavedSelection(): boolean {
        let selectionRestored = false;
        if (this.cachedSelectionRange) {
            selectionRestored = updateSelectionToRange(
                this.getDocument(),
                this.cachedSelectionRange
            );
        }

        return selectionRestored;
    }
}
