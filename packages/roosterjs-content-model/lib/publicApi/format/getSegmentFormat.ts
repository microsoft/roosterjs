import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getPendingFormat } from '../../modelApi/format/pendingFormat';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { iterateSelections } from '../../modelApi/selection/iterateSelections';

/**
 * Get current segment format. This is usually used by format painter
 * @param editor The editor to get format from
 */
export default function getSegmentFormat(
    editor: IContentModelEditor
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
                useReducedModel: true,
            }
        );
    }

    return result;
}
