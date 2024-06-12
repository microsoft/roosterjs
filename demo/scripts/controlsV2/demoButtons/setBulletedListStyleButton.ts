import { BulletListType } from 'roosterjs-content-model-dom';
import { setListStyle } from 'roosterjs-content-model-api';
import type { RibbonButton } from 'roosterjs-react';

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
        const value = parseInt(key);

        setListStyle(editor, {
            unorderedStyleType: value,
        });
    },
};
