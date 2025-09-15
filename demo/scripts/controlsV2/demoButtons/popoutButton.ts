import { MainPane } from '../mainPane/MainPane';
import type { RibbonButton } from 'roosterjs-react';

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
    onClick: editor => {
        MainPane.getInstance(editor.getOwner()).popout();
    },
    commandBarProperties: {
        buttonStyles: {
            icon: { paddingBottom: '10px' },
        },
    },
};
