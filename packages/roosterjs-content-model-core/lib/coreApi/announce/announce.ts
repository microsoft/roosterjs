import { createAriaLiveElement } from '../../utils/createAriaLiveElement';
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
    let textToAnnounce = formatString(template || text, formatStrings);

    if (!core.lifecycle.announceContainer) {
        core.lifecycle.announceContainer = createAriaLiveElement(core.physicalRoot.ownerDocument);
    }

    if (textToAnnounce && core.lifecycle.announceContainer) {
        const { announceContainer } = core.lifecycle;
        if (textToAnnounce == announceContainer.textContent) {
            textToAnnounce += '.';
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

    text = text.replace(/\{(\d+)\}/g, (_, sub: string) => {
        const index = parseInt(sub);
        const replace = formatStrings[index];
        return replace ?? '';
    });

    return text;
}
