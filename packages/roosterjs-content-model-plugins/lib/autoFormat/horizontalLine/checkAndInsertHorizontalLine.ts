import type {
    ContentModelDividerFormat,
    FormatContentModelContext,
    ReadonlyContentModelDocument,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';
import {
    addBlock,
    createContentModelDocument,
    createDivider,
    mergeModel,
} from 'roosterjs-content-model-dom';

/**
 * @internal
 */
export type HorizontalLineTriggerCharacter = '-' | '=' | '_' | '*' | '~' | '#';
const HorizontalLineTriggerCharacters: HorizontalLineTriggerCharacter[] = [
    '-',
    '=',
    '_',
    '*',
    '~',
    '#',
];

const commonStyles: ContentModelDividerFormat = {
    width: '98%',
    display: 'inline-block',
};

const HorizontalLineStyles: Map<
    HorizontalLineTriggerCharacter,
    ContentModelDividerFormat
> = new Map([
    [
        '-',
        {
            borderTop: '1px none',
            borderRight: '1px none',
            borderBottom: '1px solid',
            borderLeft: '1px none',
            ...commonStyles,
        },
    ],
    [
        '=',
        {
            borderTop: '3pt double',
            borderRight: '3pt none',
            borderBottom: '3pt none',
            borderLeft: '3pt none',
            ...commonStyles,
        },
    ],
    [
        '_',
        {
            borderTop: '1px solid',
            borderRight: '1px none',
            borderBottom: '1px solid',
            borderLeft: '1px none',
            ...commonStyles,
        },
    ],
    [
        '*',
        {
            borderTop: '1px none',
            borderRight: '1px none',
            borderBottom: '3px dotted',
            borderLeft: '1px none',
            ...commonStyles,
        },
    ],
    [
        '~',
        {
            borderTop: '1px none',
            borderRight: '1px none',
            borderBottom: '1px solid',
            borderLeft: '1px none',
            ...commonStyles,
        },
    ],
    [
        '#',
        {
            borderTop: '3pt double',
            borderRight: '3pt none',
            borderBottom: '3pt double',
            borderLeft: '3pt none',
            ...commonStyles,
        },
    ],
]);

/**
 * @internal exported only for unit test
 *
 * Create a horizontal line and insert it into the model
 *
 * @param model the model to insert horizontal line into
 * @param context the formatting context
 */
export function insertHorizontalLineIntoModel(
    model: ReadonlyContentModelDocument,
    context: FormatContentModelContext,
    triggerChar: HorizontalLineTriggerCharacter
) {
    const hr = createDivider('hr', HorizontalLineStyles.get(triggerChar));
    const doc = createContentModelDocument();
    addBlock(doc, hr);
    mergeModel(model, doc, context);
}

/**
 * @internal
 *
 * Check if the current line should be formatted as horizontal line, and insert horizontal line if needed
 *
 * @param editor The editor to check and insert horizontal line
 * @param event The keydown event
 * @returns True if horizontal line is inserted, otherwise false
 */
export const checkAndInsertHorizontalLine = (
    model: ReadonlyContentModelDocument,
    paragraph: ShallowMutableContentModelParagraph,
    context: FormatContentModelContext
) => {
    const allText = paragraph.segments.reduce(
        (acc, segment) => (segment.segmentType === 'Text' ? acc + segment.text : acc),
        ''
    );
    // At least 3 characters are needed to trigger horizontal line
    if (allText.length < 3) {
        return false;
    }

    return HorizontalLineTriggerCharacters.some(triggerCharacter => {
        const shouldFormat = allText.split('').every(char => char === triggerCharacter);
        if (shouldFormat) {
            paragraph.segments = paragraph.segments.filter(s => s.segmentType != 'Text');
            insertHorizontalLineIntoModel(model, context, triggerCharacter);
            context.canUndoByBackspace = true;
        }
        return shouldFormat;
    });
};
