import * as createDomToModelContext from 'roosterjs-content-model-dom/lib/domToModel/context/createDomToModelContext';
import * as createModelToDomContext from 'roosterjs-content-model-dom/lib/modelToDom/context/createModelToDomContext';
import { tablePreProcessor } from '../../lib/override/tablePreProcessor';
import {
    listItemMetadataApplier,
    listLevelMetadataApplier,
} from '../../lib/metadata/updateListMetadata';
import {
    createDomToModelSettings,
    createModelToDomSettings,
} from '../../lib/editor/createEditorDefaultSettings';

describe('createDomToModelSettings', () => {
    const mockedCalculatedConfig = 'CONFIG' as any;

    beforeEach(() => {
        spyOn(createDomToModelContext, 'createDomToModelConfig').and.returnValue(
            mockedCalculatedConfig
        );
    });

    it('No options', () => {
        const settings = createDomToModelSettings({});

        expect(settings).toEqual({
            builtIn: {
                processorOverride: {
                    table: tablePreProcessor,
                },
            },
            customized: {},
            calculated: mockedCalculatedConfig,
        });
        expect(createDomToModelContext.createDomToModelConfig).toHaveBeenCalledWith([
            {
                processorOverride: {
                    table: tablePreProcessor,
                },
            },
            {},
        ]);
    });

    it('Has options', () => {
        const defaultDomToModelOptions = 'MockedOptions' as any;
        const settings = createDomToModelSettings({
            defaultDomToModelOptions: defaultDomToModelOptions,
        });

        expect(settings).toEqual({
            builtIn: {
                processorOverride: {
                    table: tablePreProcessor,
                },
            },
            customized: defaultDomToModelOptions,
            calculated: mockedCalculatedConfig,
        });
        expect(createDomToModelContext.createDomToModelConfig).toHaveBeenCalledWith([
            {
                processorOverride: {
                    table: tablePreProcessor,
                },
            },
            defaultDomToModelOptions,
        ]);
    });
});

describe('createModelToDomSettings', () => {
    const mockedCalculatedConfig = 'CONFIG' as any;

    beforeEach(() => {
        spyOn(createModelToDomContext, 'createModelToDomConfig').and.returnValue(
            mockedCalculatedConfig
        );
    });

    it('No options', () => {
        const settings = createModelToDomSettings({});

        expect(settings).toEqual({
            builtIn: {
                metadataAppliers: {
                    listItem: listItemMetadataApplier,
                    listLevel: listLevelMetadataApplier,
                },
            },
            customized: {},
            calculated: mockedCalculatedConfig,
        });
        expect(createModelToDomContext.createModelToDomConfig).toHaveBeenCalledWith([
            {
                metadataAppliers: {
                    listItem: listItemMetadataApplier,
                    listLevel: listLevelMetadataApplier,
                },
            },
            {},
        ]);
    });

    it('Has options', () => {
        const defaultModelToDomOptions = 'MockedOptions' as any;
        const settings = createModelToDomSettings({
            defaultModelToDomOptions: defaultModelToDomOptions,
        });

        expect(settings).toEqual({
            builtIn: {
                metadataAppliers: {
                    listItem: listItemMetadataApplier,
                    listLevel: listLevelMetadataApplier,
                },
            },
            customized: defaultModelToDomOptions,
            calculated: mockedCalculatedConfig,
        });
        expect(createModelToDomContext.createModelToDomConfig).toHaveBeenCalledWith([
            {
                metadataAppliers: {
                    listItem: listItemMetadataApplier,
                    listLevel: listLevelMetadataApplier,
                },
            },
            defaultModelToDomOptions,
        ]);
    });
});
