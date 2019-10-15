import {
    REACT_COMPONENT_DATA_KEY,
    REACT_COMPONENT_INSTANCE_ID,
    REACT_COMPONENT_SHARABLE_STATE,
} from './constants';

const simpleReactAttributes = new RegExp(
    `(${REACT_COMPONENT_DATA_KEY}|${REACT_COMPONENT_INSTANCE_ID}|${REACT_COMPONENT_SHARABLE_STATE})=("[^"]*"|'[^']*'|[^\t\n\r\f ><"'\`]*)`,
    'gim'
);

export default function removeReactTagsOnExtractContent(html: string): string {
    if (html) {
        const withoutSimpleTags = html.replace(simpleReactAttributes, '');
        return withoutSimpleTags;
    } else {
        return html;
    }
}
