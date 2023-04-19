import { isCharacterValue, isCtrlOrMetaPressed, matchLink } from 'roosterjs-editor-dom';
import {
    ChangeSource,
    DOMEventHandler,
    EditorPlugin,
    IEditor,
    Keys,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';

/**
 * An editor plugin that show a tooltip for existing link
 */
export default class HyperLink implements EditorPlugin {
    private originalHref: string | null = null;
    private trackedLink: HTMLAnchorElement | null = null;
    private editor: IEditor | null = null;
    private disposer: (() => void) | null = null;

    /**
     * Create a new instance of HyperLink class
     * @param getTooltipCallback A callback function to get tooltip text for an existing hyperlink.
     * Default value is to return the href itself. If null, there will be no tooltip text.
     * @param target (Optional) Target window name for hyperlink. If null, will use "_blank"
     * @param onLinkClick (Optional) Open link callback (return false to use default behavior)
     */
    constructor(
        private getTooltipCallback: (href: string, a: HTMLAnchorElement) => string = href => href,
        private target?: string,
        private onLinkClick?: (anchor: HTMLAnchorElement, mouseEvent: MouseEvent) => boolean | void
    ) {}

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'Hyperlink';
    }

    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    public initialize(editor: IEditor): void {
        this.editor = editor;
        this.disposer = editor.addDomEventHandler({
            mouseover: <DOMEventHandler>this.onMouse,
            mouseout: <DOMEventHandler>this.onMouse,
            blur: <DOMEventHandler>this.onBlur,
        });
    }

    protected onMouse = (e: MouseEvent) => {
        const a = this.editor?.getElementAtCursor(
            'a[href]',
            <Node>e.target
        ) as HTMLAnchorElement | null;
        const href = a && this.tryGetHref(a);

        if (href) {
            this.editor?.setEditorDomAttribute(
                'title',
                e.type == 'mouseover' ? this.getTooltipCallback(href, a) : null
            );
        }
    };

    protected onBlur = (e: FocusEvent) => {
        if (this.trackedLink) {
            this.updateLinkHrefIfShouldUpdate();
        }

        this.resetLinkTracking();
    };

    /**
     * Dispose this plugin
     */
    public dispose(): void {
        if (this.disposer) {
            this.disposer();
            this.disposer = null;
        }
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    public onPluginEvent(event: PluginEvent): void {
        if (
            event.eventType == PluginEventType.MouseUp ||
            (event.eventType == PluginEventType.KeyUp &&
                (!this.isContentEditValue(event.rawEvent) || event.rawEvent.which == Keys.SPACE)) ||
            event.eventType == PluginEventType.ContentChanged
        ) {
            const anchor = this.editor?.getElementAtCursor(
                'A[href]',
                undefined /*startFrom*/,
                event
            ) as HTMLAnchorElement | null;

            const shouldCheckUpdateLink =
                (anchor && anchor !== this.trackedLink) ||
                event.eventType == PluginEventType.KeyUp ||
                event.eventType == PluginEventType.ContentChanged;

            if (
                event.eventType == PluginEventType.ContentChanged &&
                event.source == ChangeSource.Keyboard &&
                this.trackedLink != anchor &&
                anchor
            ) {
                // For Keyboard event that causes content change (mostly come from Content Model), this tracked list may be staled.
                // So we need to get an up-to-date link element
                // TODO: This is a temporary solution. Later when Content Model can fully take over this behavior, we can remove this code.
                this.trackedLink = anchor;
            }

            if (
                this.trackedLink &&
                (shouldCheckUpdateLink || this.tryGetHref(this.trackedLink) !== this.originalHref)
            ) {
                // If cursor has moved out of previously tracked link
                // update link href if display text doesn't match href anymore.
                if (shouldCheckUpdateLink) {
                    this.updateLinkHrefIfShouldUpdate();
                }

                // If the link's href value was edited, or the cursor has moved out of the
                // previously tracked link, stop tracking the link.
                this.resetLinkTracking();
            }

            // Cache link and href value if its href attribute currently matches its display text
            if (!this.trackedLink && anchor && this.doesLinkDisplayMatchHref(anchor)) {
                this.trackedLink = anchor;
                this.originalHref = this.tryGetHref(anchor);
            }
        }

        if (event.eventType == PluginEventType.MouseUp) {
            const anchor = this.editor?.getElementAtCursor(
                'A',
                <Node>event.rawEvent.srcElement
            ) as HTMLAnchorElement | null;

            if (anchor) {
                if (this.onLinkClick && this.onLinkClick(anchor, event.rawEvent) !== false) {
                    return;
                }

                let href: string | null;
                if (
                    (href = this.tryGetHref(anchor)) &&
                    isCtrlOrMetaPressed(event.rawEvent) &&
                    event.rawEvent.button === 0
                ) {
                    event.rawEvent.preventDefault();
                    try {
                        const target = this.target || '_blank';
                        const window = this.editor?.getDocument().defaultView;
                        window?.open(href, target);
                    } catch {}
                }
            }
        }
    }

    /**
     * Try get href from an anchor element
     * The reason this is put in a try-catch is that
     * it has been seen that accessing href may throw an exception, in particular on IE/Edge
     */
    private tryGetHref(anchor: HTMLAnchorElement): string | null {
        try {
            return anchor ? anchor.href : null;
        } catch {
            return null;
        }
    }

    /**
     * Determines if KeyboardEvent is meant to edit content
     */
    private isContentEditValue(event: KeyboardEvent): boolean {
        return (
            isCharacterValue(event) || event.which == Keys.BACKSPACE || event.which == Keys.DELETE
        );
    }

    /**
     * Updates the href of the tracked link if the display text doesn't match href anymore
     */
    private updateLinkHrefIfShouldUpdate() {
        if (this.trackedLink && !this.doesLinkDisplayMatchHref(this.trackedLink)) {
            this.updateLinkHref();
        }
    }

    /**
     * Clears the tracked link and its original href value so that it's back to default state
     */
    private resetLinkTracking() {
        this.trackedLink = null;
        this.originalHref = '';
    }

    /**
     * Compares the normalized URL of inner text of element to its href to see if they match.
     */
    private doesLinkDisplayMatchHref(element: HTMLAnchorElement): boolean {
        if (element) {
            let display = element.innerText.trim();

            // We first escape the display text so that any text passed into the regex is not
            // treated as a special character.
            let escapedDisplay = display.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            let rule = new RegExp(`^(?:https?:\\/\\/)?${escapedDisplay}\\/?`, 'i');
            let href = this.tryGetHref(element);
            if (href !== null) {
                return rule.test(href);
            }
        }

        return false;
    }

    /**
     * Update href of an element in place to new display text if it's a valid URL
     */
    private updateLinkHref() {
        if (this.trackedLink) {
            let linkData = matchLink(this.trackedLink.innerText.trim());
            if (linkData !== null) {
                this.editor?.addUndoSnapshot(() => {
                    this.trackedLink!.href = linkData!.normalizedUrl;
                });
            }
        }
    }
}
