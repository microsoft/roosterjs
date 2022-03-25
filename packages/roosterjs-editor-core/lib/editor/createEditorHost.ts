import { Browser, safeInstanceOf } from 'roosterjs-editor-dom';
import { EditorHost } from 'roosterjs-editor-types';

/**
 * @internal
 */
export default function createEditorHost(contentDiv: HTMLDivElement): EditorHost {
    const document = contentDiv.ownerDocument;
    const shadowRoot = getShadowRoot(contentDiv);
    const shadowRootOrDoc = shadowRoot || document;

    if (hasGetSelection(shadowRootOrDoc)) {
        return new ChromeEditorHost(document, shadowRoot, shadowRootOrDoc);
    } else if (document.defaultView.getSelection && Browser.isFirefox) {
        return new FirefoxEditorHost(document, shadowRoot, shadowRootOrDoc);
    } else {
        return new SafariEditorHost(document, shadowRoot, shadowRootOrDoc);
    }
}
abstract class EditorHostBase<T extends ShadowRoot | Document> implements EditorHost {
    public readonly defaultView: Window;
    public readonly head: HTMLHeadElement;
    public readonly body: HTMLElement;

    constructor(
        public readonly document: Document,
        public readonly shadowRoot: ShadowRoot | null,
        protected shadowRootOrDoc: T
    ) {
        this.defaultView = this.document.defaultView;
        this.head = this.document.head;
        this.body = this.document.body;
    }

    dispose(): void {}

    abstract getSelection(): Selection;

    getElementById(elementId: string): HTMLElement | null {
        return this.shadowRootOrDoc.getElementById(elementId);
    }

    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void {
        this.shadowRootOrDoc.addEventListener(type, listener, options);
    }

    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions
    ): void {
        this.shadowRootOrDoc.removeEventListener(type, listener, options);
    }

    createDocumentFragment(): DocumentFragment {
        return this.document.createDocumentFragment();
    }

    createElement(tagName: string, options?: ElementCreationOptions) {
        return this.document.createElement(tagName, options);
    }

    createElementNS(
        namespaceURI: 'http://www.w3.org/1999/xhtml',
        qualifiedName: string
    ): HTMLElement;
    createElementNS<K extends keyof SVGElementTagNameMap>(
        namespaceURI: 'http://www.w3.org/2000/svg',
        qualifiedName: K
    ): SVGElementTagNameMap[K];
    createElementNS(namespaceURI: 'http://www.w3.org/2000/svg', qualifiedName: string): SVGElement;
    createElementNS(
        namespaceURI: string | null,
        qualifiedName: string,
        options?: ElementCreationOptions
    ): Element;
    createElementNS(
        namespace: string | null,
        qualifiedName: string,
        options?: string | ElementCreationOptions
    ): Element;
    createElementNS(
        namespace: string | null,
        qualifiedName: string,
        options?: string | ElementCreationOptions
    ) {
        return this.document.createElementNS(namespace, qualifiedName, options);
    }
    createTextNode(data: string): Text {
        return this.document.createTextNode(data);
    }
    execCommand(commandId: string, showUI?: boolean, value?: string) {
        return this.document.execCommand(commandId, showUI, value);
    }
    createRange(): Range {
        return this.document.createRange();
    }

    appendStyleElement(style: HTMLStyleElement): void {
        if (this.shadowRoot) {
            this.shadowRoot.appendChild(style);
        } else {
            this.document.head.appendChild(style);
        }
    }

    get activeElement() {
        return this.shadowRootOrDoc.activeElement;
    }
}

class ChromeEditorHost extends EditorHostBase<GetSelection & (ShadowRoot | Document)> {
    constructor(
        document: Document,
        shadowRoot: ShadowRoot | null,
        shadowRootOrDoc: GetSelection & (ShadowRoot | Document)
    ) {
        super(document, shadowRoot, shadowRootOrDoc);
    }

    getSelection(): Selection {
        return this.shadowRootOrDoc.getSelection();
    }
}

class FirefoxEditorHost extends EditorHostBase<ShadowRoot | Document> {
    getSelection(): Selection {
        return this.defaultView.getSelection();
    }
}

class SafariEditorHost extends EditorHostBase<ShadowRoot | Document> {
    private processing: boolean = false;
    private selection: Selection;

    constructor(
        document: Document,
        shadowRoot: ShadowRoot | null,
        shadowRootOrDoc: ShadowRoot | Document
    ) {
        super(document, shadowRoot, shadowRootOrDoc);

        this.defaultView.addEventListener('selectionchange', this.onSelectionChange, true);
        this.defaultView.addEventListener('beforeinput', this.onBeforeInput, true);
        this.defaultView.addEventListener('selectstart', this.onSelectStart, true);
        this.selection = new ShadowSelection();
    }

    dispose() {
        this.defaultView.removeEventListener('selectionchange', this.onSelectionChange, true);
        this.defaultView.removeEventListener('beforeinput', this.onBeforeInput, true);
        this.defaultView.removeEventListener('selectstart', this.onSelectStart, true);
        this.selection = undefined!;

        super.dispose();
    }

    getSelection(): Selection {
        return this.selection;
    }

    private onSelectionChange = () => {
        if (!this.processing) {
            this.processing = true;

            if (this.activeElement?.getAttribute('contenteditable') === 'true') {
                this.document.execCommand('indent');
            } else {
                this.selection.removeAllRanges();
            }

            this.processing = false;
        }
    };

    private onBeforeInput = (event: InputEvent) => {
        if (this.processing) {
            const ranges = event.getTargetRanges();
            const range = ranges[0];
            const newRange = this.document.createRange();

            newRange.setStart(range.startContainer, range.startOffset);
            newRange.setEnd(range.endContainer, range.endOffset);

            this.selection.removeAllRanges();
            this.selection.addRange(newRange);

            event.preventDefault();
            event.stopImmediatePropagation();
        }
    };

    private onSelectStart = () => {
        this.selection.removeAllRanges();
    };
}

function getShadowRoot(node: Node): ShadowRoot | null {
    let result: Node | null = node;

    while (result) {
        if (safeInstanceOf(result, 'ShadowRoot')) {
            return result;
        }

        result = result.parentNode;
    }

    return null;
}

interface GetSelection {
    getSelection(): Selection | null;
}

function hasGetSelection(source: any): source is GetSelection {
    return !!(<GetSelection>source).getSelection;
}

class ShadowSelection implements Selection {
    private ranges: Range[];

    constructor() {
        this.ranges = [];
    }

    getRangeAt(index: number) {
        return this.ranges[index];
    }

    addRange(range: Range) {
        this.ranges.push(range);
        this.rangeCount = this.ranges.length;
    }

    removeAllRanges() {
        this.ranges = [];
        this.rangeCount = 0;
    }

    anchorNode: Node | null = null;
    anchorOffset: number = 0;
    focusNode: Node | null = null;
    focusOffset: number = 0;
    isCollapsed: boolean = true;
    rangeCount: number = 0;
    type: string = '';
    collapse(node: Node | null, offset?: number) {}
    collapseToEnd(): void {}
    collapseToStart(): void {}
    containsNode(node: Node, allowPartialContainment?: boolean): boolean {
        return false;
    }
    deleteFromDocument(): void {}
    empty(): void {}
    extend(node: Node, offset?: number): void {}
    removeRange(range: Range): void {}
    selectAllChildren(node: Node): void {}
    setBaseAndExtent(
        anchorNode: Node,
        anchorOffset: number,
        focusNode: Node,
        focusOffset: number
    ): void {}
    setPosition(node: Node | null, offset?: number): void {}
}
