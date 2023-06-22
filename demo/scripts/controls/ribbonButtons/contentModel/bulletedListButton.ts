import { BulletedListButtonStringKey, RibbonButton } from 'roosterjs-react';
import { isContentModelEditor, toggleBullet } from 'roosterjs-content-model-editor';

/**
 * @internal
 * "Bulleted list" button on the format ribbon
 */
export const bulletedListButton: RibbonButton<BulletedListButtonStringKey> = {
    key: 'buttonNameBulletedList',
    unlocalizedText: 'Bulleted list',
    iconName: 'BulletedList',
    isChecked: formatState => formatState.isBullet,
    onClick: editor => {
        if (isContentModelEditor(editor)) {
            toggleBullet(editor);
        }
        return true;
    },
};
