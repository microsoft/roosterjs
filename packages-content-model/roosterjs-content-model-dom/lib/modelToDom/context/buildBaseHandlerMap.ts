import { ContentModelHandlerMap } from 'roosterjs-content-model-types';
import { defaultContentModelHandlers } from './defaultContentModelHandlers';

/**
 * Build a model handler map with overrides that can be used as base handle map
 * @param handlerOverrides Model handler overrides to default handlers.
 * Note: Inside an override handler it cannot call original handler using context.defaultModelHandlers.<HandlerName>
 * since here the default handler is also overridden
 */
export function buildBaseHandlerMap(
    ...handlerOverrides: (Partial<ContentModelHandlerMap> | undefined)[]
): ContentModelHandlerMap {
    return Object.assign({}, defaultContentModelHandlers, ...handlerOverrides);
}
