import { setHeadingLevel } from 'roosterjs-content-model-api';
import type { HeadingButtonStringKey } from '../type/RibbonButtonStringKeys';
import type { RibbonButton } from '../type/RibbonButton';

const keys: HeadingButtonStringKey[] = [
    'buttonNameNoHeading',
    'buttonNameHeading1',
    'buttonNameHeading2',
    'buttonNameHeading3',
    'buttonNameHeading4',
    'buttonNameHeading5',
    'buttonNameHeading6',
];
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

export const setHeadingLevelButton: RibbonButton<HeadingButtonStringKey> = {
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
        const headingLevel = keys.indexOf(key);

        setHeadingLevel(editor, headingLevel as 0 | 1 | 2 | 3 | 4 | 5 | 6);
    },
};
