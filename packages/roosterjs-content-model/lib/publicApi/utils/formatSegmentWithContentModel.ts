import { ContentModelParagraph } from 'roosterjs-content-model/lib/publicTypes/block/ContentModelParagraph';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { formatWithContentModel } from './formatWithContentModel';
import { getSelectedSegments } from '../../modelApi/selection/collectSelections';
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
    formatWithContentModel(
        editor,
        apiName,
        model => {
            let insertPosition = editor.getCachedInsertPosition();
            const segments = insertPosition
                ? [insertPosition.marker]
                : getSelectedSegments(model, !!includingFormatHolder);

            const isTurningOff = segmentHasStyleCallback
                ? segments.every(segmentHasStyleCallback)
                : false;

            segments.forEach(segment => toggleStyleCallback(segment, !isTurningOff));

            if (
                !insertPosition &&
                segments.length == 1 &&
                segments[0].segmentType == 'SelectionMarker'
            ) {
                insertPosition = {
                    marker: segments[0],
                    path: [],
                    tableContext: undefined,
                    paragraph: ({} as any) as ContentModelParagraph, // TODO!!!!!!!!!!!!!!!!
                };
            }

            editor.cacheInsertPosition(insertPosition);

            return segments.length > 0;
        },
        domToModelOptions
    );
}
