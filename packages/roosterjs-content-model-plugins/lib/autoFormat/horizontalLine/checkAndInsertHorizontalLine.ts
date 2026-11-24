import { getOperationalBlocks } from 'roosterjs-content-model-dom';
import { insertHorizontalLineIntoModel } from 'roosterjs-content-model-api';
import type {
    ContentModelDividerFormat,
    ContentModelListItem,
    FormatContentModelContext,
    ReadonlyContentModelDocument,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

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
 * @internal
 *
 * Check if the current line should be formatted as horizontal line, and insert horizontal line if needed
 *
 * @param model The model to check and insert horizontal line into
 * @param paragraph The paragraph to check for trigger characters
 * @param context The formatting context
 * @returns True if horizontal line is inserted, otherwise false
 */
export const checkAndInsertHorizontalLine = (
    model: ReadonlyContentModelDocument,
    paragraph: ShallowMutableContentModelParagraph,
    context: FormatContentModelContext
) => {
    // Do not create horizontal lines inside a list
    const blocks = getOperationalBlocks<ContentModelListItem>(
        model,
        ['ListItem'],
        ['TableCell', 'FormatContainer']
    );
    if (
        blocks[0] &&
        blocks[0].block.blockType == 'BlockGroup' &&
        blocks[0].block.blockGroupType == 'ListItem'
    ) {
        return false;
    }

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
            insertHorizontalLineIntoModel(
                model,
                context,
                HorizontalLineStyles.get(triggerCharacter)
            );
            context.canUndoByBackspace = true;
        }
        return shouldFormat;
    });
};
