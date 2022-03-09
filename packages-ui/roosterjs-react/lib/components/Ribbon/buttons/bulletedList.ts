import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { toggleBullet } from 'roosterjs-editor-api';

/**
 * Key of localized strings of Bulleted list button
 */
export type BulletedListButtonStringKey = 'buttonNameBulletedList';

/**
 * "Bulleted list" button on the format ribbon
 */
export const bulletedList: RibbonButton<BulletedListButtonStringKey> = {
    key: 'buttonNameBulletedList',
    unlocalizedText: 'Bulleted list',
    iconName: 'BulletedList',
    checked: formatState => formatState.isBullet,
    onClick: editor => {
        toggleBullet(editor);
        return true;
    },
};
