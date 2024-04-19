import type { Announce } from 'roosterjs-content-model-types';

/**
 * @internal
 * Announce the given data
 * @param core The EditorCore object
 * @param announceData Data to announce
 */
export const announce: Announce = (core, announceData) => {
    const { text, defaultStrings, formatStrings = [] } = announceData;
    const { announcerStringGetter } = core.lifecycle;
    const template = defaultStrings && announcerStringGetter?.(defaultStrings);
    const textToAnnounce = formatString(template || text, formatStrings);

    if (textToAnnounce) {
        let announceContainer = core.lifecycle.announceContainer;

        if (!announceContainer || textToAnnounce == announceContainer.textContent) {
            announceContainer?.parentElement?.removeChild(announceContainer);
            announceContainer = createAriaLiveElement(core.physicalRoot.ownerDocument);

            core.lifecycle.announceContainer = announceContainer;
        }

        if (announceContainer) {
            announceContainer.textContent = textToAnnounce;
        }
    }
};

function formatString(text: string | undefined, formatStrings: string[]) {
    if (text == undefined) {
        return text;
    }

    formatStrings.forEach((value, index) => {
        text = text?.replace(`{${index}}`, value);
    });

    return text;
}

function createAriaLiveElement(document: Document): HTMLDivElement {
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
