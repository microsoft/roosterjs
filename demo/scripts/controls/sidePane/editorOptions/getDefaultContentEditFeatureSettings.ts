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
        indentWhenAltShiftRight: true,
        outdentWhenAltShiftLeft: true,
    };
}
