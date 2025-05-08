import { createContentModelDocument } from '../creators/createContentModelDocument';
import { createText } from '../creators/createText';
import { ensureParagraph } from './ensureParagraph';
import {
    createModelToDomContext,
    createModelToDomContextWithConfig,
} from '../../modelToDom/context/createModelToDomContext';
import {
    createDomToModelContext,
    createDomToModelContextWithConfig,
} from '../../domToModel/context/createDomToModelContext';
import type {
    ContentModelSegmentFormat,
    DomToModelContext,
    EditorEnvironment,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

/**
 * Some format values can be changed when apply to DOM, such as font family.
 * This function will normalize the format and return the same string after DOM modification.
 * @param format The format to be normalized
 * @return Normalized format
 */
export function normalizeSegmentFormat(
    format: ContentModelSegmentFormat,
    environment?: EditorEnvironment
): ContentModelSegmentFormat {
    const span = document.createElement('span');
    const segment = createText('text', format);

    const domToModelContext: DomToModelContext = environment
        ? createDomToModelContextWithConfig(environment.domToModelSettings.calculated)
        : createDomToModelContext();
    const modelToDomContext: ModelToDomContext = environment
        ? createModelToDomContextWithConfig(environment.modelToDomSettings.calculated)
        : createModelToDomContext();
    const model = createContentModelDocument();

    modelToDomContext.modelHandlers.segment(
        span.ownerDocument,
        span,
        segment,
        modelToDomContext,
        []
    );

    domToModelContext.elementProcessors.element(model, span, domToModelContext);

    const paragraph = ensureParagraph(model);

    return paragraph.segments[0]?.format ?? format;
}
