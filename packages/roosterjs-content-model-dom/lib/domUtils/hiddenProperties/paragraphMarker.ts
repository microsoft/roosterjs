import { getHiddenProperty, setHiddenProperty } from './hiddenProperty';

/**
 * Get paragraph marker from element. This is used to mark the end of a paragraph in a block element.
 */
export function getParagraphMarker(element: HTMLElement): string | undefined {
    return getHiddenProperty(element, 'paragraphMarker');
}

/**
 * Set paragraph marker to element. This is used to mark the end of a paragraph in a block element.
 */
export function setParagraphMarker(element: HTMLElement, marker: string): void {
    setHiddenProperty(element, 'paragraphMarker', marker);
}
