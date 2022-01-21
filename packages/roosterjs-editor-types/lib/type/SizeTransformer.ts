/**
 * A transformer function. It transform the size changes according to current situation.
 * A typical scenario to use this function is when editor is located under a scaled container, so we need to
 * calculate the scaled size change according to current zoom rate.
 * @param size Original delta size from mouse event
 * @returns Calculated delta size. By default it should just return original value
 */
export type SizeTransformer = (size: number) => number;
