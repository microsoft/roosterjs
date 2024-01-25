import { toArray } from 'roosterjs-content-model-dom';
import type { DOMHelper, Position } from 'roosterjs-content-model-types';

class DOMHelperImpl implements DOMHelper {
    constructor(private contentDiv: HTMLElement) {}

    queryElements(selector: string): HTMLElement[] {
        return toArray(this.contentDiv.querySelectorAll(selector)) as HTMLElement[];
    }

    getFocusedPosition(): Position | null {
        return null;
    }
}

/**
 * @internal Create new instance of DOMHelper
 */
export function createDOMHelper(contentDiv: HTMLElement): DOMHelper {
    return new DOMHelperImpl(contentDiv);
}
