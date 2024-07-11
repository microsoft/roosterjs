/**
 * @internal
 */
export function createAriaLiveElement(document: Document): HTMLDivElement {
    const div = document.createElement('div');

    div.style.clip = 'rect(0px, 0px, 0px, 0px)';
    div.style.clipPath = 'inset(100%)';
    div.style.height = '1px';
    div.style.overflow = 'hidden';
    div.style.position = 'absolute';
    div.style.whiteSpace = 'nowrap';
    div.style.width = '1px';
    div.ariaLive = 'assertive';

    document.body.appendChild(div);

    return div;
}
