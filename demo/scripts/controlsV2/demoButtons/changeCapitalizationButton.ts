import { changeCapitalization } from 'roosterjs-content-model-api';
import type { RibbonButton } from 'roosterjs-react';

const changeCapitalizationButtonKey = 'buttonNameChangeCapitalization';

const CAPITALIZATION_OPTIONS: Record<
    'sentence' | 'lowerCase' | 'upperCase' | 'capitalize',
    string
> = {
    sentence: 'Sentence case',
    lowerCase: 'lowercase',
    upperCase: 'UPPERCASE',
    capitalize: 'Capitalize Each Word',
};

/**
 * @internal
 * "Change capitalization" button on the format ribbon
 */
export const changeCapitalizationButton: RibbonButton<typeof changeCapitalizationButtonKey> = {
    key: changeCapitalizationButtonKey,
    unlocalizedText: 'Change capitalization',
    iconName: 'FontColorA',
    dropDownMenu: {
        items: CAPITALIZATION_OPTIONS,
    },
    onClick: (editor, key) => {
        changeCapitalization(editor, key as 'sentence' | 'lowerCase' | 'upperCase' | 'capitalize');
    },
};
