import { formatSegmentWithContentModel } from './formatSegmentWithContentModel';
import { PluginEventType } from 'roosterjs-editor-types';
import type { ContentModelImage } from 'roosterjs-content-model-types';
import type { EditImageEventData } from 'roosterjs-editor-types';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

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
