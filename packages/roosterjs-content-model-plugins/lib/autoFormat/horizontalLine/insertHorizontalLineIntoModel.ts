import type { HorizontalLineTriggerCharacter } from './HorizontalLineTriggerCharacter';
import type {
    ContentModelBlockFormat,
    FormatContentModelContext,
    ShallowMutableContentModelDocument,
} from 'roosterjs-content-model-types';
import {
    addBlock,
    createContentModelDocument,
    createDivider,
    mergeModel,
} from 'roosterjs-content-model-dom';

const HorizontalLineStyles: Map<HorizontalLineTriggerCharacter, ContentModelBlockFormat> = new Map([
    [
        '-',
        {
            borderTop: '1px none',
            borderRight: '1px none',
            borderBottom: '1px solid',
            borderLeft: '1px none',
        },
    ],
    [
        '=',
        {
            borderTop: '3pt double',
            borderRight: '3pt none',
            borderBottom: '3pt double',
            borderLeft: '3pt none',
        },
    ],
    [
        '_',
        {
            borderTop: '1px solid',
            borderRight: '1px none',
            borderBottom: '1px solid',
            borderLeft: '1px none',
        },
    ],
    [
        '*',
        {
            borderTop: '1px none',
            borderRight: '1px none',
            borderBottom: '1px dashed',
            borderLeft: '1px none',
        },
    ],
    [
        '~',
        {
            borderTop: '1px wave',
            borderRight: '1px none',
            borderBottom: '1px wave',
            borderLeft: '1px none',
        },
    ],
    [
        '#',
        {
            borderTop: '3pt double',
            borderRight: '3pt none',
            borderBottom: '3pt double',
            borderLeft: '3pt none',
        },
    ],
]);

/**
 * @internal
 * Create a horizontal line and insert it into the model
 * @param model the model to insert horizontal line into
 * @param context the formatting context
 */
export function insertHorizontalLineIntoModel(
    model: ShallowMutableContentModelDocument,
    context: FormatContentModelContext,
    triggerChar: HorizontalLineTriggerCharacter
) {
    const hr = createDivider('hr', HorizontalLineStyles.get(triggerChar));
    const doc = createContentModelDocument();
    addBlock(doc, hr);

    mergeModel(model, doc, context);
}
