import { ContentEditFeatureSettings } from './OptionState';
import { getAllFeatures as getAllFeaturesOriginal } from 'roosterjs-editor-plugins';
import { getObjectKeys } from 'roosterjs-content-model-dom';
import {
    BuildInEditFeature,
    ContentEditFeatureSettings as ContentEditFeatureSettingsOriginal,
    PluginEvent,
} from 'roosterjs-editor-types';

const PortedFeatureKeys: (keyof ContentEditFeatureSettingsOriginal)[] = [
    'autoBullet',
    'indentWhenTab',
    'outdentWhenShiftTab',
    'mergeInNewLineWhenBackspaceOnFirstChar',
    'mergeListOnBackspaceAfterList',
    'maintainListChain',
    'maintainListChainWhenDelete',
    'autoBulletList',
    'outdentWhenAltShiftLeft',
    'outdentWhenBackspaceOnEmptyFirstLine',
    'outdentWhenEnterOnEmptyLine',
    'unquoteWhenBackspaceOnEmptyFirstLine',
    'upDownInTable',
    'autoNumberingList',
    'indentWhenAltShiftRight',
    'unquoteWhenEnterOnEmptyLine',
];

export function getAllFeatures(): Record<
    keyof ContentEditFeatureSettings,
    BuildInEditFeature<PluginEvent>
> {
    const allFeatures = getAllFeaturesOriginal();

    return {
        ...getObjectKeys(allFeatures).reduce((features, key) => {
            if (isContentEditFeatureKey(key)) {
                features[key] = allFeatures[key];
            }
            return features;
        }, {} as Record<keyof ContentEditFeatureSettings, BuildInEditFeature<PluginEvent>>),
    };
}

export function getDefaultContentEditFeatureSettings(): ContentEditFeatureSettingsOriginal {
    const allFeatures = getAllFeaturesOriginal();

    return {
        ...getObjectKeys(allFeatures).reduce((settings, key) => {
            settings[key] =
                PortedFeatureKeys.indexOf(key) >= 0 ? false : !allFeatures[key].defaultDisabled;
            return settings;
        }, <ContentEditFeatureSettingsOriginal>{}),
    };
}

function isContentEditFeatureKey(key: string): key is keyof ContentEditFeatureSettings {
    return PortedFeatureKeys.indexOf(key as any) >= 0;
}
