import { createDomToModelConfig, createModelToDomConfig } from 'roosterjs-content-model-dom';
import {
    listItemMetadataApplier,
    listLevelMetadataApplier,
} from '../../override/listMetadataApplier';
import type {
    DomToModelOption,
    ModelToDomOption,
    EditorOptions,
    ModelToDomSetting,
    DomToModelSetting,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Create default DOM to Content Model conversion settings for an editor
 * @param options The editor options
 */
export function createDomToModelSettings(options: EditorOptions): DomToModelSetting {
    const builtIn: DomToModelOption = {};
    const customized: DomToModelOption = options.defaultDomToModelOptions ?? {};

    return {
        builtIn,
        customized,
        calculated: createDomToModelConfig([builtIn, customized]),
        paste: options.pasteOptionDomToModel ?? {},
    };
}

/**
 * @internal
 * Create default Content Model to DOM conversion settings for an editor
 * @param options The editor options
 */
export function createModelToDomSettings(options: EditorOptions): ModelToDomSetting {
    const builtIn: ModelToDomOption = {
        metadataAppliers: {
            listItem: listItemMetadataApplier,
            listLevel: listLevelMetadataApplier,
        },
    };
    const customized: ModelToDomOption = options.defaultModelToDomOptions ?? {};

    return {
        builtIn,
        customized,
        calculated: createModelToDomConfig([builtIn, customized]),
    };
}
