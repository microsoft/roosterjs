import { fontKerningFormatHandler } from '../../../lib/formatHandlers/segment/fontKerningFormatHandler';
import { createDomToModelContext, createModelToDomContext } from '../../../lib/index';
import type { FontKerningFormat, FontSizeFormat } from 'roosterjs-content-model-types';

describe('fontKerningFormatHandler', () => {
    it('lets standard CSS replace an inherited Word threshold', () => {
        const element = document.createElement('span');
        const format: FontKerningFormat = { wordKerningThreshold: '20pt' };
        element.style.fontKerning = 'none';

        fontKerningFormatHandler.parse(format, element, createDomToModelContext(), {});

        expect(format).toEqual({ fontKerning: 'none' });
    });

    it('reevaluates a retained threshold when font size changes', () => {
        const element = document.createElement('span');
        const context = createModelToDomContext();
        const format: FontKerningFormat & FontSizeFormat = {
            wordKerningThreshold: '20pt',
            fontSize: '24pt',
        };

        fontKerningFormatHandler.apply(format, element, context);
        expect(element.style.fontKerning).toBe('normal');
        format.fontSize = '12pt';
        fontKerningFormatHandler.apply(format, element, context);
        expect(element.style.fontKerning).toBe('none');
    });

    it('uses the already inherited size without doubling a relative size', () => {
        const element = document.createElement('span');
        const context = createModelToDomContext();
        context.rootFontSize = 16;
        context.implicitFormat.fontSize = '2em';

        fontKerningFormatHandler.apply(
            { wordKerningThreshold: '30pt', fontSize: '2em' },
            element,
            context
        );

        expect(element.style.fontKerning).toBe('none');
    });

    it('resets to auto when leaving inherited kerning formatting', () => {
        const element = document.createElement('span');
        const context = createModelToDomContext();
        context.implicitFormat.fontKerning = 'none';

        fontKerningFormatHandler.apply({}, element, context);

        expect(element.style.fontKerning).toBe('auto');
    });

    it('uses a resolved inherited font size when the run has no own size', () => {
        const element = document.createElement('span');
        const context = createModelToDomContext();
        context.implicitFormat.fontSize = '24pt';

        fontKerningFormatHandler.apply({ wordKerningThreshold: '20pt' }, element, context);

        expect(element.style.fontKerning).toBe('normal');
    });

    it('does not turn invalid modeled thresholds into disabled kerning', () => {
        const context = createModelToDomContext();
        for (const wordKerningThreshold of ['invalid', '-1pt', '0px', 'Infinitypt']) {
            const element = document.createElement('span');

            fontKerningFormatHandler.apply(
                { wordKerningThreshold, fontSize: '24pt' },
                element,
                context
            );

            expect(element.style.fontKerning).toBe('');
        }
    });
});
