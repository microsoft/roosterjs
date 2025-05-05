import { getHiddenProperty, setHiddenProperty } from './hiddenProperty';

/**
 * Get image marker from element. This is used to mark the end of a image in a block element.
 */
export function getImageMarker(element: HTMLElement): string | undefined {
    return getHiddenProperty(element, 'imageMarker');
}

/**
 * Set image marker to element. This is used to mark the end of a image in a block element.
 */
export function setImageMarker(element: HTMLElement, marker: string): void {
    setHiddenProperty(element, 'imageMarker', marker);
}
