import { ImageEditPluginV2 } from './ImageEditPluginV2';
import { LegacyImageEditPlugin } from './LegacyImageEditPlugin';
import type { ImageEditOptions } from './types/ImageEditOptions';
import type {
    EditorPlugin,
    IEditor,
    ImageEditOperation,
    ImageEditor,
    PluginEvent,
} from 'roosterjs-content-model-types';

const DefaultOptions: Partial<ImageEditOptions> = {
    borderColor: '#DB626C',
    minWidth: 10,
    minHeight: 10,
    preserveRatio: true,
    disableRotate: false,
    disableSideResize: false,
    onSelectState: ['resize', 'rotate'],
};

/**
 * ImageEdit plugin handles the following image editing features:
 * - Resize image
 * - Crop image
 * - Rotate image
 * - Flip image
 */
export class ImageEditPlugin implements ImageEditor, EditorPlugin {
    private imageEditPlugin: LegacyImageEditPlugin | ImageEditPluginV2 | null = null;
    protected options: ImageEditOptions;

    constructor(options?: ImageEditOptions) {
        this.options = { ...DefaultOptions, ...options };
    }

    /**
     * Get name of this plugin
     */
    getName() {
        return 'ImageEdit';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IEditor) {
        const isV2Enabled = editor.isExperimentalFeatureEnabled('ImageEditV2');
        this.imageEditPlugin = isV2Enabled
            ? new ImageEditPluginV2(this.options)
            : new LegacyImageEditPlugin(this.options);
        this.imageEditPlugin.initialize(editor);
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        this.imageEditPlugin?.dispose();
    }

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: PluginEvent) {
        this.imageEditPlugin?.onPluginEvent(event);
    }

    flipImage(direction: 'vertical' | 'horizontal'): void {
        this.imageEditPlugin?.flipImage(direction);
    }

    cropImage(): void {
        this.imageEditPlugin?.cropImage();
    }

    canRegenerateImage(image: HTMLImageElement): boolean {
        return !!this.imageEditPlugin?.canRegenerateImage(image);
    }

    rotateImage(angleRad: number): void {
        this.imageEditPlugin?.rotateImage(angleRad);
    }

    isOperationAllowed(operation: ImageEditOperation): boolean {
        return !!this.imageEditPlugin?.isOperationAllowed(operation);
    }
}
