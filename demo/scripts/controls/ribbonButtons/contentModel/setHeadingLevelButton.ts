import ContentModelRibbonButton from './ContentModelRibbonButton';
import { getButtons, HeadingButtonStringKey, KnownRibbonButtonKey } from 'roosterjs-react';
import { setHeadingLevel } from 'roosterjs-content-model-editor';

const originalHeadingButton: ContentModelRibbonButton<HeadingButtonStringKey> = (getButtons([
    KnownRibbonButtonKey.Heading,
])[0] as any) as ContentModelRibbonButton<HeadingButtonStringKey>;
const keys: HeadingButtonStringKey[] = [
    'buttonNameNoHeading',
    'buttonNameHeading1',
    'buttonNameHeading2',
    'buttonNameHeading3',
    'buttonNameHeading4',
    'buttonNameHeading5',
    'buttonNameHeading6',
];

export const setHeadingLevelButton: ContentModelRibbonButton<HeadingButtonStringKey> = {
    dropDownMenu: {
        ...originalHeadingButton.dropDownMenu,
    },
    key: 'buttonNameHeading',
    unlocalizedText: 'Heading',
    iconName: 'Header1',
    onClick: (editor, key) => {
        const headingLevel = keys.indexOf(key);

        setHeadingLevel(editor, headingLevel as 0 | 1 | 2 | 3 | 4 | 5 | 6);
    },
};
