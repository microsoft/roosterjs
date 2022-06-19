import safeInstanceOf from './safeInstanceOf';

/**
 * A wrapper function of Element.matches
 * @param element The element to match
 * @param selector The selector to match
 */
export default function matchesSelector(element: Node, selector: string): boolean {
    return safeInstanceOf(element, 'HTMLElement') && element.matches(selector);
}
