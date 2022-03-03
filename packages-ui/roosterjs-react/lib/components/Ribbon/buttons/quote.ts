import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { toggleBlockQuote } from 'roosterjs-editor-api';

/**
 * "Quote" button on the format ribbon
 */
export const quote: RibbonButton = {
    key: 'quote',
    unlocalizedText: 'Quote',
    iconName: 'RightDoubleQuote',
    checked: formatState => formatState.isBlockQuote,
    onClick: editor => {
        toggleBlockQuote(editor);
        return true;
    },
};
