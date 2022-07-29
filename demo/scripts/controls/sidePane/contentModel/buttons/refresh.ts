import { RibbonButton } from 'roosterjs-react';

export const refreshButton: RibbonButton<'buttonNameRefresh'> = {
    key: 'buttonNameRefresh',
    unlocalizedText: 'Refresh',
    iconName: 'Refresh',
    onClick: editor => {
        editor.triggerContentChangedEvent('RefreshModel');
    },
};
