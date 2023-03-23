import { BulletListType } from 'roosterjs-editor-types';
import { isContentModelEditor } from 'roosterjs-content-model';
import { RibbonButton } from 'roosterjs-react';
import { setListStyle } from 'roosterjs-content-model';

const dropDownMenuItems = {
    [BulletListType.Disc]: 'Disc',
    [BulletListType.Dash]: 'Dash',
    [BulletListType.Square]: 'Square',
    [BulletListType.ShortArrow]: 'ShortArrow',
    [BulletListType.LongArrow]: 'LongArrow',
    [BulletListType.UnfilledArrow]: 'UnfilledArrow',
    [BulletListType.Hyphen]: 'Hyphen',
    [BulletListType.DoubleLongArrow]: 'DoubleLongArrow',
    [BulletListType.Circle]: 'Circle',
};

export const setBulletedListStyleButton: RibbonButton<'ribbonButtonBulletedListStyle'> = {
    key: 'ribbonButtonBulletedListStyle',
    dropDownMenu: { items: dropDownMenuItems },
    unlocalizedText: 'Set unordered list style',
    iconName: 'BulletedList',
    isDisabled: formatState => !formatState.isBullet,
    onClick: (editor, key) => {
        const li = editor.getElementAtCursor('li') as HTMLLIElement;
        const value = parseInt(key) as BulletListType;

        if (
            isContentModelEditor(editor) &&
            li &&
            value >= BulletListType.Min &&
            value <= BulletListType.Max
        ) {
            editor.select(li);

            setListStyle(editor, {
                unorderedStyleType: value,
            });
        }
    },
};
