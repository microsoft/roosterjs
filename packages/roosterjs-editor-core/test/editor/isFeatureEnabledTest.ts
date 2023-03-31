import { ExperimentalFeatures } from 'roosterjs-editor-types';
import { isFeatureEnabled } from '../../lib/editor/isFeatureEnabled';

describe('isFeatureEnabled', () => {
    it('Enabled feature', () => {
        const allFeatures = [
            ExperimentalFeatures.DeleteTableWithBackspace,
            ExperimentalFeatures.InlineEntityReadOnlyDelimiters,
        ];
        const result = isFeatureEnabled(allFeatures, ExperimentalFeatures.DeleteTableWithBackspace);

        expect(result).toBeTrue();
    });

    it('Disabled feature', () => {
        const allFeatures = [ExperimentalFeatures.InlineEntityReadOnlyDelimiters];
        const result = isFeatureEnabled(allFeatures, ExperimentalFeatures.DeleteTableWithBackspace);

        expect(result).toBeFalse();
    });
});
