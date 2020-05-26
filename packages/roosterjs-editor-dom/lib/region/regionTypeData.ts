import { RegionType } from 'roosterjs-editor-types';

/**
 * @internal
 * Constants for each region type
 */
export interface RegionTypeData {
    /**
     * Tags that child elements will be skipped
     */
    skipTags: string[];

    /**
     * Selector of outer node of a region
     */
    outerSelector: string;

    /**
     * Selector of inner node of a region
     */
    innerSelector: string;
}

const regionTypeData: Record<RegionType, RegionTypeData> = {
    [RegionType.Table]: {
        skipTags: ['TABLE'],
        outerSelector: 'table',
        innerSelector: 'td,th',
    },
};

/**
 * @internal
 */
export default regionTypeData;
