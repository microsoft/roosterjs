import formatImageWithContentModel from '../utils/formatImageWithContentModel';
import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { getMetadata, readFile } from 'roosterjs-editor-dom';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { SelectionRangeTypes } from 'roosterjs-editor-types';

/**
 * Change the selected image src
 * @param editor The editor instance
 * @param file The image file
 */
export default function changeImage(editor: IContentModelEditor, file: File) {
    const selection = editor.getSelectionRangeEx();
    readFile(file, dataUrl => {
        if (
            dataUrl &&
            !editor.isDisposed() &&
            selection.type === SelectionRangeTypes.ImageSelection
        ) {
            formatImageWithContentModel(
                editor,
                'changeImage',
                (image: ContentModelImage) => {
                    image.src = dataUrl;
                    image.dataset = {};
                    image.format.width = '';
                    image.format.height = '';
                },
                {
                    image: selection.image,
                    previousSrc: selection.image.src,
                    newSrc: dataUrl,
                    originalSrc: getImageSrc(selection.image),
                }
            );
        }
    });
}

const getImageSrc = (image: HTMLImageElement) => {
    const obj = getMetadata<{ src: string }>(image);
    return (obj && obj.src) || '';
};
