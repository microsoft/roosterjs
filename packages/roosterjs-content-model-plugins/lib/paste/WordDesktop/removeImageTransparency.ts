import { ChangeSource, isElementOfType, isNodeOfType } from 'roosterjs-content-model-dom';
import type { IEditor, OnNodeCreated } from 'roosterjs-content-model-types';

/**
 * @internal
 * Remove transparency from images in the content model
 * @param _model
 * @param node
 */
export const removeImageTransparencyFromNode: (editor: IEditor) => OnNodeCreated = editor => (
    _model,
    node
): void => {
    if (isNodeOfType(node, 'ELEMENT_NODE') && isElementOfType(node, 'img')) {
        if (node.complete) {
            removeImageTransparency(node, editor);
        } else {
            node.onload = () => {
                removeImageTransparency(node, editor);
                node.onload = null;
                node.onerror = null;
            };

            node.onerror = () => {
                node.onerror = null;
                node.onload = null;
            };
        }
    }
};

const removeImageTransparency = (element: HTMLImageElement, editor: IEditor) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', {});
    if (ctx) {
        canvas.width = element.naturalWidth || element.width;
        canvas.height = element.naturalHeight || element.height;

        if (canvas.width <= 0 || canvas.height <= 0) {
            return;
        }

        ctx.drawImage(element, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Iterate through each pixel and replace only fully transparent pixels with white
        for (let i = 0; i < data.length; i += 4) {
            // data[i] = red, data[i+1] = green, data[i+2] = blue, data[i+3] = alpha
            if (data[i + 3] === 0) {
                // Only fully transparent pixels - replace with white
                data[i] = 255; // red
                data[i + 1] = 255; // green
                data[i + 2] = 255; // blue
                data[i + 3] = 255; // alpha (make it opaque)
            }
        }

        ctx.putImageData(imageData, 0, 0);
        element.src = canvas.toDataURL('image/png');

        editor.triggerEvent('contentChanged', {
            source: ChangeSource.ImageTransparencyRemoved,
            data: element,
        });
    }
};
