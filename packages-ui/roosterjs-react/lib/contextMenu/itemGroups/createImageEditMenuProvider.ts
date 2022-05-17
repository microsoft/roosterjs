import ContextMenuItem from '../types/ContextMenuItem';
import createContextMenuProvider from '../utils/createContextMenuProvider';
import { ImageEditMenuItemStringKey } from '../types/ContextMenuItemStringKeys';
import { LocalizedStrings } from '../../common/type/LocalizedStrings';
import { safeInstanceOf } from 'roosterjs-editor-dom';
import {
    ExperimentalFeatures,
    IEditor,
    ImageEditOperation,
    EditorPlugin,
} from 'roosterjs-editor-types';
import {
    canRegenerateImage,
    setEditingImage,
    hasImageEditPlugin,
} from 'roosterjs-editor-plugins/lib/ImageEdit';

const ImageAltTextMenuItem: ContextMenuItem<ImageEditMenuItemStringKey> = {
    key: 'menuNameImageAltText',
    unlocalizedText: 'Add alternate text',
    onClick: (editor, node) => {},
};

const ImageResizeMenuItem: ContextMenuItem<ImageEditMenuItemStringKey> = {
    key: 'menuNameImageResize',
    unlocalizedText: 'Size',
    onClick: () => {},
};

const ImageCropMenuItem: ContextMenuItem<ImageEditMenuItemStringKey> = {
    key: 'menuNameImageCrop',
    unlocalizedText: 'Crop image',
    shouldShow: (editor, node) => {
        return (
            editor.isFeatureEnabled(ExperimentalFeatures.ImageCrop) &&
            canRegenerateImage(node as HTMLImageElement)
        );
    },
    onClick: (editor, node) => {
        setEditingImage(editor, node as HTMLImageElement, ImageEditOperation.Crop);
    },
};

const ImageRemoveMenuItem: ContextMenuItem<ImageEditMenuItemStringKey> = {
    key: 'menuNameImageRemove',
    unlocalizedText: 'Remove image',
    onClick: (editor, node) => {
        if (editor.contains(node)) {
            editor.addUndoSnapshot(() => {
                editor.deleteNode(node);
                setEditingImage(editor, null /*editingImage*/);
            }, 'DeleteImage');
        }
    },
};

function shouldShowImageEditItems(editor: IEditor, node: Node) {
    return (
        safeInstanceOf(node, 'HTMLImageElement') &&
        node.isContentEditable &&
        hasImageEditPlugin(editor)
    );
}

/**
 * Create a new instance of ContextMenuProvider to support list number editing functionalities in context menu
 * @returns A new ContextMenuProvider
 */
export default function createListEditMenuProvider(
    strings?: LocalizedStrings<ImageEditMenuItemStringKey>
): EditorPlugin {
    return createContextMenuProvider(
        'imageEdit',
        [ImageAltTextMenuItem, ImageResizeMenuItem, ImageCropMenuItem, ImageRemoveMenuItem],
        strings,
        shouldShowImageEditItems
    );
}
