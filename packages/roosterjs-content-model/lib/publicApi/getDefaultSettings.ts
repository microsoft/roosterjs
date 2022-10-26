import { ContentModelDefaultSettings } from '../publicTypes/context/EditorContext';
import { defaultContentModelHandlers } from '../modelToDom/context/defaultContentModelHandlers';
import { defaultProcessorMap } from '../domToModel/context/defaultProcessors';
import {
    getDefaultFormatAppliers,
    getDefaultFormatParsers,
} from '../formatHandlers/defaultFormatHandlers';

const defaultSettings: Readonly<ContentModelDefaultSettings> = {
    domToContentModelProcessors: defaultProcessorMap,
    contentModelToDomHandlers: defaultContentModelHandlers,
    formatParsers: getDefaultFormatParsers(),
    formatAppliers: getDefaultFormatAppliers(),
};

/**
 * Get default settings of content model
 */
export default function getDefaultSettings(): Readonly<ContentModelDefaultSettings> {
    return defaultSettings;
}
