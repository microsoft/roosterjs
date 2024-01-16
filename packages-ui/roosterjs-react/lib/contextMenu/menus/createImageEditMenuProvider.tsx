import createContextMenuProvider from '../utils/createContextMenuProvider';
import showInputDialog from '../../inputDialog/utils/showInputDialog';
import {
    canRegenerateImage,
    isResizedTo,
    resetImage,
    resizeByPercentage,
} from 'roosterjs-editor-plugins';
import { DocumentCommand, ImageEditOperation, SelectionRangeTypes } from 'roosterjs-editor-types';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { setImageAltText } from 'roosterjs-editor-api';
import type ContextMenuItem from '../types/ContextMenuItem';
import type { EditorPlugin, IEditor } from 'roosterjs-editor-types';
import type { ImageEditMenuItemStringKey } from '../types/ContextMenuItemStringKeys';
import type { LocalizedStrings } from '../../common/type/LocalizedStrings';
import type { ImageEdit } from 'roosterjs-editor-plugins';

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

const sizeMap: { [key in ImageEditMenuItemStringKey]?: number } = {
    menuNameImageSizeBestFit: 0,
    menuNameImageSizeSmall: 0.25,
    menuNameImageSizeMedium: 0.5,
    menuNameImageSizeOriginal: 1,
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
    onClick: (key, editor, _) => {
        const selection = editor.getSelectionRangeEx();
        if (selection.type !== SelectionRangeTypes.ImageSelection) {
            return;
        }
        editor.addUndoSnapshot(() => {
            const percentage = sizeMap[key];

            if (percentage != undefined && percentage > 0) {
                resizeByPercentage(
                    editor,
                    selection.image,
                    percentage,
                    10 /*minWidth*/,
                    10 /*minHeight*/
                );
            } else {
                resetImage(editor, selection.image);
            }
        });
    },
    getSelectedId: (editor, _) => {
        const selection = editor.getSelectionRangeEx();
        return (
            (selection.type === SelectionRangeTypes.ImageSelection &&
                getObjectKeys(sizeMap).find(key => {
                    return key == 'menuNameImageSizeBestFit'
                        ? !selection.image.hasAttribute('width') &&
                              !selection.image.hasAttribute('height')
                        : isResizedTo(selection.image, sizeMap[key]!);
                })) ||
            null
        );
    },
};

const ImageRotateMenuItem: ContextMenuItem<ImageEditMenuItemStringKey, ImageEdit> = {
    key: 'menuNameImageRotate',
    unlocalizedText: 'Rotate image',
    subItems: {
        menuNameImageRotateLeft: 'Left',
        menuNameImageRotateRight: 'Right',
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
            }
        });
    },
};

const ImageFlipMenuItem: ContextMenuItem<ImageEditMenuItemStringKey, ImageEdit> = {
    key: 'menuNameImageFlip',
    unlocalizedText: 'Flip image',
    subItems: {
        menuNameImageRotateFlipHorizontally: 'Flip Horizontally',
        menuNameImageRotateFlipVertically: 'Flip Vertically',
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
                case 'menuNameImageRotateFlipHorizontally':
                    imageEdit?.flipImage(node as HTMLImageElement, 'horizontal');
                    break;
                case 'menuNameImageRotateFlipVertically':
                    imageEdit?.flipImage(node as HTMLImageElement, 'vertical');
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

const ImageCopyMenuItem: ContextMenuItem<ImageEditMenuItemStringKey, ImageEdit> = {
    key: 'menuNameImageCopy',
    unlocalizedText: 'Copy image',
    onClick: (_, editor, node, strings, uiUtilities, imageEdit) => {
        if (editor.contains(node)) {
            editor.addUndoSnapshot(() => {
                editor.getDocument()?.execCommand(DocumentCommand.Copy);
            }, 'CopyImage');
        }
    },
};

const ImageCutMenuItem: ContextMenuItem<ImageEditMenuItemStringKey, ImageEdit> = {
    key: 'menuNameImageCut',
    unlocalizedText: 'Cut image',
    onClick: (_, editor, node, strings, uiUtilities, imageEdit) => {
        if (editor.contains(node)) {
            editor.addUndoSnapshot(() => {
                editor.getDocument()?.execCommand(DocumentCommand.Cut);
            }, 'CutImage');
        }
    },
};

function shouldShowImageEditItems(editor: IEditor, _: Node) {
    const selection = editor.getSelectionRangeEx();
    return selection.type === SelectionRangeTypes.ImageSelection && !!selection.image;
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
            ImageFlipMenuItem,
            ImageCopyMenuItem,
            ImageCutMenuItem,
        ],
        strings,
        shouldShowImageEditItems,
        imageEditPlugin
    );
}
