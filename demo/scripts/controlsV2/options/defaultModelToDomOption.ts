import { classFormatHandler } from './classFormatHandlet';
import { ModelToDomOption } from 'roosterjs-content-model-types';

export const defaultModelToDomOption: ModelToDomOption = {
    additionalFormatAppliers: {
        block: [classFormatHandler.apply],
    },
    defaultContentModelFormatOverride: {
        p: {
            marginTop: '0',
            marginBottom: '0',
        },
    },
};
