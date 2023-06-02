import { DomToModelOption } from '../../../../publicTypes/IContentModelEditor';
import { ElementProcessorMap } from '../../../../publicTypes/context/DomToModelSettings';

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
