import { toArray } from 'roosterjs-content-model-dom';
import type { DOMHelper } from 'roosterjs-content-model-types';

class DOMHelperImpl implements DOMHelper {
    constructor(private contentDiv: HTMLElement) {}

    queryElements(selector: string): HTMLElement[] {
        return toArray(this.contentDiv.querySelectorAll(selector)) as HTMLElement[];
    }

    isNodeInEditor(node: Node): boolean {
        return this.contentDiv.contains(node);
    }

    calculateZoomScale(): number {
        const originalWidth = this.contentDiv.getBoundingClientRect()?.width || 0;
        const visualWidth = this.contentDiv.offsetWidth;

        return visualWidth > 0 && originalWidth > 0
            ? Math.round((originalWidth / visualWidth) * 100) / 100
            : 1;
    }
}

/**
 * @internal Create new instance of DOMHelper
 */
export function createDOMHelper(contentDiv: HTMLElement): DOMHelper {
    return new DOMHelperImpl(contentDiv);
}
