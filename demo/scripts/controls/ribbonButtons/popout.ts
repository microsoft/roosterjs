import MainPaneBase from '../MainPaneBase';
import { RibbonButton } from 'roosterjs-react';

/**
 * "Popout" button on the format ribbon
 */
export const popout: RibbonButton = {
    key: 'popout',
    unlocalizedText: 'Open in a separate window',
    iconName: 'OpenInNewWindow',
    onClick: _ => {
        MainPaneBase.getInstance().popout();
    },
};
