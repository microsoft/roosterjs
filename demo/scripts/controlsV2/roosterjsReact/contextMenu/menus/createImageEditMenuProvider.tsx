import { createContextMenuProvider } from '../utils/createContextMenuProvider';
import { EditorPlugin, IEditor, ImageEditor } from 'roosterjs-content-model-types';
import { formatImageWithContentModel } from 'roosterjs-content-model-api';
import { iterateSelections, mutateBlock, updateImageMetadata } from 'roosterjs-content-model-dom';
import { setImageAltText } from 'roosterjs-content-model-api';
import { showInputDialog } from '../../inputDialog/utils/showInputDialog';
import type { ContextMenuItem } from '../types/ContextMenuItem';
import type { ImageEditMenuItemStringKey } from '../types/ContextMenuItemStringKeys';
import type { LocalizedStrings } from '../../common/type/LocalizedStrings';

const MIN_WIDTH = 10;
const MIN_HEIGHT = 10;

const ImageAltTextMenuItem: ContextMenuItem<ImageEditMenuItemStringKey> = {
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
            editor.setDOMSelection({
                type: 'image',
                image: image,
            });

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

const ImageResizeMenuItem: ContextMenuItem<ImageEditMenuItemStringKey> = {
    key: 'menuNameImageResize',
    unlocalizedText: 'Size',
    subItems: {
        menuNameImageSizeBestFit: 'Best fit',
        menuNameImageSizeSmall: 'Small',
        menuNameImageSizeMedium: 'Medium',
        menuNameImageSizeOriginal: 'Original',
    },
    onClick: (key, editor, _) => {
        const selection = editor.getDOMSelection();
        if (selection.type !== 'image') {
            return;
        }

        const percentage = sizeMap[key];

        if (percentage > 0) {
            const { naturalWidth, naturalHeight } = selection.image;

            resizeByPercentage(editor, percentage, naturalWidth, naturalHeight);
        } else {
            resetImage(editor);
        }
    },
};

const ImageRotateMenuItem: ContextMenuItem<ImageEditMenuItemStringKey, ImageEditor> = {
    key: 'menuNameImageRotate',
    unlocalizedText: 'Rotate image',
    subItems: {
        menuNameImageRotateLeft: 'Left',
        menuNameImageRotateRight: 'Right',
    },
    shouldShow: (_, node, imageEditor) => {
        return (
            !!imageEditor?.isOperationAllowed('rotate') &&
            imageEditor.canRegenerateImage(node as HTMLImageElement)
        );
    },
    onClick: (key, _editor, _node, _strings, _uiUtilities, imageEdit) => {
        switch (key) {
            case 'menuNameImageRotateLeft':
                imageEdit?.rotateImage(-Math.PI / 2);
                break;
            case 'menuNameImageRotateRight':
                imageEdit?.rotateImage(Math.PI / 2);
                break;
        }
    },
};

const ImageFlipMenuItem: ContextMenuItem<ImageEditMenuItemStringKey, ImageEditor> = {
    key: 'menuNameImageFlip',
    unlocalizedText: 'Flip image',
    subItems: {
        menuNameImageRotateFlipHorizontally: 'Flip Horizontally',
        menuNameImageRotateFlipVertically: 'Flip Vertically',
    },
    shouldShow: (_, node, imageEditor) => {
        return (
            !!imageEditor?.isOperationAllowed('rotate') &&
            imageEditor.canRegenerateImage(node as HTMLImageElement)
        );
    },
    onClick: (key, _editor, _node, _strings, _uiUtilities, imageEdit) => {
        switch (key) {
            case 'menuNameImageRotateFlipHorizontally':
                imageEdit?.flipImage('horizontal');
                break;
            case 'menuNameImageRotateFlipVertically':
                imageEdit?.flipImage('vertical');
                break;
        }
    },
};

const ImageCropMenuItem: ContextMenuItem<ImageEditMenuItemStringKey, ImageEditor> = {
    key: 'menuNameImageCrop',
    unlocalizedText: 'Crop image',
    shouldShow: (_, node, imageEditor) => {
        return (
            !!imageEditor?.isOperationAllowed('crop') &&
            imageEditor.canRegenerateImage(node as HTMLImageElement)
        );
    },
    onClick: (_, _editor, _node, _strings, _uiUtilities, imageEdit) => {
        imageEdit?.cropImage();
    },
};

const ImageRemoveMenuItem: ContextMenuItem<ImageEditMenuItemStringKey> = {
    key: 'menuNameImageRemove',
    unlocalizedText: 'Remove image',
    onClick: (_, editor, node) => {
        removeImage(editor);
    },
};

const ImageCopyMenuItem: ContextMenuItem<ImageEditMenuItemStringKey> = {
    key: 'menuNameImageCopy',
    unlocalizedText: 'Copy image',
    onClick: (_, editor) => {
        editor.getDocument()?.execCommand('copy');
    },
};

const ImageCutMenuItem: ContextMenuItem<ImageEditMenuItemStringKey> = {
    key: 'menuNameImageCut',
    unlocalizedText: 'Cut image',
    onClick: (_, editor) => {
        editor.getDocument()?.execCommand('cut');
    },
};

function shouldShowImageEditItems(editor: IEditor, _: Node) {
    const selection = editor.getDOMSelection();
    return selection.type === 'image' && !!selection.image;
}

/**
 * Create a new instance of ContextMenuProvider to support image editing functionalities in context menu
 * @returns A new ContextMenuProvider
 */
export function createImageEditMenuProvider(
    imageEditor?: ImageEditor,
    strings?: LocalizedStrings<ImageEditMenuItemStringKey>
): EditorPlugin {
    return createContextMenuProvider<ImageEditMenuItemStringKey, ImageEditor>(
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
        imageEditor
    );
}

function removeImage(editor: IEditor) {
    editor.formatContentModel(
        model => {
            let changed = false;

            iterateSelections(model, (_, __, block, segments) => {
                segments?.forEach(segment => {
                    if (segment.segmentType == 'Image' && block?.blockType == 'Paragraph') {
                        const index = block.segments.indexOf(segment);

                        if (index >= 0) {
                            mutateBlock(block).segments.splice(index, 1);
                            changed = true;
                        }
                    }
                });
            });

            return changed;
        },
        {
            apiName: 'DeleteImage',
        }
    );
}

function resizeByPercentage(
    editor: IEditor,
    percentage: number,
    naturalWidth: number,
    naturalHeight: number
) {
    formatImageWithContentModel(editor, 'resizeImage', segment => {
        updateImageMetadata(segment, format => {
            format = format || {
                naturalWidth,
                naturalHeight,
                leftPercent: 0,
                rightPercent: 0,
                topPercent: 0,
                bottomPercent: 0,
                angleRad: 0,
            };

            const newWidth = Math.max(
                MIN_WIDTH,
                format.naturalWidth * (1 - format.leftPercent - format.rightPercent) * percentage
            );
            const newHeight = Math.max(
                MIN_HEIGHT,
                format.naturalHeight * (1 - format.topPercent - format.bottomPercent) * percentage
            );
            format.widthPx = newWidth;
            format.heightPx = newHeight;
            segment.format.width = newWidth + 'px';
            segment.format.height = newHeight + 'px';

            return format;
        });
    });
}

function resetImage(editor: IEditor) {
    formatImageWithContentModel(editor, 'resizeImage', segment => {
        updateImageMetadata(segment, () => null);

        delete segment.format.width;
        delete segment.format.height;

        segment.format.maxWidth = '100%';
    });
}
