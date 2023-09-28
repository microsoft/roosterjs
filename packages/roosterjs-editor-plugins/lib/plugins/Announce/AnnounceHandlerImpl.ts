import type { AnnounceData, DefaultAnnounceStrings } from 'roosterjs-editor-types';

/**
 * @internal
 */
export default class AnnounceHandler {
    private ariaLiveElement: HTMLDivElement | undefined;

    constructor(
        private readonly document: Document,
        private stringsMap?: Map<DefaultAnnounceStrings, string>
    ) {}

    public announce(announceData: AnnounceData) {
        const { text, defaultStrings, formatStrings = [] } = announceData;
        let textToAnnounce = formatString(
            (defaultStrings && this.stringsMap?.get(defaultStrings)) || text,
            formatStrings
        );
        if (textToAnnounce) {
            if (!this.ariaLiveElement || textToAnnounce == this.ariaLiveElement?.textContent) {
                this.ariaLiveElement?.parentElement?.removeChild(this.ariaLiveElement);
                this.ariaLiveElement = createAriaLiveElement(this.document);
            }
            if (this.ariaLiveElement) {
                this.ariaLiveElement.textContent = textToAnnounce;
            }
        }
    }

    public dispose() {
        this.ariaLiveElement?.parentElement?.removeChild(this.ariaLiveElement);
        this.ariaLiveElement = undefined;
    }

    public getAriaLiveElement() {
        return this.ariaLiveElement;
    }
}

function createAriaLiveElement(document: Document): HTMLDivElement {
    const element = document.createElement('div');

    element.style.clip = 'rect(0 0 0 0)';
    element.style.clipPath = 'inset(100%)';
    element.style.height = '1px';
    element.style.overflow = 'hidden';
    element.style.position = 'absolute';
    element.style.whiteSpace = 'nowrap';
    element.style.width = '1px';

    element.ariaLive = 'assertive';

    document.body.appendChild(element);

    return element;
}

function formatString(text: string | undefined, formatStrings: string[]) {
    if (text == undefined) {
        return text;
    }

    formatStrings.forEach((value, index) => {
        text = text?.replace(`{${index}}`, value);
    });

    return text;
}
