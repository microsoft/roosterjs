import { clearModelFormat } from '../../modelApi/common/clearModelFormat';
import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { normalizeContentModel } from '../../modelApi/common/normalizeContentModel';

/**
 * Clear format of selection
 * @param editor The editor to clear format from
 */
export default function clearFormat(
    editor: IExperimentalContentModelEditor,
    defaultSegmentFormat?: ContentModelSegmentFormat
) {
    formatWithContentModel(editor, 'clearFormat', model => {
        const blocksToClear: [ContentModelBlockGroup[], ContentModelBlock][] = [];
        const segmentsToClear: ContentModelSegment[] = [];
        const tablesToClear: [ContentModelTable, boolean][] = [];

        clearModelFormat(
            model,
            blocksToClear,
            segmentsToClear,
            tablesToClear,
            defaultSegmentFormat
        );

        normalizeContentModel(model);

        return blocksToClear.length > 0 || segmentsToClear.length > 0 || tablesToClear.length > 0;
    });
}
