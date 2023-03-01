import { EditorContext } from 'roosterjs-content-model/lib/publicTypes';
import { ExperimentalFeatures } from 'roosterjs-editor-types/lib';

/**
 * @internal
 */
export default function isFeatureEnabled(context: EditorContext, feature: ExperimentalFeatures) {
    return context.isFeatureEnabled(feature);
}
