import { ContentEditFeatureSettings } from 'roosterjs-editor-types';
import { getAllFeatures } from 'roosterjs-editor-plugins/lib/ContentEdit';

export default function getDefaultContentEditFeatureSettings() {
    const allFeatures = getAllFeatures();
    return Object.keys(allFeatures).reduce(
        (settings: ContentEditFeatureSettings, key: keyof ContentEditFeatureSettings) => {
            settings[key] = !allFeatures[key].defaultDisabled;
            return settings;
        },
        <ContentEditFeatureSettings>{}
    );
}
