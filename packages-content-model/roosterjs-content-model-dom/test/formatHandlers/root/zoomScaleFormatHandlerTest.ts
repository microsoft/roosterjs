import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { zoomScaleFormatHandler } from '../../../lib/formatHandlers/root/zoomScaleFormatHandler';
import {
    DomToModelContext,
    ModelToDomContext,
    ZoomScaleFormat,
} from 'roosterjs-content-model-types';

describe('zoomScaleFormatHandler.parse', () => {
    let div: HTMLElement;
    let context: DomToModelContext;
    let format: ZoomScaleFormat;

    beforeEach(() => {
        div = ({
            tagName: 'DIV',
            ownerDocument: {
                defaultView: {
                    getComputedStyle: () => ({}),
                },
            },
            getBoundingClientRect: () => ({ width: 100 }),
        } as any) as HTMLElement;
        context = createDomToModelContext();
        format = {};
    });

    it('No zoom scale', () => {
        (<any>div).offsetWidth = undefined;

        zoomScaleFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            zoomScale: 1,
        });
    });

    it('Zoom scale = 1', () => {
        (<any>div).offsetWidth = 100;

        zoomScaleFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            zoomScale: 1,
        });
    });

    it('Zoom scale = 2', () => {
        (<any>div).offsetWidth = 50;

        zoomScaleFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            zoomScale: 2,
        });
    });

    it('Zoom scale = 0.5', () => {
        (<any>div).offsetWidth = 200;

        zoomScaleFormatHandler.parse(format, div, context, {});

        expect(format).toEqual({
            zoomScale: 0.5,
        });
    });
});

describe('zoomScaleFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: ZoomScaleFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('zoom 1', () => {
        format.zoomScale = 1;

        zoomScaleFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('zoom 2', () => {
        format.zoomScale = 2;

        zoomScaleFormatHandler.apply(format, div, context);

        expect(div.outerHTML).toEqual('<div></div>');
    });
});
