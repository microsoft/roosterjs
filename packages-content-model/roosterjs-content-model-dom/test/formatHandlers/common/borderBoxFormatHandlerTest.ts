import { borderBoxFormatHandler } from '../../../lib/formatHandlers/common/borderBoxFormatHandler';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import {
    BorderBoxFormat,
    DomToModelContext,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

describe('borderBoxFormat.parse', () => {
    let format: BorderBoxFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        format = {};
        context = createDomToModelContext();
    });

    it('UseBorderBox', () => {
        const fake = ({
            getBoundingClientRect: () => ({
                width: 0,
                height: 0,
            }),
            style: {
                boxSizing: 'border-box',
            },
        } as any) as HTMLElement;
        borderBoxFormatHandler.parse(format, fake, context, {});
        expect(format).toEqual({ useBorderBox: true });
    });
});

describe('borderBoxFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: BorderBoxFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('UseBorderBox', () => {
        format.useBorderBox = true;
        borderBoxFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toBe('<div style="box-sizing: border-box;"></div>');
    });
});
