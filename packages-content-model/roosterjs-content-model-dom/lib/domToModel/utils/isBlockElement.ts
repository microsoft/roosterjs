import { getDefaultStyle } from './getDefaultStyle';

const BLOCK_DISPLAY_STYLES = ['block', 'list-item', 'table', 'table-cell', 'flex'];

/**
 * Check if the given element will be layout as a block
 * @param element The element to check
 * @param context The context of DOM to Content Model conversion
 */
export function isBlockElement(element: HTMLElement): boolean {
    const display = element.style.display || getDefaultStyle(element).display || '';

    return BLOCK_DISPLAY_STYLES.indexOf(display) >= 0;
}
