import { Browser } from 'roosterjs-editor-dom';
import { Editor, EditorPlugin, isCtrlOrMetaPressed } from 'roosterjs-editor-core';
import { PluginEvent, PluginEventType } from 'roosterjs-editor-types';

/**
 * An editor plugin that show a tooltip for existing link
 */
export default class HyperLink implements EditorPlugin {
    private editor: Editor;
    private disposer: () => void;

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
    public initialize(editor: Editor): void {
        this.editor = editor;
        this.disposer =
            this.getTooltipCallback &&
            editor.addDomEventHandler({ mouseover: this.onMouse, mouseout: this.onMouse });
    }

    protected onMouse = (e: MouseEvent) => {
        const a = this.editor.getElementAtCursor('a[href]', <Node>e.target) as HTMLAnchorElement;
        const href = this.tryGetHref(a);

        if (href) {
            this.editor.setEditorDomAttribute(
                'title',
                e.type == 'mouseover' ? this.getTooltipCallback(href, a) : null
            );
        }
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
        if (event.eventType == PluginEventType.MouseUp) {
            const anchor = this.editor.getElementAtCursor(
                'A',
                <Node>event.rawEvent.srcElement
            ) as HTMLAnchorElement;

            if (anchor) {
                if (this.onLinkClick && this.onLinkClick(anchor, event.rawEvent) !== false) {
                    return;
                }

                let href: string;
                if (
                    !Browser.isFirefox &&
                    (href = this.tryGetHref(anchor)) &&
                    isCtrlOrMetaPressed(event.rawEvent) &&
                    event.rawEvent.button === 0
                ) {
                    try {
                        const target = this.target || '_blank';
                        const window = this.editor.getDocument().defaultView;
                        window.open(href, target);
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
    private tryGetHref(anchor: HTMLAnchorElement): string {
        try {
            return anchor ? anchor.href : null;
        } catch {}
    }
}
