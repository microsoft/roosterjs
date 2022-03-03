import RibbonButton from '../../../plugins/RibbonPlugin/RibbonButton';
import { toggleBullet } from 'roosterjs-editor-api';

/**
 * "Bulleted list" button on the format ribbon
 */
export const bulletedList: RibbonButton = {
    key: 'bulletedList',
    unlocalizedText: 'Bulleted list',
    iconName: 'BulletedList',
    checked: formatState => formatState.isBullet,
    onClick: editor => {
        toggleBullet(editor);
        return true;
    },
};
