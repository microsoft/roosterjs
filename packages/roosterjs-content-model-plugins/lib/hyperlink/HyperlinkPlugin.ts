import { matchLink } from 'roosterjs-content-model-api';
import type { HyperlinkToolTip } from './HyperlinkToolTip';
import type {
    DOMHelper,
    EditorPlugin,
    IEditor,
    PluginEvent,
    LinkData,
} from 'roosterjs-content-model-types';

const defaultToolTipCallback: HyperlinkToolTip = (url: string) => url;

/**
 * Hyperlink plugin does the following jobs for a hyperlink in editor:
 * 1. When hover on a link, show a tool tip
 * 2. When Ctrl+Click on a link, open a new window with the link
 * 3. When type directly on a link whose text matches its link url, update the link url with the link text
 */
export class HyperlinkPlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    private domHelper: DOMHelper | null = null;
    private isMac: boolean = false;
    private disposer: (() => void) | null = null;

    private currentNode: Node | null = null;
    private currentLink: HTMLAnchorElement | null = null;

    /**
     * Create a new instance of HyperLink class
     * @param tooltip Tooltip to show when mouse hover over a link
     * Default value is to return the href itself. If null, there will be no tooltip text.
     * @param target (Optional) Target window name for hyperlink. If null, will use "_blank"
     * @param onLinkClick (Optional) Open link callback (return false to use default behavior)
     */
    constructor(
        private tooltip: HyperlinkToolTip = defaultToolTipCallback,
        private target?: string,
        private onLinkClick?: (anchor: HTMLAnchorElement, mouseEvent: MouseEvent) => boolean | void
    ) {}

    /**
     * Get a friendly name of this plugin
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
        this.domHelper = editor.getDOMHelper();
        this.isMac = !!editor.getEnvironment().isMac;
        this.disposer = editor.attachDomEvent({
            mouseover: { beforeDispatch: this.onMouse },
            mouseout: { beforeDispatch: this.onMouse },
        });
    }

    /**
     * Dispose this plugin
     */
    public dispose(): void {
        if (this.disposer) {
            this.disposer();
            this.disposer = null;
        }

        this.currentNode = null;
        this.currentLink = null;
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    public onPluginEvent(event: PluginEvent): void {
        let matchedLink: LinkData | null;

        if (event.eventType == 'keyDown') {
            const selection = this.editor?.getDOMSelection();
            const node =
                selection?.type == 'range' ? selection.range.commonAncestorContainer : null;

            if (node && node != this.currentNode) {
                this.currentNode = node;
                this.currentLink = null;

                this.runWithHyperlink(node, (href, a) => {
                    if (
                        node.textContent &&
                        (matchedLink = matchLink(node.textContent)) &&
                        matchedLink.normalizedUrl == href
                    ) {
                        this.currentLink = a;
                    }
                });
            }
        } else if (event.eventType == 'keyUp') {
            const selection = this.editor?.getDOMSelection();
            const node =
                selection?.type == 'range' ? selection.range.commonAncestorContainer : null;

            if (
                node &&
                node == this.currentNode &&
                this.currentLink &&
                this.currentLink.contains(node) &&
                node.textContent &&
                (matchedLink = matchLink(node.textContent))
            ) {
                this.currentLink.setAttribute('href', matchedLink.normalizedUrl);
            }
        } else if (event.eventType == 'mouseUp' && event.isClicking) {
            this.runWithHyperlink(event.rawEvent.target as Node, (href, anchor) => {
                if (
                    !this.onLinkClick?.(anchor, event.rawEvent) &&
                    this.isCtrlOrMetaPressed(event.rawEvent) &&
                    event.rawEvent.button === 0
                ) {
                    event.rawEvent.preventDefault();

                    const target = this.target || '_blank';
                    const window = this.editor?.getDocument().defaultView;

                    try {
                        window?.open(href, target);
                    } catch {}
                }
            });
        } else if (event.eventType == 'contentChanged') {
            this.domHelper?.setDomAttribute('title', null /*value*/);
        }
    }

    protected onMouse = (e: Event) => {
        this.runWithHyperlink(e.target as Node, (href, a) => {
            const tooltip =
                e.type == 'mouseover'
                    ? typeof this.tooltip == 'function'
                        ? this.tooltip(href, a)
                        : this.tooltip
                    : null;
            this.domHelper?.setDomAttribute('title', tooltip);
        });
    };

    private runWithHyperlink(node: Node, callback: (href: string, a: HTMLAnchorElement) => void) {
        const a = this.domHelper?.findClosestElementAncestor(
            node,
            'a[href]'
        ) as HTMLAnchorElement | null;
        const href = a?.getAttribute('href');

        if (href && a) {
            callback(href, a);
        }
    }

    private isCtrlOrMetaPressed(event: KeyboardEvent | MouseEvent): boolean {
        return this.isMac ? event.metaKey : event.ctrlKey;
    }
}
