import { adjustImageSelection, setImageSize } from 'roosterjs-content-model-api';
import { showInputDialog } from 'roosterjs-react';
import type { RibbonButton } from 'roosterjs-react';

/**
 * @internal
 * "Image Size" button on the format ribbon
 */
export const imageSizeButton: RibbonButton<
    'buttonNameImageSize' | 'imageSizeDialogWidth' | 'imageSizeDialogHeight'
> = {
    key: 'buttonNameImageSize',
    unlocalizedText: 'Image Size',
    iconName: 'ImagePixel',
    isDisabled: formatState => !formatState.canAddImageAltText,
    onClick: (editor, _, strings, uiUtilities) => {
        const image = adjustImageSelection(editor);
        const items = {
            width: {
                autoFocus: true,
                labelKey: 'imageSizeDialogWidth' as const,
                unlocalizedLabel: 'Width (CSS value, e.g. 200px or 50%; blank for auto)',
                initValue: image?.format.width ?? '',
            },
            height: {
                labelKey: 'imageSizeDialogHeight' as const,
                unlocalizedLabel: 'Height (CSS value, e.g. 100px or auto; blank for auto)',
                initValue: image?.format.height ?? '',
            },
        };

        showInputDialog(uiUtilities, 'buttonNameImageSize', 'Image Size', items, strings).then(
            result => {
                editor.focus();

                if (result) {
                    const width = result.width.trim();
                    const height = result.height.trim();
                    const style = editor.getDocument().createElement('img').style;

                    style.width = width;
                    style.height = height;

                    if ((!width || style.width) && (!height || style.height)) {
                        setImageSize(editor, width, height);
                    }
                }
            }
        );
    },
};
