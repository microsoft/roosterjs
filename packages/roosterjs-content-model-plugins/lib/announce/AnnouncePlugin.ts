import { isNodeOfType, iterateSelections } from 'roosterjs-content-model-dom';
import type { AnnounceFeature } from './AnnounceFeature';
import type {
    AnnounceData,
    EditorPlugin,
    IEditor,
    KeyDownEvent,
    KnownAnnounceStrings,
    PluginEvent,
} from 'roosterjs-content-model-types';

/**
 * Announce messages to screen reader by using aria live element.
 */
export class AnnouncePlugin implements EditorPlugin {
    private ariaLiveElement: HTMLDivElement | undefined;
    private editor: IEditor | undefined;
    private featureMap: Record<string, AnnounceFeature[]> = {};
    private lastFocusedElement: HTMLElement | null = null;

    constructor(
        private stringsMapOrGetter?:
            | Map<KnownAnnounceStrings, string>
            | ((key: KnownAnnounceStrings) => string),
        additionalFeatures?: AnnounceFeature[]
    ) {
        const allFeatures = additionalFeatures || [];

        allFeatures.forEach(feature => {
            feature.keys.forEach(key => {
                if (this.featureMap[key]) {
                    this.featureMap[key].push(feature);
                } else {
                    this.featureMap[key] = [feature];
                }
            });
        });
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
        this.featureMap = {};
        this.editor = undefined;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(ev: PluginEvent) {
        if (this.editor) {
            if (ev.eventType == 'contentChanged' && ev.announceData) {
                this.announce(ev.announceData, this.editor);
            } else if (ev.eventType == 'keyDown') {
                this.handleFeatures(ev);
            }
        }
    }

    private handleFeatures(event: KeyDownEvent) {
        const editor = this.editor;
        const potentialFeatures = this.featureMap[event.rawEvent.key];

        if (editor && potentialFeatures && potentialFeatures.length > 0) {
            const selection = editor.getDOMSelection();
            const node = selection?.type == 'range' ? selection.range.startContainer : null;

            if (!this.lastFocusedElement?.contains(node)) {
                this.lastFocusedElement = node
                    ? isNodeOfType(node, 'ELEMENT_NODE')
                        ? node
                        : node.parentElement
                    : null;

                const win = editor.getDocument().defaultView;

                win?.requestAnimationFrame(() => {
                    if (!editor.isDisposed()) {
                        editor.formatContentModel(model => {
                            iterateSelections(model, (path, tableContext, block, segments) => {
                                potentialFeatures.some(feature => {
                                    const announceData = feature.tryGetAnnounceData(
                                        path,
                                        tableContext,
                                        block,
                                        segments
                                    );

                                    if (announceData) {
                                        this.announce(announceData, editor);
                                    }

                                    return !!announceData;
                                });

                                return true;
                            });

                            return false;
                        });
                    }
                });
            }
        }
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

    private getString(key: KnownAnnounceStrings | undefined) {
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
