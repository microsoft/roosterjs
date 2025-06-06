import { demoUndeletableAnchorParser } from './demoUndeletableAnchorParser';
import { DomToModelOption } from 'roosterjs-content-model-types';

export const defaultDomToModelOption: DomToModelOption = {
    additionalFormatParsers: {
        link: [demoUndeletableAnchorParser],
    },
};
