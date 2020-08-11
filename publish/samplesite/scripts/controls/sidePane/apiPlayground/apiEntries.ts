import * as React from 'react';
import ApiPaneProps, { ApiPlaygroundComponent } from './ApiPaneProps';
import BlockElementsPane from './blockElements/BlockElementsPane';
import GetSelectedRegionsPane from './region/GetSelectedRegionsPane';
import InsertContentPane from './insertContent/InsertContentPane';
import InsertEntityPane from './insertEntity/InsertEntityPane';
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
    region: {
        name: 'Get Selected Regions',
        component: GetSelectedRegionsPane,
    },
    entity: {
        name: 'Insert Entity',
        component: InsertEntityPane,
    },
    more: {
        name: 'Coming soon...',
    },
};

export default apiEntries;
