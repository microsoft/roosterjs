import MainPaneBase from '../MainPaneBase';
import { RibbonButton } from 'roosterjs-react';

/**
 * Key of localized strings of Popout button
 */
export type PopoutButtonStringKey = 'buttonNamePopout';

/**
 * "Popout" button on the format ribbon
 */
export const popout: RibbonButton<PopoutButtonStringKey> = {
    key: 'buttonNamePopout',
    unlocalizedText: 'Open in a separate window',
    iconName: 'OpenInNewWindow',
    flipWhenRtl: true,
    onClick: _ => {
        MainPaneBase.getInstance().popout();
    },
};
