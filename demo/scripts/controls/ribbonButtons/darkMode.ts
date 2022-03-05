import MainPaneBase from '../MainPaneBase';
import { RibbonButton } from 'roosterjs-react';

/**
 * "Dark mode" button on the format ribbon
 */
export const darkMode: RibbonButton = {
    key: 'darkMode',
    unlocalizedText: 'Dark Mode',
    iconName: 'ClearNight',
    checked: formatState => formatState.isDarkMode,
    onClick: editor => {
        editor.setDarkModeState(!editor.isDarkMode());
        editor.focus();

        // Let main pane know this state change so that it can be persisted when pop out/pop in
        MainPaneBase.getInstance().toggleDarkMode();
        return true;
    },
};
