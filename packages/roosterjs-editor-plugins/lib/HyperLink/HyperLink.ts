import { ChangeSource, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { Browser } from 'roosterjs-editor-dom';
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
     * @param linkMatchRules (Optional) Rules for matching hyperlink. If null, will use defaultLinkMatchRules
     */
    constructor(
        private getTooltipCallback: (href: string) => string = href => href,
        private target?: string
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

                this.editor.queryElements('a[href]', this.processLink);
                break;

            case PluginEventType.ExtractContent:
                event.content = this.removeTempTooltip(event.content);
                break;
        }
    }

    private resetAnchor = (a: HTMLAnchorElement) => {
        try {
            if (a.getAttribute(TEMP_TITLE)) {
                a.removeAttribute(TEMP_TITLE);
                a.removeAttribute('title');
            }
            a.removeEventListener('mouseup', this.onClickLink);
        } catch (e) {}
    };

    private processLink = (a: HTMLAnchorElement) => {
        if (!a.title && this.getTooltipCallback) {
            a.setAttribute(TEMP_TITLE, 'true');
            a.title = this.getTooltipCallback(this.tryGetHref(a));
        }
        a.addEventListener('mouseup', this.onClickLink);
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

    private onClickLink = (keyboardEvent: KeyboardEvent) => {
        let href: string;
        if (
            !Browser.isFirefox &&
            (href = this.tryGetHref(keyboardEvent.srcElement)) &&
            (Browser.isMac ? keyboardEvent.metaKey : keyboardEvent.ctrlKey)
        ) {
            let target = this.target || '_blank';
            let window = this.editor.getDocument().defaultView;
            try {
                window.open(href, target);
            } catch {}
        }
    };

    /**
     * Try get href from an anchor element
     * The reason this is put in a try-catch is that
     * it has been seen that accessing href may throw an exception, in particular on IE/Edge
     */
    private tryGetHref(element: Element): string {
        let href: string = null;
        try {
            do {
                if (element.tagName == 'A') {
                    href = (<HTMLAnchorElement>element).href;
                    break;
                }
                element = element.parentElement;
            } while (this.editor.contains(element));
        } catch (error) {
            // Not do anything for the moment
        }

        return href;
    }
}
