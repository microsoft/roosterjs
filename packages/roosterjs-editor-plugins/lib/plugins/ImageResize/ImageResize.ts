import ImageResizeHandler from './ImageResizeHandler';
import { matchesSelector, safeInstanceOf } from 'roosterjs-editor-dom';
import {
    ChangeSource,
    EditorPlugin,
    IEditor,
    PluginEvent,
    PluginEventType,
    EntityOperation,
    Entity,
    Keys,
} from 'roosterjs-editor-types';

const SHIFT_KEYCODE = 16;
const CTRL_KEYCODE = 17;
const ALT_KEYCODE = 18;

/**
 * ImageResize plugin provides the ability to resize an inline image in editor
 */
export default class ImageResize implements EditorPlugin {
    private editor: IEditor;
    private disposer: () => void;
    private resizeHandler: ImageResizeHandler;

    /**
     * Create a new instance of ImageResize
     * @param minWidth Minimum width of image when resize in pixel, default value is 10
     * @param minHeight Minimum height of image when resize in pixel, default value is 10
     * @param selectionBorderColor Color of resize border and handles, default value is #DB626C
     * @param forcePreserveRatio Whether always preserve width/height ratio when resize, default value is false
     * @param resizableImageSelector Selector for picking which image is resizable (e.g. for all images not placeholders), note
     * that the tag must be IMG regardless what the selector is
     */
    constructor(
        private minWidth: number = 10,
        private minHeight: number = 10,
        private selectionBorderColor: string = '#DB626C',
        private forcePreserveRatio: boolean = false,
        private resizableImageSelector: string = 'img'
    ) {}

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'ImageResize';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.disposer = editor.addDomEventHandler('blur', this.onBlur);
        this.resizeHandler = new ImageResizeHandler(
            this.editor,
            this.minWidth,
            this.minHeight,
            this.selectionBorderColor,
            this.forcePreserveRatio
        );
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.resizeHandler.setCurrentImage(null);
        this.resizeHandler = null;
        this.disposer();
        this.disposer = null;
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(e: PluginEvent) {
        switch (e.eventType) {
            case PluginEventType.MouseDown:
                this.resizeHandler.setCurrentImage(null);
                break;

            case PluginEventType.MouseUp:
                const target = e.rawEvent.target;
                if (
                    e.isClicking &&
                    safeInstanceOf(target, 'HTMLImageElement') &&
                    target.isContentEditable &&
                    matchesSelector(target, this.resizableImageSelector)
                ) {
                    this.resizeHandler.setCurrentImage(target);
                }

                break;

            case PluginEventType.KeyDown:
                const key = e.rawEvent.which;
                if (key == Keys.DELETE || key == Keys.BACKSPACE) {
                    const wrapper = this.resizeHandler.getResizeWrapper();
                    if (wrapper) {
                        this.editor.addUndoSnapshot(() => {
                            this.editor.deleteNode(wrapper);
                            this.resizeHandler.setCurrentImage(null);
                        });
                        e.rawEvent.preventDefault();
                    }
                } else if (key != SHIFT_KEYCODE && key != CTRL_KEYCODE && key != ALT_KEYCODE) {
                    this.resizeHandler.setCurrentImage(null, true /*selectImage*/);
                }
                break;

            case PluginEventType.ContentChanged:
                if (
                    !(
                        e.source == ChangeSource.ImageResize ||
                        (e.source == ChangeSource.InsertEntity &&
                            this.resizeHandler.isHandlerEntity(<Entity>e.data))
                    )
                ) {
                    this.resizeHandler.setCurrentImage(null);
                    this.resizeHandler.removeWrappers();
                }

                break;

            case PluginEventType.EntityOperation:
                if (this.resizeHandler.isHandlerEntity(e.entity)) {
                    if (e.operation == EntityOperation.ReplaceTemporaryContent) {
                        this.resizeHandler.removeWrappers(e.entity.wrapper);
                    } else if (e.operation == EntityOperation.Click) {
                        e.rawEvent.preventDefault();
                    }
                }
                break;
        }
    }

    /**
     * @deprecated
     */
    showResizeHandle(img: HTMLImageElement) {
        this.resizeHandler.setCurrentImage(img);
    }

    /**
     * @deprecated
     */
    hideResizeHandle(selectImageAfterUnSelect?: boolean) {
        this.resizeHandler.setCurrentImage(null);
    }

    private onBlur = () => {
        this.resizeHandler.setCurrentImage(null);
    };
}
