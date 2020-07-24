import { ContentEditFeatureArray, ContentEditFeatureMap } from '../interfaces/ContentEditFeature';

/**
 * @internal
 * Add a Content Edit feature
 * @param feature The feature to add
 */
export default function addContentEditFeatures(
    featureMap: ContentEditFeatureMap,
    features: ContentEditFeatureArray
) {
    (features || []).forEach(feature => {
        feature?.keys.forEach(key => {
            let array = featureMap[key] || [];
            array.push(feature);
            featureMap[key] = array;
        });
    });
}
