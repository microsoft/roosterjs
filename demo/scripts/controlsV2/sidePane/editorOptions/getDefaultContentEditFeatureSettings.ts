import { ContentEditFeatureSettings } from 'roosterjs-editor-types';
import { getAllFeatures } from 'roosterjs-editor-plugins';
import { getObjectKeys } from 'roosterjs-content-model-dom';

export function getDefaultContentEditFeatureSettings(): ContentEditFeatureSettings {
    const allFeatures = getAllFeatures();

    return {
        ...getObjectKeys(allFeatures).reduce((settings, key) => {
            settings[key] = !allFeatures[key].defaultDisabled;
            return settings;
        }, <ContentEditFeatureSettings>{}),
    };
}
