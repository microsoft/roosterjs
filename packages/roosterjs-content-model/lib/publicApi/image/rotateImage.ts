import applyChange from './editingImage/applyChanges';
import formatImageWithContentModel from '../utils/formatImageWithContentModel';
import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { getImageEditInfo } from './editingImage/getImageEditInfo';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Set image alt text for all selected images at selection. If no images is contained
 * in selection, do nothing.
 * @param editor The editor instance
 * @param angleRad The image alt text
 */
export default function rotateImage(editor: IContentModelEditor, angleRad: number) {
    formatImageWithContentModel(editor, 'rotateImage', (image: ContentModelImage) => {
        const editInfo = getImageEditInfo(editor, image);
        editInfo.angleRad = editInfo?.angleRad ? editInfo?.angleRad + angleRad : angleRad;
        applyChange(editor, image, editInfo);
    });
}
