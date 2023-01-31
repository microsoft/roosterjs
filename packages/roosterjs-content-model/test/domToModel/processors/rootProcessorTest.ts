import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { rootProcessor } from '../../../lib/domToModel/processors/rootProcessor';

describe('rootProcessor', () => {
    let context: DomToModelContext;

    beforeEach(() => {
        context = createDomToModelContext();
    });

    it('Simple empty element', () => {
        const div = document.createElement('div');
        const doc = createContentModelDocument();
        const childProcessor = jasmine.createSpy('childProcessor');

        context.elementProcessors.child = childProcessor;

        rootProcessor(doc, div, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(context.blockFormat).toEqual({});
        expect(context.zoomScaleFormat).toEqual({
            zoomScale: 1,
        });
        expect(childProcessor).toHaveBeenCalledTimes(1);
        expect(childProcessor).toHaveBeenCalledWith(doc, div, context);
    });

    it('Div with zoom scale', () => {
        const div = ({
            tagName: 'DIV',
            ownerDocument: {
                defaultView: {
                    getComputedStyle: () => ({}),
                },
            },
            getBoundingClientRect: () => ({ width: 100 }),
            offsetWidth: 200,
        } as any) as HTMLElement;
        const doc = createContentModelDocument();

        rootProcessor(doc, div, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(context.blockFormat).toEqual({});
        expect(context.zoomScaleFormat).toEqual({
            zoomScale: 0.5,
        });
    });

    it('Div in RTL', () => {
        const div = ({
            tagName: 'DIV',
            ownerDocument: {
                defaultView: {
                    getComputedStyle: () => ({
                        direction: 'rtl',
                    }),
                },
            },
            getBoundingClientRect: () => ({ width: 0 }),
            offsetWidth: 0,
        } as any) as HTMLElement;
        const doc = createContentModelDocument();

        rootProcessor(doc, div, context);

        expect(doc).toEqual({
            blockGroupType: 'Document',
            blocks: [],
        });
        expect(context.blockFormat).toEqual({
            direction: 'rtl',
        });
        expect(context.zoomScaleFormat).toEqual({
            zoomScale: 1,
        });
    });
});
