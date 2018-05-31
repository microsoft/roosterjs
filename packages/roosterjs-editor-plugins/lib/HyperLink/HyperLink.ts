import {
    matchLink,
    replaceTextBeforeCursorWithNode,
    cacheGetCursorEventData,
    clearCursorEventDataCache,
} from 'roosterjs-editor-api';
import {
    ChangeSource,
    ContentChangedEvent,
    ExtractContentEvent,
    PluginDomEvent,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';
import { Editor, EditorPlugin, browserData } from 'roosterjs-editor-core';

// When user type, they may end a link with a puncatuation, i.e. www.bing.com;
// we need to trim off the trailing puncatuation before turning it to link match
const TRAILING_PUNCTUATION_REGEX = /[.()+={}\[\]\s:;"',>]+$/i;
const TEMP_TITLE = 'istemptitle';
const TEMP_TITLE_REGEX = new RegExp(`<a\\s+([^>]*\\s+)?(title|${TEMP_TITLE})="[^"]*"\\s*([^>]*)\\s+(title|${TEMP_TITLE})="[^"]*"(\\s+[^>]*)?>`, 'gm');
const MINIMUM_LENGTH = 5;
const KEY_BACKSPACE = 8;
const KEY_SPACE = 32;
const KEY_ENTER = 13;

/**
 * An editor plugin that auto linkify text as users type and show a tooltip for existing link
 */
export default class HyperLink implements EditorPlugin {
    private editor: Editor;
    private backspaceToUndo: boolean;
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

    public initialize(editor: Editor): void {
        this.editor = editor;

        if (browserData.isIE) {
            this.editor
                .getDocument()
                .execCommand(
                    'AutoUrlDetect',
                    false /* shouldDisplayUserInterface */,
                    false /* value */
                );
        }
    }

    public dispose(): void {
        this.forEachHyperLink(this.resetAnchor.bind(this));
        this.editor = null;
    }

    // Handle the event
    public onPluginEvent(event: PluginEvent): void {
        let keyboardEvent = (event as PluginDomEvent).rawEvent as KeyboardEvent;
        if (
            this.backspaceToUndo &&
            (event.eventType == PluginEventType.KeyDown ||
                event.eventType == PluginEventType.MouseDown ||
                event.eventType == PluginEventType.ContentChanged)
        ) {
            this.backspaceToUndo = false;
            if (
                event.eventType == PluginEventType.KeyDown &&
                keyboardEvent.which == KEY_BACKSPACE
            ) {
                keyboardEvent.preventDefault();
                this.editor.undo();
            }
        }

        switch (event.eventType) {
            case PluginEventType.KeyDown:
                if (keyboardEvent.which == KEY_ENTER || keyboardEvent.which == KEY_SPACE) {
                    this.autoLink(event);
                }
                break;

            case PluginEventType.ContentChanged:
                let contentChangedEvent = event as ContentChangedEvent;
                if (contentChangedEvent.source == ChangeSource.Paste) {
                    this.autoLink(event);
                } else if (contentChangedEvent.source == ChangeSource.CreateLink) {
                    this.resetAnchor(contentChangedEvent.data as HTMLAnchorElement);
                }

                if (contentChangedEvent.source != ChangeSource.AutoLink) {
                    this.forEachHyperLink(this.processLink.bind(this));
                }
                break;

            case PluginEventType.ExtractContent:
                let extractContentEvent = event as ExtractContentEvent;
                extractContentEvent.content = this.removeTempTooltip(extractContentEvent.content);
                break;
        }
    }

    private resetAnchor(a: HTMLAnchorElement) {
        try {
            if (a.getAttribute(TEMP_TITLE)) {
                a.removeAttribute(TEMP_TITLE);
                a.removeAttribute('title');
            }
            a.removeEventListener('mouseup', this.onClickLink);
        } catch (e) {}
    }

    private autoLink(event: PluginEvent) {
        let cursorData = cacheGetCursorEventData(event, this.editor);
        let wordBeforeCursor = cursorData ? cursorData.wordBeforeCursor : null;
        if (wordBeforeCursor && wordBeforeCursor.length > MINIMUM_LENGTH) {
            // Check for trailing punctuation
            let trailingPunctuations = wordBeforeCursor.match(TRAILING_PUNCTUATION_REGEX);
            let trailingPunctuation =
                trailingPunctuations && trailingPunctuations.length > 0
                    ? trailingPunctuations[0]
                    : null;

            // Compute the link candidate
            let linkCandidate = wordBeforeCursor.substring(
                0,
                trailingPunctuation
                    ? wordBeforeCursor.length - trailingPunctuation.length
                    : wordBeforeCursor.length
            );

            // Match and replace in editor
            let linkData = matchLink(linkCandidate);
            if (linkData) {
                let anchor = this.editor.getDocument().createElement('A') as HTMLAnchorElement;
                anchor.textContent = linkData.originalUrl;
                anchor.href = linkData.normalizedUrl;

                this.editor.runAsync(() => {
                    this.editor.addUndoSnapshot();
                    let replaced = replaceTextBeforeCursorWithNode(
                        this.editor,
                        linkData.originalUrl,
                        anchor,
                        false /* exactMatch */,
                        cursorData
                    );
                    if (replaced) {
                        // The content at cursor has changed. Should also clear the cursor data cache
                        clearCursorEventDataCache(event);
                        this.processLink(anchor);
                        this.editor.addUndoSnapshot();
                        this.editor.triggerContentChangedEvent(ChangeSource.AutoLink, anchor);
                        this.backspaceToUndo = true;
                    }
                });
            }
        }
    }

    private processLink(a: HTMLAnchorElement) {
        if (!a.title && this.getTooltipCallback) {
            a.setAttribute(TEMP_TITLE, 'true');
            a.title = this.getTooltipCallback(this.tryGetHref(a));
        }
        a.addEventListener('mouseup', this.onClickLink);
    }

    private removeTempTooltip(content: string): string {
        return content.replace(TEMP_TITLE_REGEX, (...groups: string[]): string => {
            const firstValue = groups[1] == null ? "" : groups[1].trim();
            const secondValue = groups[3] == null ? "" : groups[3].trim();
            const thirdValue = groups[5] == null ? "" : groups[5].trim();

            // possible values (* is space, x, y, z are the first, second, and third value respectively):
            // *** (no values) << empty case
            // x** (first value only)
            // *x* (second value only)
            // **x (third value only)
            // x*y* (first and second)
            // x**z (first and third) << double spaces
            // *y*z (second and third)
            // x*y*z (all)
            if (firstValue.length === 0 && secondValue.length === 0 && thirdValue.length === 0) {
                return "<a>";
            }

            let result;
            if (secondValue.length === 0) {
                result = `${firstValue} ${thirdValue}`;
            } else {
                result = `${firstValue} ${secondValue} ${thirdValue}`;
            }

            return `<a ${result.trim()}>`;
        });
    }

    private onClickLink = (keyboardEvent: KeyboardEvent) => {
        let href: string;
        if (
            !browserData.isFirefox &&
            (href = this.tryGetHref(keyboardEvent.srcElement)) &&
            (browserData.isMac ? keyboardEvent.metaKey : keyboardEvent.ctrlKey)
        ) {
            let target = this.target || '_blank';
            this.editor.getDocument().defaultView.window.open(href, target);
        }
    };

    // Try get href from an anchor element
    // The reason this is put in a try-catch is that
    // it has been seen that accessing href may throw an exception, in particular on IE/Edge
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

    private forEachHyperLink(callback: (a: HTMLAnchorElement) => void) {
        this.editor.queryElements('a[href]', callback);
    }
}
