import { toggleBullet } from 'roosterjs-editor-api';
import type RibbonButton from '../../type/RibbonButton';
import type { BulletedListButtonStringKey } from '../../type/RibbonButtonStringKeys';

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
