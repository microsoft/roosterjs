import { getDefaultStyle } from '../../../lib/domToModel/utils/getDefaultStyle';

describe('getDefaultStyle', () => {
    it('Get default default style of DIV', () => {
        const div = document.createElement('div');
        const style = getDefaultStyle(div);

        expect(style).toEqual({
            display: 'block',
        });
    });

    it('Get default style of customized element', () => {
        const test = document.createElement('test');
        const style = getDefaultStyle(test);

        expect(style).toEqual({});
    });
});
