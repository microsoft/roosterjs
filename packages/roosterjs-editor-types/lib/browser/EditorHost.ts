/**
 * A replacement of Document object for editor.
 */
export default interface EditorHost {
    /**
     * Get document of editor
     */
    readonly document: Document;

    /**
     * Get shadow root of editor if editor is under shadow DOM
     */
    readonly shadowRoot: ShadowRoot;

    dispose(): void;

    /**
     * Get Element by its id
     * @param elementId Element id
     */
    getElementById(elementId: string): HTMLElement | null;

    /**
     * Add event listener to editor host
     * @param type
     * @param listener
     * @param options
     */
    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void;

    /**
     * Remove event listener from editor host
     * @param type
     * @param listener
     * @param options
     */
    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions
    ): void;

    /**
     * Get current selection
     */
    getSelection(): Selection | null;

    /** Creates a new document. */
    createDocumentFragment(): DocumentFragment;
    /**
     * Creates an instance of the element for the specified tag.
     * @param tagName The name of an element.
     */
    createElement<K extends keyof HTMLElementTagNameMap>(
        tagName: K,
        options?: ElementCreationOptions
    ): HTMLElementTagNameMap[K];
    /** @deprecated */
    createElement<K extends keyof HTMLElementDeprecatedTagNameMap>(
        tagName: K,
        options?: ElementCreationOptions
    ): HTMLElementDeprecatedTagNameMap[K];
    createElement(tagName: string, options?: ElementCreationOptions): HTMLElement;
    /**
     * Returns an element with namespace namespace. Its namespace prefix will be everything before ":" (U+003E) in qualifiedName or null. Its local name will be everything after ":" (U+003E) in qualifiedName or qualifiedName.
     *
     * If localName does not match the Name production an "InvalidCharacterError" DOMException will be thrown.
     *
     * If one of the following conditions is true a "NamespaceError" DOMException will be thrown:
     *
     * localName does not match the QName production.
     * Namespace prefix is not null and namespace is the empty string.
     * Namespace prefix is "xml" and namespace is not the XML namespace.
     * qualifiedName or namespace prefix is "xmlns" and namespace is not the XMLNS namespace.
     * namespace is the XMLNS namespace and neither qualifiedName nor namespace prefix is "xmlns".
     *
     * When supplied, options's is can be used to create a customized built-in element.
     */
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
    /**
     * Creates a text string from the specified value.
     * @param data String that specifies the nodeValue property of the text node.
     */
    createTextNode(data: string): Text;

    /**  Returns an empty range object that has both of its boundary points positioned at the beginning of the document. */
    createRange(): Range;

    /**
     * Executes a command on the current document, current selection, or the given range.
     * @param commandId String that specifies the command to execute. This command can be any of the command identifiers that can be executed in script.
     * @param showUI Display the user interface, defaults to false.
     * @param value Value to assign.
     * @deprecated
     */
    execCommand(commandId: string, showUI?: boolean, value?: string): boolean;

    /**
     * Append style element to the document
     * @param style The style element to append
     */
    appendStyleElement(style: HTMLStyleElement): void;

    /**
     * Get window of editor
     */
    readonly defaultView: Window;

    /**
     * Get head element
     */
    readonly head: HTMLHeadElement;

    /**
     * Get body element
     */
    readonly body: HTMLElement;

    /**
     * Returns the deepest element in the document through which or to which key events are being routed. This is, roughly speaking, the focused element in the document.
     *
     * For the purposes of this API, when a child browsing context is focused, its container is focused in the parent browsing context. For example, if the user moves the focus to a text control in an iframe, the iframe is the element returned by the activeElement API in the iframe's node document.
     *
     * Similarly, when the focused element is in a different node tree than documentOrShadowRoot, the element returned will be the host that's located in the same node tree as documentOrShadowRoot if documentOrShadowRoot is a shadow-including inclusive ancestor of the focused element, and null if not.
     */
    readonly activeElement: Element | null;
}
