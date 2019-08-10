import { applyFormat, getTagOfNode, wrap } from 'roosterjs-editor-dom';
import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import {
    ChangeSource,
    PluginEvent,
    PluginEventType,
    ContentPosition,
    ContentChangedEvent,
    ExtractContentEvent,
    DefaultFormat,
} from 'roosterjs-editor-types';

const WATERMARK_SPAN_ID = '_rooster_watermarkSpan';
const WATERMARK_REGEX = new RegExp(
    `<span[^>]*id=['"]?${WATERMARK_SPAN_ID}['"]?[^>]*>[^<]*</span>`,
    'ig'
);

/**
 * A watermark plugin to manage watermark string for roosterjs
 */
export default class Watermark implements EditorPlugin {
    private editor: Editor;
    private isWatermarkShowing: boolean;
    private disposer: () => void;

    /**
     * Create an instance of Watermark plugin
     * @param watermark The watermark string
     */
    constructor(private watermark: string, private format?: DefaultFormat) {
        this.format = this.format || {
            fontSize: '14px',
            textColor: '#aaa',
        };
    }

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'Watermark';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: Editor) {
        this.editor = editor;
        this.showHideWatermark(false /*ignoreCachedState*/);
        this.disposer = this.editor.addDomEventHandler({
            focus: this.handleWatermark,
            blur: this.handleWatermark,
        });
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.disposer();
        this.disposer = null;
        this.hideWatermark();
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (event.eventType == PluginEventType.ContentChanged) {
            // When content is changed from setContent() API, current cached state
            // may not be accurate, so we ignore it
            this.showHideWatermark((<ContentChangedEvent>event).source == ChangeSource.SetContent);
        } else if (event.eventType == PluginEventType.ExtractContent && this.isWatermarkShowing) {
            this.removeWartermarkFromHtml(event as ExtractContentEvent);
        }
    }

    private handleWatermark = () => {
        this.showHideWatermark(false /*ignoreCachedState*/);
    };

    private showHideWatermark(ignoreCachedState: boolean) {
        if (this.editor.hasFocus() && (ignoreCachedState || this.isWatermarkShowing)) {
            this.hideWatermark();
            this.editor.focus();
        } else if (
            !this.editor.hasFocus() &&
            (ignoreCachedState || !this.isWatermarkShowing) &&
            this.editor.isEmpty(true /*trim*/)
        ) {
            this.showWatermark();
        }
    }

    private showWatermark() {
        let document = this.editor.getDocument();
        let watermarkNode = wrap(
            document.createTextNode(this.watermark),
            `<span id="${WATERMARK_SPAN_ID}"></span>`
        ) as HTMLElement;
        applyFormat(watermarkNode, this.format, this.editor.isDarkMode());
        this.editor.insertNode(watermarkNode, {
            position: ContentPosition.Begin,
            updateCursor: false,
            replaceSelection: false,
            insertOnNewLine: false,
        });
        this.isWatermarkShowing = true;
    }

    private hideWatermark() {
        this.editor.queryElements(`span[id="${WATERMARK_SPAN_ID}"]`, span => {
            let parentNode = span.parentNode;
            this.editor.deleteNode(span);

            // After remove watermark node, if it leaves an empty DIV, append a BR node into it to make it a regular empty line
            if (
                this.editor.contains(parentNode) &&
                getTagOfNode(parentNode) == 'DIV' &&
                !parentNode.firstChild
            ) {
                parentNode.appendChild(this.editor.getDocument().createElement('BR'));
            }
        });
        this.isWatermarkShowing = false;
    }

    private removeWartermarkFromHtml(event: ExtractContentEvent) {
        let content = event.content;
        content = content.replace(WATERMARK_REGEX, '');
        event.content = content;
    }
}
