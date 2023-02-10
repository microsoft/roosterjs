import { RibbonButton } from 'roosterjs-react';
import { isContentModelEditor, setParagraphMargin } from 'roosterjs-content-model';

const spaceAfterButtonKey = 'buttonNameSpaceAfter';
const spaceBeforeButtonKey = 'buttonNameSpaceBefore';

/**
 * @internal
 * "Add space after" button on the format ribbon
 */
export const spaceAfterButton: RibbonButton<typeof spaceAfterButtonKey> = {
    key: spaceAfterButtonKey,
    unlocalizedText: 'Remove space after',
    iconName: 'CaretDown8',
    isChecked: formatState => !formatState.marginBottom || parseInt(formatState.marginBottom) <= 0,
    onClick: (editor, _, _1, _2, { marginBottom }) => {
        if (isContentModelEditor(editor)) {
            setParagraphMargin(
                editor,
                undefined /* marginTop */,
                parseInt(marginBottom) ? null : '8pt'
            );
        }
        return true;
    },
};

/**
 * @internal
 * "Add space before" button on the format ribbon
 */
export const spaceBeforeButton: RibbonButton<typeof spaceBeforeButtonKey> = {
    key: spaceBeforeButtonKey,
    unlocalizedText: 'Add space before',
    iconName: 'CaretUp8',
    isChecked: formatState => parseInt(formatState.marginTop) > 0,
    onClick: (editor, _, _1, _2, { marginTop }) => {
        if (isContentModelEditor(editor)) {
            setParagraphMargin(
                editor,
                parseInt(marginTop) ? null : '12pt',
                undefined /* marginBottom */
            );
        }
        return true;
    },
};
