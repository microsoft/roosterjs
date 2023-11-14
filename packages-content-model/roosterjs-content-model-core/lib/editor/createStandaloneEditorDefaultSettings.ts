import { createDomToModelConfig, createModelToDomConfig } from 'roosterjs-content-model-dom';
import { listItemMetadataApplier, listLevelMetadataApplier } from '../metadata/updateListMetadata';
import { tablePreProcessor } from '../override/tablePreProcessor';
import type {
    DomToModelOption,
    ModelToDomOption,
    StandaloneEditorDefaultSettings,
    StandaloneEditorOptions,
} from 'roosterjs-content-model-types';

/**
 * Create default DOM and Content Model conversion settings for a standalone editor
 * @param options The editor options
 */
export function createStandaloneEditorDefaultSettings(
    options: StandaloneEditorOptions
): StandaloneEditorDefaultSettings {
    const defaultDomToModelOptions: (DomToModelOption | undefined)[] = [
        {
            processorOverride: {
                table: tablePreProcessor,
            },
        },
        options.defaultDomToModelOptions,
    ];
    const defaultModelToDomOptions: (ModelToDomOption | undefined)[] = [
        {
            metadataAppliers: {
                listItem: listItemMetadataApplier,
                listLevel: listLevelMetadataApplier,
            },
        },
        options.defaultModelToDomOptions,
    ];

    return {
        defaultDomToModelOptions,
        defaultModelToDomOptions,
        defaultDomToModelConfig: createDomToModelConfig(defaultDomToModelOptions),
        defaultModelToDomConfig: createModelToDomConfig(defaultModelToDomOptions),
    };
}
