import ContentModelRibbonButton from './ContentModelRibbonButton';
import { BulletedListButtonStringKey } from 'roosterjs-react';
import { toggleBullet } from 'roosterjs-content-model-editor';

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
