import { ContentModelContext } from '../../../lib/publicTypes/ContentModelContext';
import { FormatHandler } from '../../../lib/formatHandlers/FormatHandler';
import { parseFormat } from '../../../lib/domToModel/utils/parseFormat';

describe('parseFormat', () => {
    const defaultContext: ContentModelContext = {
        isDarkMode: false,
        zoomScale: 1,
        isRightToLeft: false,
    };

    it('empty handlers', () => {
        const element = document.createElement('div');
        const handlers: FormatHandler<any>[] = [];
        const format = {};

        parseFormat(element, handlers, format, defaultContext);

        expect(format).toEqual({});
    });

    it('one handlers', () => {
        const element = document.createElement('div');
        const handlers: FormatHandler<any>[] = [
            {
                parse: (format, e, c, defaultStyle) => {
                    expect(e).toBe(element);
                    expect(c).toBe(defaultContext);

                    format.a = 1;
                },
                apply: null!,
            },
        ];
        const format = {};

        parseFormat(element, handlers, format, defaultContext);

        expect(format).toEqual({ a: 1 });
    });
});
