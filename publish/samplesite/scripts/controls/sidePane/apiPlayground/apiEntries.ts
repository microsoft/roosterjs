import * as React from 'react';
import ApiPaneProps, { ApiPlaygroundComponent } from './ApiPaneProps';
import BlockElementsPane from './blockElements/BlockElementsPane';
import InsertContentPane from './insertContent/InsertContentPane';
import MatchLinkPane from './matchLink/MatchLinkPane';
import SanitizerPane from './sanitizer/SanitizerPane';

export interface ApiPlaygroundReactComponent
    extends React.Component<ApiPaneProps, any>,
        ApiPlaygroundComponent {}

interface ApiEntry {
    name: string;
    component?: { new (prpos: ApiPaneProps): ApiPlaygroundReactComponent };
}

const apiEntries: { [key: string]: ApiEntry } = {
    empty: {
        name: 'Please select',
    },
    block: {
        name: 'Block Elements',
        component: BlockElementsPane,
    },
    sanitizer: {
        name: 'HTML Sanitizer',
        component: SanitizerPane,
    },
    matchlink: {
        name: 'Match Link',
        component: MatchLinkPane,
    },
    insertContent: {
        name: 'Insert Content',
        component: InsertContentPane,
    },
    more: {
        name: 'Coming soon...',
    },
};

export default apiEntries;
