import { createContextMenuProvider } from '../utils/createContextMenuProvider';
import { EditorPlugin, IEditor } from 'roosterjs-content-model-types';
import { iterateSelections } from 'roosterjs-content-model-core';
import { setImageAltText } from 'roosterjs-content-model-api';
import { showInputDialog } from '../../inputDialog/utils/showInputDialog';
import type { ContextMenuItem } from '../types/ContextMenuItem';
import type { ImageEditMenuItemStringKey } from '../types/ContextMenuItemStringKeys';
import type { LocalizedStrings } from '../../common/type/LocalizedStrings';

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

// TODO: const sizeMap: { [key in ImageEditMenuItemStringKey]?: number } = {
//     menuNameImageSizeBestFit: 0,
//     menuNameImageSizeSmall: 0.25,
//     menuNameImageSizeMedium: 0.5,
//     menuNameImageSizeOriginal: 1,
// };

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
        // TODO: editor.addUndoSnapshot(() => {
        //     const percentage = sizeMap[key];

        //     if (percentage != undefined && percentage > 0) {
        //         resizeByPercentage(
        //             editor,
        //             selection.image,
        //             percentage,
        //             10 /*minWidth*/,
        //             10 /*minHeight*/
        //         );
        //     } else {
        //         resetImage(editor, selection.image);
        //     }
        // });
    },
    getSelectedId: (editor, _) => {
        // TODO: const selection = editor.getDOMSelection();
        // return (
        //     (selection.type === 'image' &&
        //         getObjectKeys(sizeMap).find(key => {
        //             return key == 'menuNameImageSizeBestFit'
        //                 ? !selection.image.hasAttribute('width') &&
        //                       !selection.image.hasAttribute('height')
        //                 : isResizedTo(selection.image, sizeMap[key]!);
        //         })) ||
        //     null
        // );

        return null;
    },
};

// TODO: const ImageRotateMenuItem: ContextMenuItem<ImageEditMenuItemStringKey, ImageEdit> = {
//     key: 'menuNameImageRotate',
//     unlocalizedText: 'Rotate image',
//     subItems: {
//         menuNameImageRotateLeft: 'Left',
//         menuNameImageRotateRight: 'Right',
//     },
//     shouldShow: (_, node, imageEdit) => {
//         return (
//             !!imageEdit?.isOperationAllowed(ImageEditOperation.Rotate) &&
//             canRegenerateImage(node as HTMLImageElement)
//         );
//     },
//     onClick: (key, editor, node, strings, uiUtilities, imageEdit) => {
//         editor.addUndoSnapshot(() => {
//             switch (key) {
//                 case 'menuNameImageRotateLeft':
//                     imageEdit?.rotateImage(node as HTMLImageElement, -Math.PI / 2);
//                     break;
//                 case 'menuNameImageRotateRight':
//                     imageEdit?.rotateImage(node as HTMLImageElement, Math.PI / 2);
//                     break;
//             }
//         });
//     },
// };

// TODO: const ImageFlipMenuItem: ContextMenuItem<ImageEditMenuItemStringKey, ImageEdit> = {
//     key: 'menuNameImageFlip',
//     unlocalizedText: 'Flip image',
//     subItems: {
//         menuNameImageRotateFlipHorizontally: 'Flip Horizontally',
//         menuNameImageRotateFlipVertically: 'Flip Vertically',
//     },
//     shouldShow: (_, node, imageEdit) => {
//         return (
//             !!imageEdit?.isOperationAllowed(ImageEditOperation.Rotate) &&
//             canRegenerateImage(node as HTMLImageElement)
//         );
//     },
//     onClick: (key, editor, node, strings, uiUtilities, imageEdit) => {
//         editor.addUndoSnapshot(() => {
//             switch (key) {
//                 case 'menuNameImageRotateFlipHorizontally':
//                     imageEdit?.flipImage(node as HTMLImageElement, 'horizontal');
//                     break;
//                 case 'menuNameImageRotateFlipVertically':
//                     imageEdit?.flipImage(node as HTMLImageElement, 'vertical');
//                     break;
//             }
//         });
//     },
// };

// TODO: const ImageCropMenuItem: ContextMenuItem<ImageEditMenuItemStringKey, ImageEdit> = {
//     key: 'menuNameImageCrop',
//     unlocalizedText: 'Crop image',
//     shouldShow: (_, node, imageEdit) => {
//         return (
//             !!imageEdit?.isOperationAllowed(ImageEditOperation.Crop) &&
//             canRegenerateImage(node as HTMLImageElement)
//         );
//     },
//     onClick: (_, editor, node, strings, uiUtilities, imageEdit) => {
//         imageEdit?.setEditingImage(node as HTMLImageElement, ImageEditOperation.Crop);
//     },
// };

const ImageRemoveMenuItem: ContextMenuItem<ImageEditMenuItemStringKey> = {
    key: 'menuNameImageRemove',
    unlocalizedText: 'Remove image',
    onClick: (_, editor, node) => {
        if (editor.getDOMHelper().isNodeInEditor(node)) {
            editor.formatContentModel(
                model => {
                    let changed = false;

                    iterateSelections(model, (_, __, block, segments) => {
                        segments?.forEach(segment => {
                            if (segment.segmentType == 'Image' && block?.blockType == 'Paragraph') {
                                const index = block.segments.indexOf(segment);

                                if (index >= 0) {
                                    block.segments.splice(index, 1);
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
    },
};

const ImageCopyMenuItem: ContextMenuItem<ImageEditMenuItemStringKey> = {
    key: 'menuNameImageCopy',
    unlocalizedText: 'Copy image',
    onClick: (_, editor, node, strings, uiUtilities, imageEdit) => {
        editor.getDocument()?.execCommand('copy');
    },
};

const ImageCutMenuItem: ContextMenuItem<ImageEditMenuItemStringKey> = {
    key: 'menuNameImageCut',
    unlocalizedText: 'Cut image',
    onClick: (_, editor, node, strings, uiUtilities, imageEdit) => {
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
    // TODO: imageEditPlugin: ImageEdit,
    strings?: LocalizedStrings<ImageEditMenuItemStringKey>
): EditorPlugin {
    return createContextMenuProvider<ImageEditMenuItemStringKey, undefined>(
        'imageEdit',
        [
            ImageAltTextMenuItem,
            ImageResizeMenuItem,
            // ImageCropMenuItem,
            ImageRemoveMenuItem,
            // ImageRotateMenuItem,
            // ImageFlipMenuItem,
            ImageCopyMenuItem,
            ImageCutMenuItem,
        ],
        strings,
        shouldShowImageEditItems
        // imageEditPlugin
    );
}
