import { createElement } from 'roosterjs-editor-dom';
import { PluginEventType } from 'roosterjs-editor-types';
import type {
    KnownAnnounceStrings,
    EditorPlugin,
    IEditor,
    PluginEvent,
    AnnounceData,
} from 'roosterjs-editor-types';

/**
 * Automatically transform -- into hyphen, if typed between two words.
 */
export default class Announce implements EditorPlugin {
    private ariaLiveElement: HTMLDivElement | undefined;
    private editor: IEditor | undefined;

    constructor(private readonly stringsMap?: Map<KnownAnnounceStrings, string> | undefined) {}

    /**
     * Get a friendly name of this plugin
     */
    getName() {
        return 'Announce';
    }

    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.ariaLiveElement?.parentElement?.removeChild(this.ariaLiveElement);
        this.ariaLiveElement = undefined;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (
            this.editor &&
            event.eventType == PluginEventType.ContentChanged &&
            event.additionalData?.getAnnounceData
        ) {
            const data = event.additionalData.getAnnounceData();
            if (data) {
                this.announce(data, this.editor);
            }
        }
    }

    private announce(announceData: AnnounceData, editor: IEditor) {
        const { text, defaultStrings, formatStrings = [] } = announceData;
        let textToAnnounce = formatString(
            (defaultStrings && this.stringsMap?.get(defaultStrings)) || text,
            formatStrings
        );
        if (textToAnnounce) {
            if (!this.ariaLiveElement || textToAnnounce == this.ariaLiveElement?.textContent) {
                this.ariaLiveElement?.parentElement?.removeChild(this.ariaLiveElement);
                this.ariaLiveElement = createAriaLiveElement(editor.getDocument());
            }
            if (this.ariaLiveElement) {
                this.ariaLiveElement.textContent = textToAnnounce;
            }
        }
    }

    /**
     * @internal
     * Public only for unit testing.
     * @returns
     */
    public getAriaLiveElement() {
        return this.ariaLiveElement;
    }
}

function createAriaLiveElement(document: Document): HTMLDivElement {
    const element = createElement(
        {
            tag: 'div',
            style:
                'clip: rect(0px, 0px, 0px, 0px); clip-path: inset(100%); height: 1px; overflow: hidden; position: absolute; white-space: nowrap; width: 1px;',
            attributes: {
                'aria-live': 'assertive',
            },
        },
        document
    ) as HTMLDivElement;

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
