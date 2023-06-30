import { adjustTrailingSpaceSelection } from '../../modelApi/selection/adjustTrailingSpaceSelection';
import { adjustWordSelection } from '../../modelApi/selection/adjustWordSelection';
import { formatWithContentModel } from './formatWithContentModel';
import { getPendingFormat, setPendingFormat } from '../../modelApi/format/pendingFormat';
import { getSelectedSegmentsAndParagraphs } from '../../modelApi/selection/collectSelections';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import {
    ContentModelParagraph,
    ContentModelSegment,
    ContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function formatSegmentWithContentModel(
    editor: IContentModelEditor,
    apiName: string,
    toggleStyleCallback: (
        format: ContentModelSegmentFormat,
        isTuringOn: boolean,
        segment: ContentModelSegment | null
    ) => void,
    segmentHasStyleCallback?: (
        format: ContentModelSegmentFormat,
        segment: ContentModelSegment | null,
        paragraph: ContentModelParagraph | null
    ) => boolean,
    includingFormatHolder?: boolean
) {
    formatWithContentModel(editor, apiName, model => {
        let segmentAndParagraphs = getSelectedSegmentsAndParagraphs(model, !!includingFormatHolder);
        const pendingFormat = getPendingFormat(editor);
        let isCollapsedSelection =
            segmentAndParagraphs.length == 1 &&
            segmentAndParagraphs[0][0].segmentType == 'SelectionMarker';

        if (isCollapsedSelection) {
            const para = segmentAndParagraphs[0][1];

            segmentAndParagraphs = adjustWordSelection(model, segmentAndParagraphs[0][0]).map(x => [
                x,
                para,
            ]);

            if (segmentAndParagraphs.length > 1) {
                isCollapsedSelection = false;
            }
        }

        //When double click a word or sentence a trailing space will be selected as well, so separate the trailing space in another segment
        //and only format the text
        let formattedSegmentsAndParagraphs: [
            ContentModelSegment,
            ContentModelParagraph | null
        ][] = [];
        segmentAndParagraphs.forEach(([segment, paragraph]) => {
            const segmentAndParagraph = adjustTrailingSpaceSelection(segment, paragraph);
            if (segmentAndParagraph) {
                formattedSegmentsAndParagraphs.push(segmentAndParagraph);
            }
        });

        const formatsAndSegments: [
            ContentModelSegmentFormat,
            ContentModelSegment | null,
            ContentModelParagraph | null
        ][] = pendingFormat
            ? [[pendingFormat, null, null]]
            : formattedSegmentsAndParagraphs.map(item => [item[0].format, item[0], item[1]]);

        const isTurningOff = segmentHasStyleCallback
            ? formatsAndSegments.every(([format, segment, paragraph]) =>
                  segmentHasStyleCallback(format, segment, paragraph)
              )
            : false;

        formatsAndSegments.forEach(([format, segment]) =>
            toggleStyleCallback(format, !isTurningOff, segment)
        );

        if (!pendingFormat && isCollapsedSelection) {
            const pos = editor.getFocusedPosition();

            if (pos) {
                setPendingFormat(editor, formattedSegmentsAndParagraphs[0][0].format, pos);
            }
        }

        if (isCollapsedSelection) {
            editor.focus();
            return false;
        } else {
            return formatsAndSegments.length > 0;
        }
    });
}
