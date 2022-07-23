import {
    EditorPlugin,
    Entity,
    IEditor,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';
import { kebabCase } from './utils';

const ENTITY_TYPE = 'PLACEHOLDER_WRAPPER';
const PLACEHOLDER_ATTR = 'data-rooster-placeholder';
const STYLE_ID = 'placeholderStyle';

const DEFAULT_STYLE = {
    color: 'rgba(0,0,0,0.3)',
    position: 'absolute',
    cursor: 'text',
};

/**
 * A placeholder plugin (yet another Watermark plugin)
 */
export default class Placeholder implements EditorPlugin {
    private editor: IEditor;

    /**
     * Create an instance of Placeholder plugin
     * @param placeholder The placeholder string
     * @param style placeholder style
     */
    constructor(private placeholder: string, private readonly style?: CSSStyleDeclaration) {
        this.style = {
            ...DEFAULT_STYLE,
            ...this.style,
            content: `attr(${PLACEHOLDER_ATTR})`, // key trick
        };
    }

    /**
     * Get a friendly name of this plugin
     */
    getName() {
        return 'Placeholder';
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
        const rule = `${selector}[${PLACEHOLDER_ATTR}]:before {${cssText};}`;
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
            this.showHidePlaceholder();
        }
    }

    private showHidePlaceholder = () => {
        this.editor.setEditorDomAttribute(
            PLACEHOLDER_ATTR,
            isEmpty(this.editor) ? this.placeholder : null
        );
    };
}

function isEmpty(editor: IEditor) {
    if (editor.isEmpty()) {
        return editor.queryElements('br').length <= 1;
    }
    return false;
}
