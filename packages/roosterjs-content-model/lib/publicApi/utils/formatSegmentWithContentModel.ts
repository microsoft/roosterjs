import { arrayPush } from 'roosterjs-editor-dom';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { formatWithContentModel } from './formatWithContentModel';
import { getSelections } from '../../modelApi/selection/getSelections';
import {
    DomToModelOption,
    IExperimentalContentModelEditor,
} from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * @internal
 */
export function formatSegmentWithContentModel(
    editor: IExperimentalContentModelEditor,
    apiName: string,
    toggleStyleCallback: (segment: ContentModelSegment, isTuringOn: boolean) => void,
    segmentHasStyleCallback?: (segment: ContentModelSegment) => boolean,
    includingFormatHolder?: boolean,
    domToModelOptions?: DomToModelOption
) {
    const segments: ContentModelSegment[] = [];

    formatWithContentModel(
        editor,
        apiName,
        model => {
            const selections = getSelections(model, {
                includeFormatHolder: includingFormatHolder,
            });

            selections.forEach(selection => arrayPush(segments, selection.segments));

            const isTurningOff = segmentHasStyleCallback
                ? segments.every(segmentHasStyleCallback)
                : false;

            segments.forEach(segment => toggleStyleCallback(segment, !isTurningOff));

            return segments.length > 0;
        },
        domToModelOptions
    );
}
