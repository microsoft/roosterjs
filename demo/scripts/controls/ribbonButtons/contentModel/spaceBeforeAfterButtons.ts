import ContentModelRibbonButton from './ContentModelRibbonButton';
import { getFormatState, setParagraphMargin } from 'roosterjs-content-model-api';

const spaceAfterButtonKey = 'buttonNameSpaceAfter';
const spaceBeforeButtonKey = 'buttonNameSpaceBefore';

/**
 * @internal
 * "Add space after" button on the format ribbon
 */
export const spaceAfterButton: ContentModelRibbonButton<typeof spaceAfterButtonKey> = {
    key: spaceAfterButtonKey,
    unlocalizedText: 'Remove space after',
    iconName: 'CaretDown8',
    isChecked: formatState => !formatState.marginBottom || parseInt(formatState.marginBottom) <= 0,
    onClick: editor => {
        const marginBottom = getFormatState(editor).marginBottom;
        setParagraphMargin(
            editor,
            undefined /* marginTop */,
            parseInt(marginBottom) ? null : '8pt'
        );

        return true;
    },
};

/**
 * @internal
 * "Add space before" button on the format ribbon
 */
export const spaceBeforeButton: ContentModelRibbonButton<typeof spaceBeforeButtonKey> = {
    key: spaceBeforeButtonKey,
    unlocalizedText: 'Add space before',
    iconName: 'CaretUp8',
    isChecked: formatState => parseInt(formatState.marginTop) > 0,
    onClick: editor => {
        const marginTop = getFormatState(editor).marginTop;
        setParagraphMargin(
            editor,
            parseInt(marginTop) ? null : '12pt',
            undefined /* marginBottom */
        );

        return true;
    },
};
