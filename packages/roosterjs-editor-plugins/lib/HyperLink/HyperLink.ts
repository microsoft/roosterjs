import { Browser } from 'roosterjs-editor-dom';
import { ChangeSource, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { Editor, EditorPlugin } from 'roosterjs-editor-core';

const TEMP_TITLE = 'istemptitle';
const TEMP_TITLE_REGEX = new RegExp(
    `<a\\s+([^>]*\\s+)?(title|${TEMP_TITLE})="[^"]*"\\s*([^>]*)\\s+(title|${TEMP_TITLE})="[^"]*"(\\s+[^>]*)?>`,
    'gm'
);

/**
 * An editor plugin that show a tooltip for existing link
 */
export default class HyperLink implements EditorPlugin {
    private editor: Editor;
    public name: 'HyperLink';

    /**
     * Create a new instance of HyperLink class
     * @param getTooltipCallback A callback function to get tooltip text for an existing hyperlink.
     * Default value is to return the href itself. If null, there will be no tooltip text.
     * @param target (Optional) Target window name for hyperlink. If null, will use "_blank"
     * @param onLinkClick (Optional) Open link callback
     */
    constructor(
        private getTooltipCallback: (href: string) => string = href => href,
        private target?: string,
        private onLinkClick?: (anchor: HTMLAnchorElement, keyboardEvent: KeyboardEvent) => void
    ) {}

    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    public initialize(editor: Editor): void {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    public dispose(): void {
        this.editor.queryElements('a[href]', this.resetAnchor);
        this.editor = null;
    }

    /**
     * Handle plugin events
     * @param event The event object
     */
    public onPluginEvent(event: PluginEvent): void {
        switch (event.eventType) {
            case PluginEventType.EditorReady:
                this.editor.queryElements('a[href]', this.processLink);
                break;

            case PluginEventType.ContentChanged:
                if (event.source == ChangeSource.CreateLink) {
                    this.resetAnchor(event.data as HTMLAnchorElement);
                }

                let anchors = this.editor.queryElements('a[href]');
                if (anchors.length > 0) {
                    // 1. Cache existing snapshot
                    let snapshotBeforeProcessLink = this.getSnapshot();

                    // 2. Process links
                    anchors.forEach(this.processLink);

                    // 3. See if cached snapshot is the same with lastSnapshot
                    // Same snapshot means content isn't changed by other plugins,
                    // Then we can overwrite the sanpshot here to avoid Undo plugin
                    // adding undo snapshot for the link title attribute change
                    if (snapshotBeforeProcessLink == event.lastSnapshot) {
                        // Overwrite last snapshot to suppress undo for the temp properties
                        event.lastSnapshot = this.editor.getContent(false, true);
                    }
                }

                break;

            case PluginEventType.ExtractContent:
                event.content = this.removeTempTooltip(event.content);
                break;
        }
    }

    private getSnapshot() {
        return this.editor.getContent(
            false /*triggerContentChangedEvent*/,
            true /*addSelectionMarker*/
        );
    }

    private resetAnchor = (a: HTMLAnchorElement) => {
        try {
            if (a.getAttribute(TEMP_TITLE)) {
                a.removeAttribute(TEMP_TITLE);
                a.removeAttribute('title');
            }
            a.removeEventListener('mouseup', this.onLinkMouseUp);
        } catch (e) {}
    };

    private processLink = (a: HTMLAnchorElement) => {
        if (!a.title && this.getTooltipCallback) {
            a.setAttribute(TEMP_TITLE, 'true');
            a.title = this.getTooltipCallback(this.tryGetHref(a));
        }
        a.addEventListener('mouseup', this.onLinkMouseUp);
    };

    private removeTempTooltip(content: string): string {
        return content.replace(
            TEMP_TITLE_REGEX,
            (...groups: string[]): string => {
                const firstValue = groups[1] == null ? '' : groups[1].trim();
                const secondValue = groups[3] == null ? '' : groups[3].trim();
                const thirdValue = groups[5] == null ? '' : groups[5].trim();

                // possible values (* is space, x, y, z are the first, second, and third value respectively):
                // *** (no values) << empty case
                // x** (first value only)
                // *x* (second value only)
                // **x (third value only)
                // x*y* (first and second)
                // x**z (first and third) << double spaces
                // *y*z (second and third)
                // x*y*z (all)
                if (
                    firstValue.length === 0 &&
                    secondValue.length === 0 &&
                    thirdValue.length === 0
                ) {
                    return '<a>';
                }

                let result;
                if (secondValue.length === 0) {
                    result = `${firstValue} ${thirdValue}`;
                } else {
                    result = `${firstValue} ${secondValue} ${thirdValue}`;
                }

                return `<a ${result.trim()}>`;
            }
        );
    }

    private onLinkMouseUp = (keyboardEvent: KeyboardEvent) => {
        const anchor = this.editor.getElementAtCursor('A', keyboardEvent.srcElement) as HTMLAnchorElement;
        if (this.onLinkClick) {
            this.onLinkClick(anchor, keyboardEvent);
            return;
        }

        let href: string;
        if (
            !Browser.isFirefox &&
            (href = this.tryGetHref(anchor)) &&
            (Browser.isMac ? keyboardEvent.metaKey : keyboardEvent.ctrlKey)
        ) {
            try {
                const target = this.target || '_blank';
                const window = this.editor.getDocument().defaultView;
                window.open(href, target);
            } catch {}
        }
    };

    /**
     * Try get href from an anchor element
     * The reason this is put in a try-catch is that
     * it has been seen that accessing href may throw an exception, in particular on IE/Edge
     */
    private tryGetHref(anchor: HTMLAnchorElement): string {
        try {
            return anchor ? anchor.href : null;
        } catch {}
    }
}
