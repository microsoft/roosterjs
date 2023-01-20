import { adjustWordSelection } from '../../modelApi/selection/adjustWordSelection';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { formatWithContentModel } from './formatWithContentModel';
import { getPendingFormat, setPendingFormat } from '../../modelApi/format/pendingFormat';
import { getSelectedSegments } from '../../modelApi/selection/collectSelections';
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
        segment: ContentModelSegment | null
    ) => boolean,
    includingFormatHolder?: boolean,
    domToModelOptions?: DomToModelOption
) {
    formatWithContentModel(
        editor,
        apiName,
        model => {
            const segments = getSelectedSegments(model, !!includingFormatHolder);
            const pendingFormat = editor.getPendingFormat();
            const formatsAndSegments: [
                ContentModelSegmentFormat,
                ContentModelSegment | null
            ][] = pendingFormat
                ? [[pendingFormat, null]]
                : segments.map(segment => [segment.format, segment]);

            const isTurningOff = segmentHasStyleCallback
                ? formatsAndSegments.every(([format, segment]) =>
                      segmentHasStyleCallback(format, segment)
                  )
                : false;

            formatsAndSegments.forEach(([format, segment]) =>
                toggleStyleCallback(format, !isTurningOff, segment)
            );

            const isCollapsedSelection =
                segments.length == 1 && segments[0].segmentType == 'SelectionMarker';

            if (!pendingFormat && isCollapsedSelection) {
                editor.setPendingFormat(segments[0].format);
            }

            if (isCollapsedSelection) {
                editor.focus();
                return false;
            } else {
                return formatsAndSegments.length > 0;
            }
        },
        domToModelOptions
    );
}
