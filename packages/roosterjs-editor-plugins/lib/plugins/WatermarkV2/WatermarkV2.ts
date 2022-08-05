import {
    EditorPlugin,
    Entity,
    IEditor,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';
import { kebabCase } from './utils';

const ENTITY_TYPE = 'WATERMARK_WRAPPER';
const WATERMARK_ATTR = 'data-rooster-watermark';
const STYLE_ID = 'watermarkStyle';

const DEFAULT_STYLE = {
    color: 'rgba(0,0,0,0.3)',
    position: 'absolute',
    cursor: 'text',
};

/**
 * Yet another Watermark plugin
 */
export default class WatermarkV2 implements EditorPlugin {
    private editor: IEditor;

    /**
     * Create an instance of Watermark plugin
     * @param watermark The watermark string
     * @param style watermark style
     */
    constructor(private watermark: string, private readonly style?: CSSStyleDeclaration) {
        this.style = {
            ...DEFAULT_STYLE,
            ...this.style,
            content: `attr(${WATERMARK_ATTR})`, // key trick
        };
    }

    /**
     * Get a friendly name of this plugin
     */
    getName() {
        return 'WatermarkV2';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;

        const doc = this.editor.getDocument();
        let styleElement = doc.getElementById(STYLE_ID) as HTMLStyleElement;
        if (!styleElement) {
            styleElement = doc.createElement('style');
            doc.head.appendChild(styleElement);
            styleElement.id = STYLE_ID;
        }
        const cssText = Object.keys(this.style)
            .map(key => `${kebabCase(key)}:${this.style[key as any]}`)
            .join(';');
        const className = this.editor.getEditorDomAttribute('class').split(' ')[0];
        let selector = 'div';
        if (className) {
            selector = `.${className}`;
        } else {
            const id = this.editor.getEditorDomAttribute('id');
            if (id) {
                selector = `#${id}`;
            }
        }
        const rule = `${selector}[${WATERMARK_ATTR}]:before {${cssText};}`;
        styleElement.sheet.insertRule(rule);
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        const styleElement = this.editor.getDocument().getElementById(STYLE_ID) as HTMLStyleElement;
        if (styleElement?.sheet?.cssRules) {
            while (styleElement.sheet.cssRules.length > 0) {
                styleElement.sheet.deleteRule(0);
            }
        }
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (
            [PluginEventType.EditorReady, PluginEventType.Input].includes(
                event.eventType as PluginEventType
            ) ||
            (event.eventType == PluginEventType.ContentChanged &&
                (<Entity>event.data)?.type != ENTITY_TYPE)
        ) {
            this.showHideWatermark();
        }
    }

    private showHideWatermark = () => {
        this.editor.setEditorDomAttribute(
            WATERMARK_ATTR,
            isEmpty(this.editor) ? this.watermark : null
        );
    };
}

function isEmpty(editor: IEditor) {
    if (editor.isEmpty()) {
        return editor.queryElements('br').length <= 1;
    }
    return false;
}
