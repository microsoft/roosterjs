import { MainPane } from '../mainPane/MainPane';
import { RibbonButton } from '../roosterjsReact/ribbon';

const styles = require('../mainPane/MainPane.scss');

export type tabNames = 'all' | 'text' | 'paragraph' | 'insert' | 'table' | 'image';

export type TabMainStringKey = 'tabNameMain';
export type TabTextStringKey = 'tabNameText';
export type TabParagraphStringKey = 'tabNameParagraph';
export type TabInsertStringKey = 'tabNameInsert';
export type TabTableStringKey = 'tabNameTable';
export type TabImageStringKey = 'tabNameImage';

export type AllTabStringKeys =
    | TabTableStringKey
    | TabTextStringKey
    | TabParagraphStringKey
    | TabInsertStringKey
    | TabMainStringKey
    | TabImageStringKey;

type TabData = {
    key: AllTabStringKeys;
    unlocalizedText: string;
    name: tabNames;
};

const TabNames: TabData[] = [
    { key: 'tabNameMain', unlocalizedText: 'Main', name: 'all' },
    { key: 'tabNameText', unlocalizedText: 'Text', name: 'text' },
    { key: 'tabNameParagraph', unlocalizedText: 'Paragraph', name: 'paragraph' },
    { key: 'tabNameInsert', unlocalizedText: 'Insert', name: 'insert' },
    { key: 'tabNameTable', unlocalizedText: 'Table', name: 'table' },
    { key: 'tabNameImage', unlocalizedText: 'Image', name: 'image' },
];

export function getTabs() {
    const Tabs: RibbonButton<any>[] = [];
    TabNames.forEach(tab => {
        const tabButton: RibbonButton<AllTabStringKeys> = {
            key: tab.key,
            unlocalizedText: tab.unlocalizedText,
            iconName: '',
            onClick: () => {
                MainPane.getInstance().changeRibbon(tab.name);
            },
            commandBarProperties: {
                buttonStyles: {
                    label: { fontWeight: 'bold', paddingTop: '-5px' },
                    textContainer: { paddingBottom: '10px' },
                },
                iconOnly: false,
                className: styles.menuTab,
            },
        };
        Tabs.push(tabButton);
    });

    return Tabs;
}
