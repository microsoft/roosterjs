import { GenericContentEditFeature } from '../../interfaces/ContentEditFeature';
import { PluginEvent } from 'roosterjs-editor-types';

/**
 * @internal
 * Add a Content Edit feature
 * @param feature The feature to add
 */
export default function addContentEditFeatures(
    featureMap: Record<number, GenericContentEditFeature<PluginEvent>[]>,
    features: GenericContentEditFeature<PluginEvent>[]
) {
    (features || []).forEach(feature => {
        feature?.keys.forEach(key => {
            let array = featureMap[key] || [];
            array.push(feature);
            featureMap[key] = array;
        });
    });

    return featureMap;
}
