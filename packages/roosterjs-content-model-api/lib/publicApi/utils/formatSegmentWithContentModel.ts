import { adjustWordSelection } from '../../modelApi/selection/adjustWordSelection';
import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-dom';
import type {
    ContentModelParagraph,
    ContentModelSegment,
    ContentModelSegmentFormat,
    IEditor,
    ReadonlyContentModelDocument,
} from 'roosterjs-content-model-types';

/**
 * Invoke a callback to format the selected segment using Content Model
 * @param editor The editor object
 * @param apiName Name of API this calling this function. This is mostly for logging.
 * @param toggleStyleCallback The callback to format the segment. It will be called with current selected table. If no table is selected, it will not be called.
 * @param segmentHasStyleCallback The callback used for checking if the given segment already has required format
 * @param includingFormatHolder True to also include format holder of list item when search selected segments
 * @param afterFormatCallback A callback to invoke after format is applied to all selected segments and before the change is applied to DOM tree
 */
export function formatSegmentWithContentModel(
    editor: IEditor,
    apiName: string,
    toggleStyleCallback: (
        format: ContentModelSegmentFormat,
        isTuringOn: boolean,
        segment: ContentModelSegment | null,
        paragraph: ContentModelParagraph | null
    ) => void,
    segmentHasStyleCallback?: (
        format: ContentModelSegmentFormat,
        segment: ContentModelSegment | null,
        paragraph: ContentModelParagraph | null
    ) => boolean,
    includingFormatHolder?: boolean,
    afterFormatCallback?: (model: ReadonlyContentModelDocument) => void
) {
    editor.formatContentModel(
        (model: ReadonlyContentModelDocument, context) => {
            let segmentAndParagraphs = getSelectedSegmentsAndParagraphs(
                model,
                !!includingFormatHolder
            );
            let isCollapsedSelection =
                segmentAndParagraphs.length == 1 &&
                segmentAndParagraphs[0][0].segmentType == 'SelectionMarker';

            if (isCollapsedSelection) {
                const para = segmentAndParagraphs[0][1];
                const path = segmentAndParagraphs[0][2];

                segmentAndParagraphs = adjustWordSelection(
                    model,
                    segmentAndParagraphs[0][0]
                ).map(x => [x, para, path]);

                if (segmentAndParagraphs.length > 1) {
                    isCollapsedSelection = false;
                }
            }

            const formatsAndSegments: [
                ContentModelSegmentFormat,
                ContentModelSegment | null,
                ContentModelParagraph | null
            ][] = segmentAndParagraphs.map(item => [item[0].format, item[0], item[1]]);

            const isTurningOff = segmentHasStyleCallback
                ? formatsAndSegments.every(([format, segment, paragraph]) =>
                      segmentHasStyleCallback(format, segment, paragraph)
                  )
                : false;

            formatsAndSegments.forEach(([format, segment, paragraph]) =>
                toggleStyleCallback(format, !isTurningOff, segment, paragraph)
            );

            afterFormatCallback?.(model);

            if (isCollapsedSelection) {
                context.newPendingFormat = segmentAndParagraphs[0][0].format;
                editor.focus();
                return false;
            } else {
                return formatsAndSegments.length > 0;
            }
        },
        {
            apiName,
        }
    );
}
