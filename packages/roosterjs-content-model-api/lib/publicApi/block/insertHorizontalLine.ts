import { insertHorizontalLineIntoModel } from '../../modelApi/block/insertHorizontalLineIntoModel';
import type { ContentModelDividerFormat, IEditor } from 'roosterjs-content-model-types';

/**
 * Insert a horizontal line into editor at current selection, replacing selected content
 * @param editor The editor instance
 * @param format Optional divider format. Defaults to a thin solid line with 98% width
 */
export function insertHorizontalLine(editor: IEditor, format?: ContentModelDividerFormat) {
    editor.focus();

    editor.formatContentModel(
        (model, context) => insertHorizontalLineIntoModel(model, context, format),
        {
            apiName: 'insertHorizontalLine',
        }
    );
}
