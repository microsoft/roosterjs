import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { EditImageEventData, PluginEventType } from 'roosterjs-editor-types';
import { formatSegmentWithContentModel } from './formatSegmentWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * @internal
 */
export default function formatImageWithContentModel(
    editor: IContentModelEditor,
    apiName: string,
    callback: (segment: ContentModelImage) => void,
    eventChangeData?: EditImageEventData
) {
    formatSegmentWithContentModel(
        editor,
        apiName,
        (_, __, segment) => {
            if (segment?.segmentType == 'Image') {
                callback(segment);
                if (eventChangeData) {
                    editor.triggerPluginEvent(PluginEventType.EditImage, eventChangeData);
                }
            }
        },
        undefined /** segmentHasStyleCallback **/,
        undefined /** includingFormatHolder */
    );
}
