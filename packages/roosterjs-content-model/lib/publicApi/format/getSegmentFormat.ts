import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getPendingFormat } from './pendingFormat';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { iterateSelections } from '../../modelApi/selection/iterateSelections';
import { reducedModelChildProcessor } from '../../domToModel/processors/reducedModelChildProcessor';

/**
 * Get current segment format. This is usually used by format painter
 * @param editor The editor to get format from
 */
export default function getSegmentFormat(
    editor: IExperimentalContentModelEditor
): ContentModelSegmentFormat | null {
    let result = getPendingFormat(editor);

    if (!result) {
        formatWithContentModel(
            editor,
            'getSegmentFormat',
            model => {
                iterateSelections(
                    [model],
                    (path, tableContext, block, segments) => {
                        result = segments?.[0]?.format || null;
                        return true;
                    },
                    {
                        includeListFormatHolder: 'never',
                    }
                );

                return false;
            },
            {
                processorOverride: {
                    // Create a "reduced" Content Model that only scan a sub DOM tree that contains the selection.
                    child: reducedModelChildProcessor,
                },
            }
        );
    }

    return result;
}
