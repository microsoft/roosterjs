import { computedSegmentFormatHandler } from '../../../lib/formatHandlers/segment/computedSegmentFormatHandler';
import { ContentModelSegmentFormat } from '../../../lib/publicTypes/format/ContentModelSegmentFormat';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';

describe('computedSegmentFormatHandler.parse', () => {
    let div: HTMLElement;
    let context: DomToModelContext;
    let format: ContentModelSegmentFormat;

    beforeEach(() => {
        div = document.createElement('div');
        context = createDomToModelContext();
        format = {};
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
    });

    it('no style', () => {
        computedSegmentFormatHandler.parse(format, div, context, {});

        expect(format.fontWeight).toBeUndefined();
        expect(format.fontFamily).toBeDefined();
        expect(format.fontSize).toBeDefined();
        expect(format.textColor).toBeDefined();
        expect(format.italic).toBeFalse();
        expect(format.strikethrough).toBeFalse();
        expect(format.underline).toBeFalse();
        expect(format.backgroundColor).toBeUndefined();
    });

    it('has style', () => {
        div.style.fontWeight = 'bold';
        div.style.fontFamily = 'Arial';
        div.style.fontSize = '20pt';
        div.style.color = 'red';
        div.style.backgroundColor = 'blue';
        div.style.textDecoration = 'underline';
        div.style.fontStyle = 'italic';
        div.style.verticalAlign = 'sub';

        computedSegmentFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            fontWeight: '700',
            fontFamily: 'Arial',
            fontSize: '26.6667px',
            textColor: 'rgb(255, 0, 0)',
            italic: true,
            strikethrough: false,
            underline: true,
        });
    });
});
