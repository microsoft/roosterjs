import { defaultProcessorMap } from './defaultProcessors';
import { ElementProcessorMap } from 'roosterjs-content-model-types';

/**
 * Build a DOM processor map with overrides that can be used as base processor map
 * @param processorOverrides DOM processor overrides to default processors.
 * Note: Inside an override processor it cannot call original processor using context.defaultElementProcessors.<ProcessorName>
 * since here the default processor is also overridden
 */
export function buildBaseProcessorMap(
    ...processorOverrides: (Partial<ElementProcessorMap> | undefined)[]
): ElementProcessorMap {
    return Object.assign({}, defaultProcessorMap, ...processorOverrides);
}
