import { ContentEditFeatureSettings } from 'roosterjs-editor-types';
import { getAllFeatures } from 'roosterjs-editor-plugins';
import { getObjectKeys } from 'roosterjs-content-model-dom';

const listFeatures = {
    autoBullet: false,
    indentWhenTab: false,
    outdentWhenShiftTab: false,
    outdentWhenBackspaceOnEmptyFirstLine: false,
    outdentWhenEnterOnEmptyLine: false,
    mergeInNewLineWhenBackspaceOnFirstChar: false,
    maintainListChain: false,
    maintainListChainWhenDelete: false,
    autoNumberingList: false,
    autoBulletList: false,
    mergeListOnBackspaceAfterList: false,
    outdentWhenAltShiftLeft: false,
    indentWhenAltShiftRight: false,
};

export function getDefaultContentEditFeatureSettings(): ContentEditFeatureSettings {
    const allFeatures = getAllFeatures();

    return {
        ...getObjectKeys(allFeatures).reduce((settings, key) => {
            settings[key] = !allFeatures[key].defaultDisabled;
            return settings;
        }, <ContentEditFeatureSettings>{}),
        ...listFeatures,
    };
}
