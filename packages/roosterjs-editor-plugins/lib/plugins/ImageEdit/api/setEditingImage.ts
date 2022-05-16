import ImageEditPlugin from '../types/ImageEditPlugin';
import { IEditor, ImageEditOperation } from 'roosterjs-editor-types';
import type { CompatibleImageEditOperation } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * Set current image for edit. If there is already image in editing, it will quit editing mode and any pending editing
 * operation will be submitted
 * @param editor The editor object to set editing image to
 * @param image The image to edit
 * @param operation The editing operation
 */
export default function setEditingImage(
    editor: IEditor,
    image: HTMLImageElement,
    operation?: ImageEditOperation | CompatibleImageEditOperation
) {
    const switcher = getImageEditPluginHolder(editor).plugin;

    switcher?.setEditingImage(image, operation);
}

/**
 * Check if ImageEdit plugin is added to the given editor
 * @param editor The editor to check
 * @returns True if ImageEdit plugin is added to this editor, otherwise false
 */
export function hasImageEditPlugin(editor: IEditor) {
    return !!getImageEditPluginHolder(editor).plugin;
}

const IMAGE_EDIT_STATE_SWITCHER_KEY = '_ImageEditStateSwitcher';

/**
 * @internal
 */
export function setImageEditPlugin(editor: IEditor, switcher: ImageEditPlugin | null) {
    getImageEditPluginHolder(editor).plugin = switcher;
}

function getImageEditPluginHolder(editor: IEditor) {
    return editor.getCustomData(IMAGE_EDIT_STATE_SWITCHER_KEY, () => {
        return {
            plugin: <ImageEditPlugin>null,
        };
    });
}
