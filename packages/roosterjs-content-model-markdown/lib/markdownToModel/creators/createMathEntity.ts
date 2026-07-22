import { createEntity } from 'roosterjs-content-model-dom';
import type { ContentModelEntity } from 'roosterjs-content-model-types';

const MathEntityType = 'Math';
const DataLatex = 'data-latex';

/**
 * @internal
 * Create a dehydrated, read-only "Math" entity from a LaTeX source string.
 * The LaTeX is stored in the `data-latex` attribute of the entity wrapper. The math is not
 * rendered here - a plugin (e.g. MathPlugin) is expected to render it from `data-latex` later.
 * @param latex The raw LaTeX source string
 * @param isBlock True to create a block-level math entity (div wrapper), false for inline (span wrapper)
 * @param doc The Document used to create the entity wrapper element
 * @param entities Optional array that the created entity is appended to, so callers can track new entities
 */
export function createMathEntity(
    latex: string,
    isBlock: boolean,
    doc: Document,
    entities?: ContentModelEntity[]
): ContentModelEntity {
    const wrapper = doc.createElement(isBlock ? 'div' : 'span');

    wrapper.setAttribute(DataLatex, latex);

    const entity = createEntity(
        wrapper,
        true /*isReadonly*/,
        undefined /*segmentFormat*/,
        MathEntityType
    );

    entities?.push(entity);

    return entity;
}
