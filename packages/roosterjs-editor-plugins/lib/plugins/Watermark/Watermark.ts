import { applyFormat, getEntitySelector, getTagOfNode } from 'roosterjs-editor-dom';
import { insertEntity } from 'roosterjs-editor-api';
import {
    DefaultFormat,
    EditorPlugin,
    Entity,
    EntityOperation,
    IEditor,
    PluginEvent,
    PluginEventType,
    ContentPosition,
} from 'roosterjs-editor-types';

const ENTITY_TYPE = 'WATERMARK_WRAPPER';

/**
 * A watermark plugin to manage watermark string for roosterjs
 */
export default class Watermark implements EditorPlugin {
    private editor: IEditor | null = null;
    private disposer: (() => void) | null = null;
    private format: DefaultFormat;

    /**
     * Create an instance of Watermark plugin
     * @param watermark The watermark string
     */
    constructor(private watermark: string, format?: DefaultFormat, private customClass?: string) {
        this.format = format || {
            fontSize: '14px',
            textColors: {
                lightModeColor: '#AAAAAA',
                darkModeColor: '#6B6B6B',
            },
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
    initialize(editor: IEditor) {
        this.editor = editor;
        this.disposer = this.editor.addDomEventHandler({
            focus: this.showHideWatermark,
            blur: this.showHideWatermark,
        });
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.disposer?.();
        this.disposer = null;
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (
            event.eventType == PluginEventType.EditorReady ||
            (event.eventType == PluginEventType.ContentChanged &&
                (<Entity>event.data)?.type != ENTITY_TYPE)
        ) {
            this.showHideWatermark();
        } else if (
            event.eventType == PluginEventType.EntityOperation &&
            event.entity.type == ENTITY_TYPE &&
            this.editor
        ) {
            const {
                operation,
                entity: { wrapper },
            } = event;
            if (operation == EntityOperation.ReplaceTemporaryContent) {
                this.removeWatermark(wrapper);
            } else if (event.operation == EntityOperation.NewEntity) {
                applyFormat(
                    wrapper,
                    this.format,
                    this.editor.isDarkMode(),
                    this.editor.getDarkColorHandler()
                );
                wrapper.spellcheck = false;
            }
        }
    }

    private showHideWatermark = () => {
        if (!this.editor) {
            return;
        }
        const hasFocus = this.editor.hasFocus();
        const watermarks = this.editor.queryElements(getEntitySelector(ENTITY_TYPE));
        const isShowing = watermarks.length > 0;

        if (hasFocus && isShowing) {
            watermarks.forEach(this.removeWatermark);
            this.editor.focus();
        } else if (!hasFocus && !isShowing && this.editor.isEmpty()) {
            const newEntity = insertEntity(
                this.editor,
                ENTITY_TYPE,
                this.editor.getDocument().createTextNode(this.watermark),
                false /*isBlock*/,
                false /*isReadonly*/,
                ContentPosition.Begin
            );
            if (this.customClass) {
                newEntity.wrapper.classList.add(this.customClass);
            }
        }
    };

    private removeWatermark = (wrapper: HTMLElement) => {
        const parentNode = wrapper.parentNode;
        parentNode?.removeChild(wrapper);

        // After remove watermark node, if it leaves an empty DIV, append a BR node into it to make it a regular empty line
        if (
            parentNode &&
            this.editor?.contains(parentNode) &&
            getTagOfNode(parentNode) == 'DIV' &&
            !parentNode.firstChild
        ) {
            parentNode.appendChild(this.editor.getDocument().createElement('BR'));
        }
    };
}
