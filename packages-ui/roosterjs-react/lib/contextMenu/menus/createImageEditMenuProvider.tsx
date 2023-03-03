import ContextMenuItem from '../types/ContextMenuItem';
import createContextMenuProvider from '../utils/createContextMenuProvider';
import showInputDialog from '../../inputDialog/utils/showInputDialog';
import { EditorPlugin, IEditor, ImageEditOperation } from 'roosterjs-editor-types';
import { ImageEditMenuItemStringKey } from '../types/ContextMenuItemStringKeys';
import { LocalizedStrings } from '../../common/type/LocalizedStrings';
import { safeInstanceOf } from 'roosterjs-editor-dom';
import { setImageAltText } from 'roosterjs-editor-api';
import {
    canRegenerateImage,
    ImageEdit,
    resetImage,
    resizeByPercentage,
} from 'roosterjs-editor-plugins';

const ImageAltTextMenuItem: ContextMenuItem<ImageEditMenuItemStringKey, ImageEdit> = {
    key: 'menuNameImageAltText',
    unlocalizedText: 'Add alternate text',
    onClick: (_, editor, node, strings, uiUtilities) => {
        const image = node as HTMLImageElement;
        const initValue = image.alt;

        showInputDialog(
            uiUtilities,
            'menuNameImageAltText',
            'Add alternate text',
            {
                altText: {
                    labelKey: null,
                    unlocalizedLabel: null,
                    initValue: initValue,
                },
            },
            strings
        ).then(values => {
            editor.focus();
            editor.select(image);

            if (values) {
                setImageAltText(editor, values.altText);
            }
        });
    },
};

const ImageResizeMenuItem: ContextMenuItem<ImageEditMenuItemStringKey, ImageEdit> = {
    key: 'menuNameImageResize',
    unlocalizedText: 'Size',
    subItems: {
        menuNameImageSizeBestFit: 'Best fit',
        menuNameImageSizeSmall: 'Small',
        menuNameImageSizeMedium: 'Medium',
        menuNameImageSizeOriginal: 'Original',
    },
    onClick: (key, editor, node) => {
        editor.addUndoSnapshot(() => {
            let percentage = 0;
            switch (key) {
                case 'menuNameImageSizeSmall':
                    percentage = 0.25;
                    break;
                case 'menuNameImageSizeMedium':
                    percentage = 0.5;
                    break;
                case 'menuNameImageSizeOriginal':
                    percentage = 1;
                    break;
            }

            if (percentage > 0) {
                resizeByPercentage(
                    editor,
                    node as HTMLImageElement,
                    percentage,
                    10 /*minWidth*/,
                    10 /*minHeight*/
                );
            } else {
                resetImage(editor, node as HTMLImageElement);
            }
        });
    },
};

const ImageRotateMenuItem: ContextMenuItem<ImageEditMenuItemStringKey, ImageEdit> = {
    key: 'menuNameImageRotate',
    unlocalizedText: 'Rotate image',
    subItems: {
        menuNameImageRotateLeft: 'Left',
        menuNameImageRotateRight: 'Right',
        menuNameImageRotateUpsidedown: 'Upside down',
    },
    shouldShow: (_, node, imageEdit) => {
        return (
            !!imageEdit?.isOperationAllowed(ImageEditOperation.Rotate) &&
            canRegenerateImage(node as HTMLImageElement)
        );
    },
    onClick: (key, editor, node, strings, uiUtilities, imageEdit) => {
        editor.addUndoSnapshot(() => {
            switch (key) {
                case 'menuNameImageRotateLeft':
                    imageEdit?.rotateImage(node as HTMLImageElement, -Math.PI / 2);
                    break;
                case 'menuNameImageRotateRight':
                    imageEdit?.rotateImage(node as HTMLImageElement, Math.PI / 2);
                    break;
                case 'menuNameImageRotateUpsidedown':
                    imageEdit?.rotateImage(node as HTMLImageElement, Math.PI);
                    break;
            }
        });
    },
};

const ImageCropMenuItem: ContextMenuItem<ImageEditMenuItemStringKey, ImageEdit> = {
    key: 'menuNameImageCrop',
    unlocalizedText: 'Crop image',
    shouldShow: (_, node, imageEdit) => {
        return (
            !!imageEdit?.isOperationAllowed(ImageEditOperation.Crop) &&
            canRegenerateImage(node as HTMLImageElement)
        );
    },
    onClick: (_, editor, node, strings, uiUtilities, imageEdit) => {
        imageEdit?.setEditingImage(node as HTMLImageElement, ImageEditOperation.Crop);
    },
};

const ImageRemoveMenuItem: ContextMenuItem<ImageEditMenuItemStringKey, ImageEdit> = {
    key: 'menuNameImageRemove',
    unlocalizedText: 'Remove image',
    onClick: (_, editor, node, strings, uiUtilities, imageEdit) => {
        if (editor.contains(node)) {
            editor.addUndoSnapshot(() => {
                editor.deleteNode(node);
                imageEdit?.setEditingImage(null /*editingImage*/);
            }, 'DeleteImage');
        }
    },
};

function shouldShowImageEditItems(editor: IEditor, node: Node) {
    return safeInstanceOf(node, 'HTMLImageElement') && node.isContentEditable;
}

/**
 * Create a new instance of ContextMenuProvider to support image editing functionalities in context menu
 * @returns A new ContextMenuProvider
 */
export default function createImageEditMenuProvider(
    imageEditPlugin: ImageEdit,
    strings?: LocalizedStrings<ImageEditMenuItemStringKey>
): EditorPlugin {
    return createContextMenuProvider<ImageEditMenuItemStringKey, ImageEdit>(
        'imageEdit',
        [
            ImageAltTextMenuItem,
            ImageResizeMenuItem,
            ImageCropMenuItem,
            ImageRemoveMenuItem,
            ImageRotateMenuItem,
        ],
        strings,
        shouldShowImageEditItems,
        imageEditPlugin
    );
}
