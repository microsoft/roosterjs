import { MainPaneBase } from '../mainPane/MainPaneBase';
import type { RibbonButton } from '../roosterjsReact/ribbon';

/**
 * Key of localized strings of Popout button
 */
export type PopoutButtonStringKey = 'buttonNamePopout';

/**
 * "Popout" button on the format ribbon
 */
export const popoutButton: RibbonButton<PopoutButtonStringKey> = {
    key: 'buttonNamePopout',
    unlocalizedText: 'Open in a separate window',
    iconName: 'OpenInNewWindow',
    flipWhenRtl: true,
    onClick: _ => {
        MainPaneBase.getInstance().popout();
    },
};
