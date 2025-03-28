import { getHiddenProperty, setHiddenProperty } from './hiddenProperty';

/**
 * Set a hidden property on a link element to indicate whether it is undeletable or not.
 * This is used to prevent the link from being deleted when the user tries to delete it.
 * @param a The link element to set the property on
 * @param undeletable Whether the link is undeletable or not
 */
export function setLinkUndeletable(a: HTMLAnchorElement, undeletable: boolean) {
    setHiddenProperty(a, 'undeletable', undeletable);
}

/**
 * Check if a link element is undeletable or not.
 * This is used to determine if the link can be deleted when the user tries to delete it.
 * @param a The link element to check
 * @returns True if the link is undeletable, false otherwise
 */
export function isLinkUndeletable(a: HTMLAnchorElement): boolean {
    return !!getHiddenProperty(a, 'undeletable');
}
