import { AnnounceFeatures } from './features/AnnounceFeatures';
import { createElement, getObjectKeys } from 'roosterjs-editor-dom';
import { PluginEventType } from 'roosterjs-editor-types';
import type { AnnounceFeatureKey } from './features/AnnounceFeatures';
import type { AnnounceFeature } from './AnnounceFeature';
import type { CompatibleKnownAnnounceStrings } from 'roosterjs-editor-types/lib/compatibleTypes';
import type {
    EditorPlugin,
    IEditor,
    PluginEvent,
    AnnounceData,
    PluginKeyDownEvent,
    KnownAnnounceStrings,
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
    private lastFocusedElement: HTMLElement | null = null;

    constructor(
        private stringsMapOrGetter?:
            | Map<KnownAnnounceStrings | CompatibleKnownAnnounceStrings, string>
            | ((key: KnownAnnounceStrings | CompatibleKnownAnnounceStrings) => string)
            | undefined,
        skipAnnounceFeatures: AnnounceFeatureKey[] = [],
        additionalFeatures?: AnnounceFeature[]
    ) {
        this.features = getObjectKeys(AnnounceFeatures)
            .map(key => {
                if (skipAnnounceFeatures.indexOf(key) == -1) {
                    return AnnounceFeatures[key];
                }

                return undefined;
            })
            .filter(feature => !!feature)
            .concat(additionalFeatures || []) as AnnounceFeature[];
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
        this.stringsMapOrGetter = undefined;
        this.lastFocusedElement = null;
        while (this.features.length > 0) {
            this.features.pop();
        }
        this.editor = undefined;
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
        }
    }

    private handleFeatures(event: PluginKeyDownEvent, editorInput: IEditor) {
        editorInput.runAsync(editor => {
            this.features
                .filter(feature => feature.keys.indexOf(event.rawEvent.which) > -1)
                .some(feature => {
                    const announceData = feature.shouldHandle(editor, this.lastFocusedElement);
                    if (announceData) {
                        this.announce(announceData, editor);
                    }
                    return !!announceData;
                });

            this.lastFocusedElement = editor.getElementAtCursor();
        });
    }

    protected announce(announceData: AnnounceData, editor: IEditor) {
        const { text, defaultStrings, formatStrings = [] } = announceData;
        const textToAnnounce = formatString(this.getString(defaultStrings) || text, formatStrings);
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

    private getString(key: CompatibleKnownAnnounceStrings | KnownAnnounceStrings | undefined) {
        if (this.stringsMapOrGetter == undefined || key == undefined) {
            return undefined;
        }

        if (typeof this.stringsMapOrGetter === 'function') {
            return this.stringsMapOrGetter(key);
        } else {
            return this.stringsMapOrGetter.get(key);
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
