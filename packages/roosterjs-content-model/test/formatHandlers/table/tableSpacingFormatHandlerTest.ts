import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { DomToModelContext } from '../../../lib/publicTypes/context/DomToModelContext';
import { ModelToDomContext } from '../../../lib/publicTypes/context/ModelToDomContext';
import { SpacingFormat } from '../../../lib/publicTypes/format/formatParts/SpacingFormat';
import { tableSpacingFormatHandler } from '../../../lib/formatHandlers/table/tableSpacingFormatHandler';

describe('tableSpacingFormatHandler.parse', () => {
    let div: HTMLElement;
    let format: SpacingFormat;
    let context: DomToModelContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createDomToModelContext();
    });

    it('No value', () => {
        tableSpacingFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });

    it('Collapsed border', () => {
        div.style.borderCollapse = 'collapse';
        tableSpacingFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({ borderCollapse: true });
    });

    it('Non-collapsed border', () => {
        div.style.borderCollapse = 'separate';
        tableSpacingFormatHandler.parse(format, div, context, {});
        expect(format).toEqual({});
    });
});

describe('tableSpacingFormatHandler.apply', () => {
    let div: HTMLElement;
    let format: SpacingFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        div = document.createElement('div');
        format = {};
        context = createModelToDomContext();
    });

    it('No value', () => {
        tableSpacingFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toEqual('<div></div>');
    });

    it('Collapsed border', () => {
        format.borderCollapse = true;
        tableSpacingFormatHandler.apply(format, div, context);
        expect(div.outerHTML).toEqual(
            '<div style="border-collapse: collapse; border-spacing: 0px; box-sizing: border-box;"></div>'
        );
    });
});
