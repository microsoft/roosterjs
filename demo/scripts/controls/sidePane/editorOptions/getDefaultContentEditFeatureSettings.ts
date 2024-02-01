import { ContentEditFeatureSettings } from 'roosterjs-editor-types';
import { getAllFeatures } from 'roosterjs-editor-plugins/lib/ContentEdit';
import { getObjectKeys } from 'roosterjs-editor-dom';

export default function getDefaultContentEditFeatureSettings(): ContentEditFeatureSettings {
    const allFeatures = getAllFeatures();
    return {
        ...getObjectKeys(allFeatures).reduce((settings, key) => {
            settings[key] = !allFeatures[key].defaultDisabled;
            return settings;
        }, <ContentEditFeatureSettings>{}),
        indentWhenAltShiftRight: false,
        outdentWhenAltShiftLeft: false,
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
    };
}
