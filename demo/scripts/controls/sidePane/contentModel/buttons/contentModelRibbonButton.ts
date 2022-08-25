import MainPaneBase from '../../../MainPaneBase';
import { RibbonButton } from 'roosterjs-react';

export const contentModelRibbonButton: RibbonButton<'ribbonButtonShowContentModelRibbon'> = {
    key: 'ribbonButtonShowContentModelRibbon',
    iconName: 'Edit',
    unlocalizedText: 'Show/hide Content Model ribbon',
    onClick: _ => {
        MainPaneBase.getInstance().toggleContentModelRibbon();
    },
};
