import type { ImageEditor } from 'roosterjs-content-model-types';

const imageEdit: { [id: string]: ImageEditor } = {};

export function addImageEditOperator(id: string, imageEditPlugin: ImageEditor): void {
    imageEdit[id] = imageEditPlugin;
}

export function removeImageEditOperator(id: string): void {
    delete imageEdit[id];
}

export function operateImageEdit(
    id: string | null,
    callback: (imageEditPlugin: ImageEditor) => void
): void {
    if (!!id) {
        const imageEditPlugin = imageEdit[id];
        if (imageEditPlugin) {
            callback(imageEditPlugin);
        }
    }
}
