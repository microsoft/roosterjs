const WORD_ORDERED_LIST_SELECTOR = 'div.ListContainerWrapper > ul[class^="BulletListStyle"]';

const WORD_UNORDERED_LIST_SELECTOR = 'div.ListContainerWrapper > ol[class^="NumberListStyle"]';

export const WORD_ONLINE_IDENTIFYING_SELECTOR = `${WORD_ORDERED_LIST_SELECTOR},${WORD_UNORDERED_LIST_SELECTOR}`;

export const LIST_CONTAINER_ELEMENT_CLASS_NAME = "ListContainerWrapper";

export const UNORDERED_LIST_TAG_NAME = "UL";

export const ORDERED_LIST_TAG_NAME = "OL";
