import ContentModelRibbonButton from './ContentModelRibbonButton';
import { toggleBullet } from 'roosterjs-content-model-api';
import { BulletedListButtonStringKey } from 'roosterjs-react';

/**
 * @internal
 * "Bulleted list" button on the format ribbon
 */
export const bulletedListButton: ContentModelRibbonButton<BulletedListButtonStringKey> = {
    key: 'buttonNameBulletedList',
    unlocalizedText: 'Bulleted list',
    iconName: 'BulletedList',
    isChecked: formatState => formatState.isBullet,
    onClick: editor => {
        toggleBullet(editor);
        return true;
    },
};
