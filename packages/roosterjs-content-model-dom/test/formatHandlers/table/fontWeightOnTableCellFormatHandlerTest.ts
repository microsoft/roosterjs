import { BoldFormat, DomToModelContext, ModelToDomContext } from 'roosterjs-content-model-types';
import { createDomToModelContext, createModelToDomContext } from '../../../lib';
import { fontWeightOnTableCellFormatHandler } from '../../../lib/formatHandlers/table/fontWeightOnTableCellFormatHandler';

describe('fontWeightOnTableCellFormatHandler.apply', () => {
    let th: HTMLTableCellElement;
    let format: BoldFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        context = createModelToDomContext();
    });

    it('remove font weight', () => {
        th = document.createElement('th');
        format = { fontWeight: 'normal' };
        fontWeightOnTableCellFormatHandler.apply(format, th, context);
        expect(th.style.fontWeight).toEqual('normal');
    });

    it(' do not remove font weight', () => {
        th = document.createElement('td');
        format = {};
        fontWeightOnTableCellFormatHandler.apply(format, th, context);
        expect(th.style.fontWeight).toEqual('');
    });
});

describe('fontWeightOnTableCellFormatHandler.parse', () => {
    let th: HTMLTableCellElement;
    let format: BoldFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('remove font weight', () => {
        th = document.createElement('td');
        th.style.fontWeight = 'normal';
        format = { fontWeight: undefined };
        fontWeightOnTableCellFormatHandler.parse(format, th, context, {});
        expect(format.fontWeight).toEqual('normal');
    });

    it('do not remove font weight', () => {
        th = document.createElement('td');
        th.style.fontWeight = '';
        format = {};
        fontWeightOnTableCellFormatHandler.parse(format, th, context, {});
        expect(format.fontWeight).toBeUndefined();
    });
});
