import ContentModelRibbonButton from './ContentModelRibbonButton';
import MainPaneBase from '../../MainPaneBase';

/**
 * Key of localized strings of Popout button
 */
export type PopoutButtonStringKey = 'buttonNamePopout';

/**
 * "Popout" button on the format ribbon
 */
export const popout: ContentModelRibbonButton<PopoutButtonStringKey> = {
    key: 'buttonNamePopout',
    unlocalizedText: 'Open in a separate window',
    iconName: 'OpenInNewWindow',
    flipWhenRtl: true,
    onClick: _ => {
        MainPaneBase.getInstance().popout();
    },
};
