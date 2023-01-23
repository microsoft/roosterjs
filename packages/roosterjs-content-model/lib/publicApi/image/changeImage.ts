import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { readFile } from 'roosterjs-editor-dom';

/**
 * Change the selected image src
 * @param editor The editor instance
 * @param file The image file
 */
export default function changeImage(editor: IExperimentalContentModelEditor, file: File) {
    readFile(file, dataUrl => {
        if (dataUrl && !editor.isDisposed()) {
            formatSegmentWithContentModel(editor, 'changeImage', (_, __, segment) => {
                if (segment?.segmentType == 'Image') {
                    segment.src = dataUrl;
                }
            });
        }
    });
}
