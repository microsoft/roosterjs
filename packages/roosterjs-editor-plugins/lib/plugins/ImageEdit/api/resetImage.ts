import { ChangeSource, IEditor } from 'roosterjs-editor-types';
import { deleteEditInfo } from '../editInfoUtils/editInfo';

/**
 * Remove explicit width & height attributes on the image element.
 * @param editor The editor that contains the image
 * @param image The image to remove w/h from
 */
export default function resetImage(editor: IEditor, image: HTMLImageElement) {
    editor.addUndoSnapshot(() => {
        image.style.width = '';
        image.style.height = '';
        image.style.maxWidth = '100%';
        image.removeAttribute('width');
        image.removeAttribute('height');
        deleteEditInfo(image);
    }, ChangeSource.ImageResize);
}
