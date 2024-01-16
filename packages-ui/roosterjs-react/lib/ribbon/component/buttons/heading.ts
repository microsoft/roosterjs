import { getObjectKeys } from 'roosterjs-editor-dom';
import { setHeadingLevel } from 'roosterjs-editor-api';
import type RibbonButton from '../../type/RibbonButton';
import type { HeadingButtonStringKey } from '../../type/RibbonButtonStringKeys';

const headings: Partial<Record<HeadingButtonStringKey, string>> = {
    buttonNameHeading1: 'Heading 1',
    buttonNameHeading2: 'Heading 2',
    buttonNameHeading3: 'Heading 3',
    buttonNameHeading4: 'Heading 4',
    buttonNameHeading5: 'Heading 5',
    buttonNameHeading6: 'Heading 6',
    '-': '-',
    buttonNameNoHeading: 'No heading',
};

/**
 * @internal
 * "Heading" button on the format ribbon
 */
export const heading: RibbonButton<HeadingButtonStringKey> = {
    key: 'buttonNameHeading',
    unlocalizedText: 'Heading',
    iconName: 'Header1',
    dropDownMenu: {
        items: headings,
        getSelectedItemKey: formatState => {
            return (formatState.headingLevel ?? 0) > 0
                ? 'heading' + formatState.headingLevel
                : 'noHeading';
        },
    },
    onClick: (editor, key) => {
        const index = getObjectKeys(headings).indexOf(key) + 1;

        if (index > 6) {
            setHeadingLevel(editor, 0);
        } else if (index > 0) {
            setHeadingLevel(editor, index);
        }
    },
};
