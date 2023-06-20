import * as stackFormat from '../../../lib/domToModel/utils/stackFormat';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { fontProcessor } from '../../../lib/domToModel/processors/fontProcessor';

describe('fontProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
        spyOn(stackFormat, 'stackFormat').and.callFake((context, options, callback) => callback());
    });

    it('Empty FONT tag', () => {
        const doc = createContentModelDocument();
        const font = document.createElement('font');

        fontProcessor(doc, font, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });

        expect(context.segmentFormat).toEqual({});
    });

    it('FONT tag with face attributes', () => {
        const doc = createContentModelDocument();
        const font = document.createElement('font');
        font.face = 'Arial';

        fontProcessor(doc, font, context);

        expect(context.segmentFormat).toEqual({
            fontFamily: 'Arial',
        });
    });

    it('FONT tag with color attributes', () => {
        const doc = createContentModelDocument();
        const font = document.createElement('font');
        font.color = 'red';

        fontProcessor(doc, font, context);

        expect(context.segmentFormat).toEqual({
            textColor: 'red',
        });
    });

    it('FONT tag with size attributes 1', () => {
        const doc = createContentModelDocument();
        const font = document.createElement('font');
        font.size = '4';

        fontProcessor(doc, font, context);

        expect(context.segmentFormat).toEqual({
            fontSize: '18px',
        });
    });

    it('FONT tag with size attributes 2', () => {
        const doc = createContentModelDocument();
        const font = document.createElement('font');
        font.size = '8';

        fontProcessor(doc, font, context);

        expect(context.segmentFormat).toEqual({
            fontSize: '48px',
        });
    });

    it('FONT tag with all 3 attributes', () => {
        const doc = createContentModelDocument();
        const font = document.createElement('font');
        font.face = 'Arial';
        font.size = '5';
        font.color = 'red';

        fontProcessor(doc, font, context);

        expect(context.segmentFormat).toEqual({
            fontFamily: 'Arial',
            fontSize: '24px',
            textColor: 'red',
        });
    });

    it('FONT tag with all 3 attributes and override by CSS', () => {
        const doc = createContentModelDocument();
        const font = document.createElement('font');
        font.face = 'Arial';
        font.size = '5';
        font.color = 'red';
        font.style.fontFamily = 'Roman';
        font.style.fontSize = '100px';
        font.style.color = 'green';

        fontProcessor(doc, font, context);

        expect(context.segmentFormat).toEqual({
            fontFamily: 'Roman',
            fontSize: '100px',
            textColor: 'green',
        });
    });
});
