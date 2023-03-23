import { isContentModelEditor } from 'roosterjs-content-model';
import { setHeaderLevel } from 'roosterjs-content-model';
import {
    getButtons,
    HeaderButtonStringKey,
    KnownRibbonButtonKey,
    RibbonButton,
} from 'roosterjs-react';

const originalHeadersButton: RibbonButton<HeaderButtonStringKey> = getButtons([
    KnownRibbonButtonKey.Header,
])[0] as RibbonButton<HeaderButtonStringKey>;
const keys: HeaderButtonStringKey[] = [
    'buttonNameNoHeader',
    'buttonNameHeader1',
    'buttonNameHeader2',
    'buttonNameHeader3',
    'buttonNameHeader4',
    'buttonNameHeader5',
    'buttonNameHeader6',
];

export const setHeaderLevelButton: RibbonButton<HeaderButtonStringKey> = {
    dropDownMenu: {
        ...originalHeadersButton.dropDownMenu,
    },
    key: 'buttonNameHeader',
    unlocalizedText: 'Header',
    iconName: 'Header1',
    onClick: (editor, key) => {
        const headerLevel = keys.indexOf(key);

        if (isContentModelEditor(editor) && headerLevel >= 0) {
            setHeaderLevel(editor, headerLevel as 0 | 1 | 2 | 3 | 4 | 5 | 6);
        }
    },
};
