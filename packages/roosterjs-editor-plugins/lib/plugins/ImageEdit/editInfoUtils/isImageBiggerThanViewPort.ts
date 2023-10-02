import type { IEditor } from 'roosterjs-editor-types/';

export default function isImageBiggerThanViewport(editor: IEditor, image: HTMLImageElement) {
    const viewport = editor.getVisibleViewport();
    if (viewport) {
        const { top, bottom, left, right } = viewport;
        const viewportWidth = right - left;
        const viewportHeight = bottom - top;
        const { width, height } = image;
        if (width > viewportWidth || height > viewportHeight) {
            return true;
        }
    }
    return false;
}
