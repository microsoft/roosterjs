import RibbonButton from '../../type/RibbonButton';
import { MoreCommandsButtonStringKey } from '../../type/RibbonButtonStringKeys';

/**
 * @internal
 * "More commands" (overflow) button on the format ribbon
 */
export const moreCommands: RibbonButton<MoreCommandsButtonStringKey> = {
    key: 'buttonNameMoreCommands',
    unlocalizedText: 'More commands',
    iconName: 'MoreCommands',
    onClick: editor => {
        return true;
    },
};
