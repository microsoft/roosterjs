import { Browser } from 'roosterjs-editor-dom';
import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import { PluginEvent, PluginEventType } from 'roosterjs-editor-types';

/**
 * An editor plugin that show a tooltip for existing link
 */
export default class HyperLink implements EditorPlugin {
    public name: 'HyperLink';
    private editor: Editor;
    private disposers: (() => void)[];

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
        this.disposers = this.getTooltipCallback
            ? [
                  editor.addDomEventHandler('mouseover', this.onMouse),
                  editor.addDomEventHandler('mouseout', this.onMouse),
              ]
            : [];
    }

    private onMouse = (e: MouseEvent) => {
        let href = this.tryGetHref(e.srcElement);
        if (href) {
            this.editor.setEditorDomAttribute(
                'title',
                e.type == 'mouseover' ? this.getTooltipCallback(href) : null
            );
        }
    };

    /**
     * Dispose this plugin
     */
    public dispose(): void {
        this.disposers.forEach(disposer => disposer());
        this.disposers = null;
        this.editor = null;
    }

    /**
     * Handle plugin events
     * @param event The event object
     */
    public onPluginEvent(event: PluginEvent): void {
        let href: string;
        if (
            !Browser.isFirefox &&
            event.eventType == PluginEventType.MouseUp &&
            (Browser.isMac ? event.rawEvent.metaKey : event.rawEvent.ctrlKey) &&
            (href = this.tryGetHref(event.rawEvent.srcElement))
        ) {
            let window = this.editor.getDocument().defaultView;
            try {
                window.open(href, this.target || '_blank');
            } catch {}
        }
    }

    /**
     * Try get href from an anchor element
     * The reason this is put in a try-catch is that
     * it has been seen that accessing href may throw an exception, in particular on IE/Edge
     */
    private tryGetHref(element: Element): string {
        let href: string = null;
        try {
            let a = this.editor.getElementAtCursor('a[href]', element);

            if (a) {
                href = (<HTMLAnchorElement>a).href;
            }
        } catch (error) {
            // Not do anything for the moment
        }

        return href;
    }
}
