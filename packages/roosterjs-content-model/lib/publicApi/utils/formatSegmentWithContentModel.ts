import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { formatWithContentModel } from './formatWithContentModel';
import { getSelectedSegments } from '../../modelApi/selection/collectSelections';
import { selectWord } from '../utils/selectWord';
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
    toggleStyleCallback: (format: ContentModelSegmentFormat, isTuringOn: boolean) => void,
    segmentHasStyleCallback?: (format: ContentModelSegmentFormat) => boolean,
    includingFormatHolder?: boolean,
    domToModelOptions?: DomToModelOption
) {
    formatWithContentModel(
        editor,
        apiName,
        model => {
            let segments = getSelectedSegments(model, !!includingFormatHolder);
            const pendingFormat = editor.getPendingFormat();
            const isCollapsedSelection =
                segments.length == 1 && segments[0].segmentType == 'SelectionMarker';

            if (isCollapsedSelection) {
                segments = selectWord([model], segments[0]);
            }

            const formats = pendingFormat
                ? [pendingFormat]
                : segments.map(segment => segment.format);

            const isTurningOff = segmentHasStyleCallback
                ? formats.every(format => segmentHasStyleCallback(format))
                : false;

            formats.forEach(format => toggleStyleCallback(format, !isTurningOff));

            return formats.length > 0;
        },
        domToModelOptions
    );
}
