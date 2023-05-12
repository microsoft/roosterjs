import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { TextColorFormat } from '../../../lib/publicTypes/format/formatParts/TextColorFormat';
import { textColorOnTableCellFormatHandler } from '../../../lib/formatHandlers/table/textColorOnTableCellFormatHandler';

describe('textColorOnTableCellFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: TextColorFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    it('No value', () => {
        textColorOnTableCellFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('No value from element, has value from context', () => {
        format.textColor = 'red';
        textColorOnTableCellFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({
            textColor: 'red',
        });
    });

    it('Has value from element, has value from context', () => {
        format.textColor = 'red';
        div.style.color = 'blue';
        textColorOnTableCellFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });
});
