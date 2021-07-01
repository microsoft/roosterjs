import { ContextMenuItem } from './ContextMenuProvider';
import { safeInstanceOf } from 'roosterjs-editor-dom';
import {
    canRegenerateImage,
    ImageEdit,
    resizeByPercentage,
    resetImage,
} from 'roosterjs-editor-plugins/lib/ImageEdit';
import {
    ContextMenuProvider,
    ExperimentalFeatures,
    IEditor,
    ImageEditOperation,
} from 'roosterjs-editor-types';

export default class ImageEditPlugin extends ImageEdit
    implements ContextMenuProvider<ContextMenuItem> {
    private allowCrop: boolean;

    initialize(editor: IEditor) {
        super.initialize(editor);
        this.allowCrop = editor.isFeatureEnabled(ExperimentalFeatures.ImageCrop);
    }

    getContextMenuItems(node: Node) {
        const items: ContextMenuItem[] = [];
        if (safeInstanceOf(node, 'HTMLImageElement')) {
            items.push({
                key: 'resize',
                name: 'Resize image',
                onClick: () => {
                    this.setEditingImage(node, ImageEditOperation.ResizeAndRotate);
                },
            });

            if (this.allowCrop && canRegenerateImage(node)) {
                items.push({
                    key: 'crop',
                    name: 'Crop image',
                    onClick: () => {
                        this.setEditingImage(node, ImageEditOperation.Crop);
                    },
                });
            }

            items.push({
                key: '25',
                name: 'Resize to 25%',
                onClick: () => {
                    resizeByPercentage(
                        this.editor,
                        node,
                        0.25,
                        this.options.minWidth,
                        this.options.minHeight
                    );
                },
            });
            items.push({
                key: '50',
                name: 'Resize to 50%',
                onClick: () => {
                    resizeByPercentage(
                        this.editor,
                        node,
                        0.5,
                        this.options.minWidth,
                        this.options.minHeight
                    );
                },
            });
            items.push({
                key: '100',
                name: 'Resize to 100%',
                onClick: () => {
                    resizeByPercentage(
                        this.editor,
                        node,
                        1,
                        this.options.minWidth,
                        this.options.minHeight
                    );
                },
            });
            items.push({
                key: 'reset',
                name: 'Reset image',
                onClick: () => {
                    resetImage(this.editor, node);
                },
            });
        }
        return items;
    }
}
