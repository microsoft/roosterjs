import {
    matchLink,
    replaceTextBeforeCursorWithNode,
    cacheGetCursorEventData,
    clearCursorEventDataCache,
} from 'roosterjs-editor-api';
import {
    ContentChangedEvent,
    ExtractContentEvent,
    LinkMatchOption,
    LinkMatchRule,
    PluginDomEvent,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';
import { Editor, EditorPlugin, browserData } from 'roosterjs-editor-core';

// When user type, they may end a link with a puncatuation, i.e. www.bing.com;
// we need to trim off the trailing puncatuation before turning it to link match
const TRAILING_PUNCTUATION_REGEX = /[.()+={}\[\]\s:;"',>]+$/i;
const TEMP_TITLE_REGEX = /<a\s+([^>]*\s+)?(title|istemptitle)="[^"]*"\s*([^>]*)\s+(title|istemptitle)="[^"]*"(\s+[^>]*)?>/gm;
const TEMP_TITLE = 'istemptitle';
const MINIMUM_LENGTH = 5;
const KEY_SPACE = 32;
const KEY_ENTER = 13;

/**
 * An editor plugin that auto linkify text as users type and show a tooltip for existing link
 */
export default class HyperLink implements EditorPlugin {
    private editor: Editor;

    /**
     * Create a new instance of HyperLink class
     * @param getTooltipCallback A callback function to get tooltip text for an existing hyperlink.
     * Default value is to return the href itself. If null, there will be no tooltip text.
     * @param target (Optional) Target window name for hyperlink. If null, will use "_blank"
     * @param linkMatchRules (Optional) Rules for matching hyperlink. If null, will use defaultLinkMatchRules
     */
    constructor(
        private getTooltipCallback: (href: string) => string = href => href,
        private target?: string,
        private linkMatchRules?: LinkMatchRule[]
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
        this.editor = null;
    }

    // Handle the event
    public onPluginEvent(event: PluginEvent): void {
        switch (event.eventType) {
            case PluginEventType.KeyDown:
                let keyboardEvt = (event as PluginDomEvent).rawEvent as KeyboardEvent;
                if (keyboardEvt.which == KEY_ENTER || keyboardEvt.which == KEY_SPACE) {
                    this.autoLink(event);
                }
                break;

            case PluginEventType.ContentChanged:
                let contentChangedEvent = event as ContentChangedEvent;
                if (contentChangedEvent.source == 'Paste') {
                    this.autoLink(event);
                }

                let anchors = this.editor.queryContent('a[href]');
                for (let i = 0; i < anchors.length; i++) {
                    this.processLink(anchors[i] as HTMLAnchorElement);
                }
                break;

            case PluginEventType.ExtractContent:
                let extractContentEvent = event as ExtractContentEvent;
                extractContentEvent.content = this.removeTempTooltip(extractContentEvent.content);
                break;
        }
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
            let linkData = matchLink(linkCandidate, LinkMatchOption.Exact, this.linkMatchRules);
            if (linkData) {
                let anchor = this.editor.getDocument().createElement('A') as HTMLAnchorElement;
                anchor.textContent = linkData.originalUrl;
                anchor.href = linkData.normalizedUrl;

                this.editor.addUndoSnapshot();
                let replaced = replaceTextBeforeCursorWithNode(
                    this.editor,
                    linkData.originalUrl,
                    anchor,
                    trailingPunctuation ? false : true /* exactMatch */,
                    cursorData
                );
                if (replaced) {
                    // The content at cursor has changed. Should also clear the cursor data cache
                    clearCursorEventDataCache(event);
                    this.editor.triggerEvent(
                        {
                            eventType: PluginEventType.ContentChanged,
                            source: 'AutoLink',
                            data: anchor,
                        } as PluginEvent,
                        true /* broadcast */
                    );
                    this.editor.addUndoSnapshot();
                }
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
        return content.replace(TEMP_TITLE_REGEX, '<a $1$3$5>');
    }

    private onClickLink = (keyboardEvent: KeyboardEvent) => {
        let href: string;
        if (
            !browserData.isFirefox &&
            (href = this.tryGetHref(keyboardEvent.srcElement as HTMLAnchorElement)) &&
            (browserData.isMac ? keyboardEvent.metaKey : keyboardEvent.ctrlKey)
        ) {
            let target = this.target || '_blank';
            this.editor.getDocument().defaultView.window.open(href, target);
        }
    };

    // Try get href from an anchor element
    // The reason this is put in a try-catch is that
    // it has been seen that accessing href may throw an exception, in particular on IE/Edge
    private tryGetHref(anchor: HTMLAnchorElement): string {
        let href: string = null;
        try {
            href = anchor.href;
        } catch (error) {
            // Not do anything for the moment
        }

        return href;
    }
}
