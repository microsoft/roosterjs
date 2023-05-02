import RibbonButton from '../../type/RibbonButton';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { HeaderButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { toggleHeading } from 'roosterjs-editor-api';

const headers: Partial<Record<HeaderButtonStringKey, string>> = {
    buttonNameHeader1: 'Header 1',
    buttonNameHeader2: 'Header 2',
    buttonNameHeader3: 'Header 3',
    buttonNameHeader4: 'Header 4',
    buttonNameHeader5: 'Header 5',
    buttonNameHeader6: 'Header 6',
    '-': '-',
    buttonNameNoHeader: 'No header',
};

/**
 * @internal
 * "Header" button on the format ribbon
 */
export const header: RibbonButton<HeaderButtonStringKey> = {
    key: 'buttonNameHeader',
    unlocalizedText: 'Header',
    iconName: 'Header1',
    dropDownMenu: {
        items: headers,
        getSelectedItemKey: formatState => {
            return (formatState.headerLevel ?? 0) > 0
                ? 'header' + formatState.headerLevel
                : 'noHeader';
        },
    },
    onClick: (editor, key) => {
        const index = getObjectKeys(headers).indexOf(key) + 1;

        if (index > 6) {
            toggleHeading(editor, 0);
        } else if (index > 0) {
            toggleHeading(editor, index);
        }
    },
};
