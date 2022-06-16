import MainPaneBase from '../MainPaneBase';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { RibbonButton } from 'roosterjs-react';

const DropDownItems = {
    'zoom50%': '50%',
    'zoom75%': '75%',
    'zoom100%': '100%',
    'zoom150%': '150%',
    'zoom200%': '200%',
};

const DropDownValues: { [key in keyof typeof DropDownItems]: number } = {
    'zoom50%': 0.5,
    'zoom75%': 0.75,
    'zoom100%': 1,
    'zoom150%': 1.5,
    'zoom200%': 2,
};

/**
 * Key of localized strings of Zoom button
 */
export type ZoomButtonStringKey = 'buttonNameZoom';

/**
 * "Zoom" button on the format ribbon
 */
export const zoom: RibbonButton<ZoomButtonStringKey> = {
    key: 'buttonNameZoom',
    unlocalizedText: 'Zoom',
    iconName: 'ZoomIn',
    dropDownMenu: {
        items: DropDownItems,
        getSelectedItemKey: formatState =>
            getObjectKeys(DropDownItems).filter(
                key => DropDownValues[key] == formatState.zoomScale
            )[0],
    },
    onClick: (editor, key) => {
        const zoomScale = DropDownValues[key as keyof typeof DropDownItems];
        editor.setZoomScale(zoomScale);
        editor.focus();

        // Let main pane know this state change so that it can be persisted when pop out/pop in
        MainPaneBase.getInstance().setScale(zoomScale);
        return true;
    },
};
