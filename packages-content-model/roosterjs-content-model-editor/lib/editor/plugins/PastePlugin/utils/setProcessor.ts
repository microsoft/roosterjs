import type { DomToModelOption, ElementProcessorMap } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function setProcessor<TKey extends keyof ElementProcessorMap>(
    domToModelOption: DomToModelOption,
    entry: TKey,
    processorOverride: Partial<ElementProcessorMap>[TKey]
) {
    if (!domToModelOption.processorOverride) {
        domToModelOption.processorOverride = {};
    }

    domToModelOption.processorOverride[entry] = processorOverride;
}
