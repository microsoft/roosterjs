import ContextMenuItem from '../types/ContextMenuItem';
import createContextMenuProvider from '../utils/createContextMenuProvider';
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
import {
    ImageAltTextMenuItemStringKey,
    ImageCropMenuItemStringKey,
    ImageRemoveMenuItemStringKey,
    ImageResizeMenuItemStringKey,
} from '../types/ContextMenuItemStringKeys';

const ImageAltTextMenuItem: ContextMenuItem<ImageAltTextMenuItemStringKey> = {
    key: 'menuNameImageAltText',
    unlocalizedText: 'Add alternate text',
    onClick: (editor, node) => {},
};

const ImageResizeMenuItem: ContextMenuItem<ImageResizeMenuItemStringKey> = {
    key: 'menuNameImageResize',
    unlocalizedText: 'Size',
    onClick: () => {},
};

const ImageCropMenuItem: ContextMenuItem<ImageCropMenuItemStringKey> = {
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

const ImageRemoveMenuItem: ContextMenuItem<ImageRemoveMenuItemStringKey> = {
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
    strings?: LocalizedStrings<
        | ImageAltTextMenuItemStringKey
        | ImageResizeMenuItemStringKey
        | ImageCropMenuItemStringKey
        | ImageRemoveMenuItemStringKey
    >
): EditorPlugin {
    return createContextMenuProvider(
        'imageEdit',
        [ImageAltTextMenuItem, ImageResizeMenuItem, ImageCropMenuItem, ImageRemoveMenuItem],
        strings,
        shouldShowImageEditItems
    );
}
