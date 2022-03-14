import MainPaneBase from '../MainPaneBase';
import { RibbonButton } from 'roosterjs-react';

/**
 * Key of localized strings of Dark mode button
 */
export type DarkModeButtonStringKey = 'buttonNameDarkMode';

/**
 * "Dark mode" button on the format ribbon
 */
export const darkMode: RibbonButton<DarkModeButtonStringKey> = {
    key: 'buttonNameDarkMode',
    unlocalizedText: 'Dark Mode',
    iconName: 'ClearNight',
    isChecked: formatState => formatState.isDarkMode,
    onClick: editor => {
        editor.setDarkModeState(!editor.isDarkMode());
        editor.focus();

        // Let main pane know this state change so that it can be persisted when pop out/pop in
        MainPaneBase.getInstance().toggleDarkMode();
        return true;
    },
};
