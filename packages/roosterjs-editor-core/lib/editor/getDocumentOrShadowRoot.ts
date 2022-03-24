import { Browser, safeInstanceOf } from 'roosterjs-editor-dom';
import { DocumentOrShadowRoot } from 'roosterjs-editor-types';

/**
 * Get the document or shadow root of a given node
 * @param node The node to check
 * @returns Either the document object or shadow root of the given node,
 * or null if node is not under any document or shadow root
 */
export default function getDocumentOrShadowRoot(node: Node | null): DocumentOrShadowRoot | null {
    let result: Node | null = node;

    while (result) {
        if (safeInstanceOf(result, 'Document') || safeInstanceOf(result, 'ShadowRoot')) {
            return createDocumentOrShadowRoot(result, result.ownerDocument?.defaultView);
        }

        result = result.parentNode;
    }

    return null;
}

interface InternalDocumentOrShadowRoot extends DocumentOrShadowRoot {
    selection: Selection | null;
    processing?: boolean;
}

function createDocumentOrShadowRoot(
    source: Document | ShadowRoot,
    window: Window | undefined | null
): DocumentOrShadowRoot | null {
    if (isDocumentOrShadowRoot(source)) {
        // Chrome, Edge
        return source;
    } else if (window?.getSelection && Browser.isFirefox) {
        // Firefox
        const result = (source as any) as DocumentOrShadowRoot;
        result.getSelection = () => window.getSelection();
        result.dispose = () => {
            result.getSelection = undefined!;
        };
        return result;
    } else if (
        window &&
        typeof (window as any).InputEvent.prototype.getTargetRanges === 'function'
    ) {
        // Safari
        const result = (source as any) as InternalDocumentOrShadowRoot;

        const onSelectionChange = () => {
            if (!result.processing) {
                result.processing = true;

                const active = result.activeElement;

                if (active && active.getAttribute('contenteditable') === 'true') {
                    window.document.execCommand('indent');
                } else {
                    result.selection?.removeAllRanges();
                }

                result.processing = false;
            }
        };

        const onBeforeInput = (event: InputEvent) => {
            if (result.processing) {
                const ranges = event.getTargetRanges();
                const range = ranges[0];

                const newRange = new Range();

                newRange.setStart(range.startContainer, range.startOffset);
                newRange.setEnd(range.endContainer, range.endOffset);

                result.selection?.removeAllRanges();
                result.selection?.addRange(newRange);

                event.preventDefault();
                event.stopImmediatePropagation();
            }
        };

        const onSelectStart = () => {
            result.selection?.removeAllRanges();
        };

        window.addEventListener('selectionchange', onSelectionChange, true);
        window.addEventListener('beforeinput', onBeforeInput, true);
        window.addEventListener('selectstart', onSelectStart, true);

        result.selection = new ShadowSelection();
        result.getSelection = () => result.selection;
        result.dispose = () => {
            result.getSelection = undefined!;
            result.selection = undefined!;
            window.removeEventListener('selectionchange', onSelectionChange, true);
            window.removeEventListener('beforeinput', onBeforeInput, true);
            window.removeEventListener('selectstart', onSelectStart, true);
        };

        return result;
    } else {
        return null;
    }
}

function isDocumentOrShadowRoot(source: any): source is DocumentOrShadowRoot {
    return !!((source as any) as DocumentOrShadowRoot).getSelection;
}

class ShadowSelection implements Selection {
    private _ranges: Range[];

    constructor() {
        this._ranges = [];
    }

    getRangeAt(index: number) {
        return this._ranges[index];
    }

    addRange(range: Range) {
        this._ranges.push(range);
        this.rangeCount = this._ranges.length;
    }

    removeAllRanges() {
        this._ranges = [];
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
