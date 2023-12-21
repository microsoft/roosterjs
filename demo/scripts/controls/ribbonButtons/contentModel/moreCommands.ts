import ContentModelRibbonButton from './ContentModelRibbonButton';
import { MoreCommandsButtonStringKey } from 'roosterjs-react';

/**
 * @internal
 * "More commands" (overflow) button on the format ribbon
 */
export const moreCommands: ContentModelRibbonButton<MoreCommandsButtonStringKey> = {
    key: 'buttonNameMoreCommands',
    unlocalizedText: 'More commands',
    iconName: 'MoreCommands',
    onClick: () => {
        return true;
    },
};
