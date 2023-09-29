import { createElement } from 'roosterjs-editor-dom';
import { getAllAnnounceFeatures } from './features/getAllAnnounceFeatures';
import { PluginEventType } from 'roosterjs-editor-types';
import type { AnnounceFeature, AnnounceFeatureParam } from './AnnounceFeature';
import type { CompatibleKnownAnnounceStrings } from 'roosterjs-editor-types/lib/compatibleTypes';
import type {
    KnownAnnounceStrings,
    EditorPlugin,
    IEditor,
    PluginEvent,
    AnnounceData,
    PluginKeyDownEvent,
} from 'roosterjs-editor-types';

const ARIA_LIVE_STYLE =
    'clip: rect(0px, 0px, 0px, 0px); clip-path: inset(100%); height: 1px; overflow: hidden; position: absolute; white-space: nowrap; width: 1px;';
const ARIA_LIVE_ASSERTIVE = 'assertive';
const DIV_TAG = 'div';
const createAriaLiveElement = (document: Document): HTMLDivElement => {
    const element = createElement(
        {
            tag: DIV_TAG,
            style: ARIA_LIVE_STYLE,
            attributes: {
                'aria-live': ARIA_LIVE_ASSERTIVE,
            },
        },
        document
    ) as HTMLDivElement;

    document.body.appendChild(element);

    return element;
};

/**
 * Announce messages to screen reader by using aria live element.
 */
export default class Announce implements EditorPlugin {
    private ariaLiveElement: HTMLDivElement | undefined;
    private editor: IEditor | undefined;
    private features: AnnounceFeature[];
    private lastFocusedElement: HTMLElement | undefined | null;

    constructor(
        private stringsMap?:
            | Map<KnownAnnounceStrings | CompatibleKnownAnnounceStrings, string>
            | ((key: KnownAnnounceStrings | CompatibleKnownAnnounceStrings) => string)
            | undefined
    ) {
        this.features = getAllAnnounceFeatures();
    }

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
        this.stringsMap = undefined;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(ev: PluginEvent) {
        if (
            this.editor &&
            ev.eventType == PluginEventType.ContentChanged &&
            ev.additionalData?.getAnnounceData
        ) {
            const data = ev.additionalData.getAnnounceData();
            if (data) {
                this.announce(data, this.editor);
            }
        }

        if (ev.eventType == PluginEventType.KeyDown && this.editor) {
            this.handleFeatures(ev, this.editor);
            this.lastFocusedElement = this.editor?.getElementAtCursor();
        }
    }

    private handleFeatures(event: PluginKeyDownEvent, editor: IEditor) {
        const announceParam: AnnounceFeatureParam = {
            announceCallback: (announceData: AnnounceData) => this.announce(announceData, editor),
            editor,
            event,
            lastFocusedElement: this.lastFocusedElement,
        };
        this.features
            .filter(feature => feature.keys.indexOf(event.rawEvent.which) > -1)
            .forEach(feature => {
                if (feature.shouldHandle(announceParam)) {
                    feature.handle(announceParam);
                }
            });
    }

    protected announce(announceData: AnnounceData, editor: IEditor) {
        const { text, defaultStrings, formatStrings = [] } = announceData;
        let textToAnnounce = formatString(this.getString(defaultStrings) || text, formatStrings);
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

    private getString(key: KnownAnnounceStrings | CompatibleKnownAnnounceStrings | undefined) {
        if (this.stringsMap == undefined || key == undefined) {
            return undefined;
        }

        if (typeof this.stringsMap === 'function') {
            return this.stringsMap(key);
        } else {
            return this.stringsMap.get(key);
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

function formatString(text: string | undefined, formatStrings: string[]) {
    if (text == undefined) {
        return text;
    }

    formatStrings.forEach((value, index) => {
        text = text?.replace(`{${index}}`, value);
    });

    return text;
}
