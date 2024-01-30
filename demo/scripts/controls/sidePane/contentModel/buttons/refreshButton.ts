import ContentModelRibbonButton from '../../../ribbonButtons/contentModel/ContentModelRibbonButton';

export const refreshButton: ContentModelRibbonButton<'buttonNameRefresh'> = {
    key: 'buttonNameRefresh',
    unlocalizedText: 'Refresh',
    iconName: 'Refresh',
    onClick: editor => {
        editor.triggerEvent('contentChanged', {
            source: 'RefreshModel',
        });
    },
};
