import safeInstanceOf from './safeInstanceOf';

/**
 * Type definition of HTMLElement interface for IE
 */
interface HTMLElementForIE extends HTMLElement {
    /**
     * IE implementation of Element.matches() function
     *
     */
    msMatchesSelector: (selector: string) => boolean;
}

/**
 * A wrapper function of Element.matches
 * @param element The element to match
 * @param selector The selector to match
 */
export default function matchesSelector(element: Node, selector: string): boolean {
    return (
        safeInstanceOf(element, 'HTMLElement') &&
        (element.matches || (<HTMLElementForIE>element).msMatchesSelector).call(element, selector)
    );
}
