import { RibbonButton } from '../../../../controlsV2/roosterjsReact/ribbon';

export const refreshButton: RibbonButton<'buttonNameRefresh'> = {
    key: 'buttonNameRefresh',
    unlocalizedText: 'Refresh',
    iconName: 'Refresh',
    onClick: editor => {
        editor.triggerEvent('contentChanged', {
            source: 'RefreshModel',
        });
    },
};
