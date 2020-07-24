import ContentEditFeatureSettings from './ContentEditFeatureSettings';
import { AutoLinkFeatures } from './features/autoLinkFeatures';
import { ContentEditFeatureArray, GenericContentEditFeature } from 'roosterjs-editor-core';
import { ListFeatures } from './features/listFeatures';
import { NoCycleCursorMoveFeatures } from './features/noCycleCursorMove';
import { PluginEvent } from 'roosterjs-editor-types';
import { QuoteFeatures } from './features/quoteFeatures';
import { ShortcutFeatures } from './features/shortcutFeatures';
import { StructuredNodeFeatures } from './features/structuredNodeFeatures';
import { TableFeatures } from './features/tableFeatures';

const allFeatures = {
    ...AutoLinkFeatures,
    ...ListFeatures,
    ...NoCycleCursorMoveFeatures,
    ...QuoteFeatures,
    ...ShortcutFeatures,
    ...StructuredNodeFeatures,
    ...TableFeatures,
};

export type AllContentEditFeatures = {
    [key in keyof ContentEditFeatureSettings]: GenericContentEditFeature<PluginEvent>;
};

/**
 * Get all content edit features
 */
export function getAllContentEditFeatures(): AllContentEditFeatures {
    return allFeatures;
}

/**
 * Get default content editing features for editor
 */
export default function getContentEditFeatures(
    settingsOverride?: ContentEditFeatureSettings,
    additionalFeatures?: ContentEditFeatureArray
): ContentEditFeatureArray {
    const features: ContentEditFeatureArray = [];

    Object.keys(allFeatures).forEach((key: keyof typeof allFeatures) => {
        const feature = allFeatures[key];
        const hasSettingForKey = settingsOverride && settingsOverride[key] !== undefined;

        if (
            (hasSettingForKey && settingsOverride[key]) ||
            (!hasSettingForKey && !feature.defaultDisabled)
        ) {
            features.push(feature);
        }
    });

    return features.concat(additionalFeatures || []);
}
