import { getComputedStyle } from './getComputedStyles';

/**
 * Check if the given element is using right-to-left layout
 * @param element An HTML element to check
 * @returns True if the given element is using right-to-left layout, otherwise false
 */
export default function isRtl(element: HTMLElement): boolean {
    return getComputedStyle(element, 'direction') == 'rtl';
}
