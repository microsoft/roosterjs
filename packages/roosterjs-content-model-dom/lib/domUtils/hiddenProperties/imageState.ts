import { getHiddenProperty, setHiddenProperty } from './hiddenProperty';

/**
 * Get image state from element. This is used to store a image state.
 */
export function getImageState(element: HTMLElement): string | undefined {
    return getHiddenProperty(element, 'imageState');
}

/**
 * Set image state to element. This is used to store a image state.
 */
export function setImageState(element: HTMLElement, marker: string): void {
    setHiddenProperty(element, 'imageState', marker);
}
