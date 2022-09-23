import RibbonButton from '../../type/RibbonButton';
import { BulletedListButtonStringKey } from '../../type/RibbonButtonStringKeys';
import { toggleBullet } from 'roosterjs-editor-api';

/**
 * @internal
 * "Bulleted list" button on the format ribbon
 */
export const bulletedList: RibbonButton<BulletedListButtonStringKey> = {
    key: 'buttonNameBulletedList',
    unlocalizedText: 'Bulleted list',
    iconName: 'BulletedList',
    isChecked: formatState => !!formatState.isBullet,
    onClick: editor => {
        toggleBullet(editor);
        return true;
    },
};
