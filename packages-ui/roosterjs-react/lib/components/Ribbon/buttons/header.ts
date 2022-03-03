import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { toggleHeader } from 'roosterjs-editor-api';

const headers = {
    header1: 'Header 1',
    header2: 'Header 2',
    header3: 'Header 3',
    header4: 'Header 4',
    header5: 'Header 5',
    header6: 'Header 6',
    headerDivider: '-',
    noHeader: 'No header',
};

/**
 * "Header" button on the format ribbon
 */
export const header: RibbonButton = {
    key: 'header',
    unlocalizedText: 'Header',
    iconName: 'Header1',
    dropDownItems: headers,
    onClick: (editor, key) => {
        const index = Object.keys(headers).indexOf(key) + 1;

        if (index > 6) {
            toggleHeader(editor, 0);
        } else if (index > 0) {
            toggleHeader(editor, index);
        }
    },
};
