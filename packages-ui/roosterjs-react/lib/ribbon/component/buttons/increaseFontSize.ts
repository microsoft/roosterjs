import RibbonButton from '../../type/RibbonButton';
import { changeFontSize } from 'roosterjs-editor-api';
import { FontSizeChange } from 'roosterjs-editor-types';
import { IncreaseFontSizeButtonStringKey } from '../../type/RibbonButtonStringKeys';

/**
 * @internal
 * "Increase font size" button on the format ribbon
 */
export const increaseFontSize: RibbonButton<IncreaseFontSizeButtonStringKey> = {
    key: 'buttonNameIncreaseFontSize',
    unlocalizedText: 'Increase font size',
    iconName: 'FontIncrease',
    onClick: editor => {
        changeFontSize(editor, FontSizeChange.Increase);
    },
};
