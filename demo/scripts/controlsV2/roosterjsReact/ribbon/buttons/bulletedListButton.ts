import { toggleBullet } from 'roosterjs-content-model-api';
import type { BulletedListButtonStringKey } from '../type/RibbonButtonStringKeys';
import type { RibbonButton } from '../type/RibbonButton';

/**
 * @internal
 * "Bulleted list" button on the format ribbon
 */
export const bulletedListButton: RibbonButton<BulletedListButtonStringKey> = {
    key: 'buttonNameBulletedList',
    unlocalizedText: 'Bulleted list',
    iconName: 'BulletedList',
    isChecked: formatState => formatState.isBullet,
    category: 'format',
    onClick: editor => {
        toggleBullet(editor);
    },
};
