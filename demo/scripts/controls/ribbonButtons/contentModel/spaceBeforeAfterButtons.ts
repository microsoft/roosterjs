import { RibbonButton } from 'roosterjs-react';
import { isContentModelEditor, toggleMargins } from 'roosterjs-content-model';

const spaceAfterButtonKey = 'buttonNameSpaceAfter';
const spaceBeforeButtonKey = 'buttonNameSpaceBefore';

/**
 * @internal
 * "Bold" button on the format ribbon
 */
export const spaceAfterButton: RibbonButton<typeof spaceAfterButtonKey> = {
    key: spaceAfterButtonKey,
    unlocalizedText: 'Remove space after',
    iconName: 'CaretDown8',
    isChecked: formatState => +formatState.marginBottom < 0,
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            toggleMargins(editor, {
                marginBottom: '-8pt',
            });
        }
        return true;
    },
};

/**
 * @internal
 * "Bold" button on the format ribbon
 */
export const spaceBeforeButton: RibbonButton<typeof spaceBeforeButtonKey> = {
    key: spaceBeforeButtonKey,
    unlocalizedText: 'Add space before',
    iconName: 'CaretUp8',
    isChecked: formatState => +formatState.marginTop > 0,
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            toggleMargins(editor, {
                marginTop: '12pt',
            });
        }
        return true;
    },
};
