import { BoldFormat, ModelToDomContext } from 'roosterjs-content-model-types';
import { createModelToDomContext } from '../../../lib';
import { fontWeightOnTableCellFormatHandler } from '../../../lib/formatHandlers/table/fontWeightOnTableCellFormatHandler';

describe('fontWeightOnTableCellFormatHandler.apply', () => {
    let th: HTMLTableCellElement;
    let format: BoldFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        format = {};
        context = createModelToDomContext();
    });

    it('remove font weight', () => {
        th = document.createElement('th');
        fontWeightOnTableCellFormatHandler.apply(format, th, context);
        expect(th.style.fontWeight).toEqual('normal');
    });

    it(' do not remove font weight', () => {
        th = document.createElement('td');
        fontWeightOnTableCellFormatHandler.apply(format, th, context);
        expect(th.style.fontWeight).toEqual('');
    });
});
