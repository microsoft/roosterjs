import {
    matchLink,
    replaceTextBeforeCursorWithNode,
    cacheGetCursorEventData,
    clearCursorEventDataCache,
    defaultLinkMatchRules,
} from 'roosterjs-api';
import {
    LinkMatchOption,
    LinkMatchRule,
    PluginDomEvent,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-types';
import { LinkInlineElement } from 'roosterjs-dom';
import { Editor, EditorPlugin, browserData } from 'roosterjs-core';

// When user type, they may end a link with a puncatuation, i.e. www.bing.com;
// we need to trim off the trailing puncatuation before turning it to link match
const trailingPunctuationRegex = /[.()+={}\[\]\s:;"',>]+$/i;
const CUSTOMATTR_NAME = 'data-clickabletitle';
const CUSTOMATTR_VALUE = 'clickable';
const ATTRIBUTE_TITLE = 'title';
const MINIMUM_LENGTH = 5;
const KEY_SPACE = 32;
const KEY_ENTER = 13;

// An editor plugin that auto linkify text as users type
export default class HyperLink implements EditorPlugin {
    private editor: Editor;

    // Constructor
    // getTooltipCallback: A callback function to get tooltip text for an existing hyperlink. Default value is to return the href itself
    //                     If null, there will be no tooltip text.
    // target:             (Optional) Target window name for hyperlink. If null, will use "_blank"
    // linkMatchRules:     (Optional) Rules for matching hyperlink. If null, will use defaultLinkMatchRules
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

            case PluginEventType.MouseUp:
            case PluginEventType.MouseOver:
            case PluginEventType.MouseOut:
                let domEvent = event as PluginDomEvent;
                let inline =
                    domEvent.rawEvent && domEvent.rawEvent.target
                        ? this.editor.getInlineElementAtNode(domEvent.rawEvent.target as Node)
                        : null;
                if (inline && inline instanceof LinkInlineElement) {
                    // The event target is on a link
                    if (event.eventType == PluginEventType.MouseUp) {
                        this.onMouseUp(event, inline as LinkInlineElement);
                    } else if (this.getTooltipCallback) {
                        if (event.eventType == PluginEventType.MouseOver) {
                            this.onMouseOver(event, inline as LinkInlineElement);
                        } else {
                            /* PluginEventType.MouseOut */
                            this.onMouseOut(event, inline as LinkInlineElement);
                        }
                    }
                }
                break;
        }
    }

    private autoLink(event: PluginEvent) {
        let cursorData = cacheGetCursorEventData(event, this.editor);
        let wordBeforeCursor = cursorData ? cursorData.wordBeforeCursor : null;
        if (wordBeforeCursor && wordBeforeCursor.length > MINIMUM_LENGTH) {
            // Check for trailing punctuation
            let trailingPunctuations = wordBeforeCursor.match(trailingPunctuationRegex);
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

            let linkMatchRules = this.linkMatchRules || defaultLinkMatchRules;

            // Match and replace in editor
            let linkData = matchLink(linkCandidate, LinkMatchOption.Exact, linkMatchRules);
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

    // Handle mouse over to add tooltip (the title attribute on a link)
    private onMouseOver(event: PluginEvent, linkInline: LinkInlineElement): void {
        let anchor = linkInline.getContainerNode() as HTMLAnchorElement;
        let oldTitle = anchor.title;
        // Let's not overwrite the title if there is already one
        if (!oldTitle || anchor.hasAttribute(CUSTOMATTR_NAME)) {
            let tooltip = this.getTooltipCallback(this.tryGetHref(anchor));
            // Add the title and mark it
            anchor.title = tooltip;
            anchor.setAttribute(CUSTOMATTR_NAME, CUSTOMATTR_VALUE);
        }
    }

    // Handle mouse over to remove tooltip (the title attribute on a link)
    private onMouseOut(event: PluginEvent, linkInline: LinkInlineElement): void {
        let anchor = linkInline.getContainerNode() as HTMLAnchorElement;
        if (anchor.hasAttribute(CUSTOMATTR_NAME)) {
            anchor.removeAttribute(ATTRIBUTE_TITLE);
            anchor.removeAttribute(CUSTOMATTR_NAME);
        }
    }

    // Handle mouse up to open link in a separate window
    private onMouseUp(event: PluginEvent, linkInline: LinkInlineElement): void {
        let keyboardEvent = (event as PluginDomEvent).rawEvent as KeyboardEvent;
        let shouldOpenLink = browserData.isMac ? keyboardEvent.metaKey : keyboardEvent.ctrlKey;
        if (shouldOpenLink) {
            let href = this.tryGetHref(linkInline.getContainerNode() as HTMLAnchorElement);
            if (href) {
                let target = this.target || '_blank';
                window.open(href, target);
            }
        }
    }

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
