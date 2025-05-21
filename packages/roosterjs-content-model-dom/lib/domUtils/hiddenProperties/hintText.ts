import { getHiddenProperty, setHiddenProperty } from './hiddenProperty';

/**
 * Get hint text from element
 * @param element The element to get hint text from
 * @returns Hint text or undefined if not found
 */
export function getHintText(element: HTMLElement): string {
    return getHiddenProperty(element, 'hintText') ?? '';
}

/**
 * Set hint text to element
 * @param element The element to set hint text to
 * @param hintText The hint text to set
 */
export function setHintText(element: HTMLElement, hintText: string): void {
    setHiddenProperty(element, 'hintText', hintText);
}
