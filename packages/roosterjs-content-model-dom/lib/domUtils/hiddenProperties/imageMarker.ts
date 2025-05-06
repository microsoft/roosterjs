import { getHiddenProperty, setHiddenProperty } from './hiddenProperty';

/**
 * Get image marker from element. This is used to mark to store a image property or state.
 */
export function getImageMarker(element: HTMLElement): string | undefined {
    return getHiddenProperty(element, 'imageMarker');
}

/**
 * Set image marker to element. This is used to mark to store a image property or state.
 */
export function setImageMarker(element: HTMLElement, marker: string): void {
    setHiddenProperty(element, 'imageMarker', marker);
}
