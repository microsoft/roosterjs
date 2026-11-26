import { setListLevel } from 'roosterjs-content-model-api';
import type { RibbonButton } from 'roosterjs-react';

const MaxLevel = 5;
const dropDownMenuItems: Record<string, string> = {};

(['UL', 'OL'] as const).forEach(listType => {
    for (let level = 1; level <= MaxLevel; level++) {
        dropDownMenuItems[`${listType}_${level}`] = `${
            listType == 'UL' ? 'Bullet' : 'Numbering'
        } list - level ${level}`;
    }
});

/**
 * @internal
 * "Set list level" button on the format ribbon
 */
export const setListLevelButton: RibbonButton<'ribbonButtonSetListLevel'> = {
    key: 'ribbonButtonSetListLevel',
    dropDownMenu: { items: dropDownMenuItems },
    unlocalizedText: 'Set list level',
    iconName: 'BulletedTreeList',
    onClick: (editor, key) => {
        const [listType, level] = key.split('_');

        setListLevel(editor, listType == 'OL' ? 'OL' : 'UL', parseInt(level));
    },
};
