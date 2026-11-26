/**
 * Minimum paragraph line counts across fragment boundaries.
 */
export type WidowOrphanFormat = {
    /**
     * Minimum lines at the bottom of a fragment.
     */
    orphans?: string;
    /**
     * Minimum lines at the top of a fragment.
     */
    widows?: string;
};
