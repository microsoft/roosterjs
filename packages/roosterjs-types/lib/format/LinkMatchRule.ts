import LinkData from './LinkData';

// LinkMatchRule has an include and optional exclude
// exclude is always checked first and overwrite include
interface LinkMatchRule {
    // Check if the given string is included by this rule, returns the matched link data
    include: (data: string) => LinkData;

    // Check if the given string is excluded by this rule
    exclude?: (data: string) => boolean;
}

export default LinkMatchRule;
