import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from 'roosterjs-content-model-types';
import { getDefaultStyle } from '../../../lib/domToModel/utils/getDefaultStyle';

describe('getDefaultStyle', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Get default default style of DIV', () => {
        const div = document.createElement('div');
        const style = getDefaultStyle(div, context);

        expect(style).toEqual({
            display: 'block',
        });
    });

    it('Get default style of customized element', () => {
        const test = document.createElement('test');
        const style = getDefaultStyle(test, context);

        expect(style).toEqual({});
    });
});
