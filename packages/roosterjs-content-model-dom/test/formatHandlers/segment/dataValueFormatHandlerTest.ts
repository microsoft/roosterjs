import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { dataValueFormatHandler } from '../../../lib/formatHandlers/segment/dataValueFormatHandler';
import {
    DataValueFormat,
    DomToModelContext,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

describe('dataValueFormatHandler.parse', () => {
    let element: HTMLElement;
    let context: DomToModelContext;
    let format: DataValueFormat;

    beforeEach(() => {
        element = document.createElement('data');
        context = createDomToModelContext();
        format = {};
    });

    it('No value attribute', () => {
        dataValueFormatHandler.parse(format, element, context, {});

        expect(format.dataValue).toBeUndefined();
    });

    it('With value attribute', () => {
        element.setAttribute('value', '123');
        dataValueFormatHandler.parse(format, element, context, {});

        expect(format.dataValue).toBe('123');
    });

    it('With empty value attribute', () => {
        element.setAttribute('value', '');
        dataValueFormatHandler.parse(format, element, context, {});

        expect(format.dataValue).toBe('');
    });
});

describe('dataValueFormatHandler.apply', () => {
    let element: HTMLElement;
    let format: DataValueFormat;
    let context: ModelToDomContext;

    beforeEach(() => {
        element = document.createElement('data');
        format = {};
        context = createModelToDomContext();
    });

    it('No format', () => {
        dataValueFormatHandler.apply(format, element, context);

        expect(element.outerHTML).toEqual('<data></data>');
    });

    it('With value', () => {
        format.dataValue = '123';
        dataValueFormatHandler.apply(format, element, context);

        expect(element.outerHTML).toEqual('<data value="123"></data>');
    });

    it('With empty value', () => {
        format.dataValue = '';
        dataValueFormatHandler.apply(format, element, context);

        expect(element.outerHTML).toEqual('<data value=""></data>');
    });
});
