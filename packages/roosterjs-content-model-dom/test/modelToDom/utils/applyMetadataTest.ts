import * as updateMetadata from '../../../lib/domUtils/metadata/updateMetadata';
import { applyMetadata } from '../../../lib/modelToDom/utils/applyMetadata';
import { MetadataApplier } from 'roosterjs-content-model-types';

describe('applyMetadata', () => {
    const mockedModel = 'Model' as any;
    const mockedFormat = 'Format' as any;
    const mockedContext = 'Context' as any;
    const mockedMetadata = 'Metadata' as any;
    const mockedDefinition = 'Definition' as any;
    let updateMetadataSpy: jasmine.Spy;

    beforeEach(() => {
        updateMetadataSpy = spyOn(updateMetadata, 'updateMetadata');
    });

    it('No applier', () => {
        const model = mockedModel;
        const format = mockedFormat;
        const context = mockedContext;

        applyMetadata(model, undefined, format, context);

        expect(model).toEqual(mockedModel);
        expect(format).toEqual(mockedFormat);
        expect(updateMetadataSpy).not.toHaveBeenCalled();
    });

    it('No definition', () => {
        const model = mockedModel;
        const format = mockedFormat;
        const context = mockedContext;
        const applierFunction = jasmine.createSpy('applier');
        const applier: MetadataApplier<any, any> = {
            applierFunction,
        };

        updateMetadataSpy.and.callFake((model, callback, definition) => {
            expect(model).toBe(mockedModel);
            expect(definition).toBeUndefined();
            const result = callback(mockedMetadata);

            expect(result).toBe(mockedMetadata);
        });

        applyMetadata(model, applier, format, context);

        expect(model).toEqual(mockedModel);
        expect(format).toEqual(mockedFormat);
        expect(applierFunction).toHaveBeenCalledWith(mockedMetadata, mockedFormat, context);
    });

    it('Has definition', () => {
        const model = mockedModel;
        const format = mockedFormat;
        const context = mockedContext;
        const applierFunction = jasmine.createSpy('applier');
        const applier: MetadataApplier<any, any> = {
            applierFunction,
            metadataDefinition: mockedDefinition,
        };

        updateMetadataSpy.and.callFake((model, callback, definition) => {
            expect(model).toBe(mockedModel);
            expect(definition).toBe(mockedDefinition);
            const result = callback(mockedMetadata);

            expect(result).toBe(mockedMetadata);
        });

        applyMetadata(model, applier, format, context);

        expect(model).toEqual(mockedModel);
        expect(format).toEqual(mockedFormat);
        expect(applierFunction).toHaveBeenCalledWith(mockedMetadata, mockedFormat, context);
    });
});
