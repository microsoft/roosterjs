import * as updateMetadata from 'roosterjs-content-model-dom/lib/modelApi/metadata/updateMetadata';
import { applyMetadata } from '../../../lib/modelToDom/utils/applyMetadata';
import { MetadataApplier } from 'roosterjs-content-model-types';

describe('applyMetadata', () => {
    const mockedModel = 'Model' as any;
    const mockedFormat = 'Format' as any;
    const mockedContext = 'Context' as any;
    const mockedMetadata = 'Metadata' as any;
    const mockedDefinition = 'Definition' as any;
    let retrieveMetadataCopySpy: jasmine.Spy;

    beforeEach(() => {
        retrieveMetadataCopySpy = spyOn(updateMetadata, 'retrieveMetadataCopy');
    });

    it('No applier', () => {
        const model = mockedModel;
        const format = mockedFormat;
        const context = mockedContext;

        applyMetadata(model, undefined, format, context);

        expect(model).toEqual(mockedModel);
        expect(format).toEqual(mockedFormat);
        expect(retrieveMetadataCopySpy).not.toHaveBeenCalled();
    });

    it('No definition', () => {
        const model = mockedModel;
        const format = mockedFormat;
        const context = mockedContext;
        const applierFunction = jasmine.createSpy('applier');
        const applier: MetadataApplier<any, any> = {
            applierFunction,
        };

        retrieveMetadataCopySpy.and.returnValue(mockedMetadata);

        applyMetadata(model, applier, format, context);

        expect(model).toEqual(mockedModel);
        expect(format).toEqual(mockedFormat);
        expect(applierFunction).toHaveBeenCalledWith(mockedMetadata, mockedFormat, context);
        expect(retrieveMetadataCopySpy).toHaveBeenCalledWith(mockedModel, undefined);
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

        retrieveMetadataCopySpy.and.returnValue(mockedMetadata);

        applyMetadata(model, applier, format, context);

        expect(model).toEqual(mockedModel);
        expect(format).toEqual(mockedFormat);
        expect(applierFunction).toHaveBeenCalledWith(mockedMetadata, mockedFormat, context);
        expect(retrieveMetadataCopySpy).toHaveBeenCalledWith(mockedModel, mockedDefinition);
    });
});
