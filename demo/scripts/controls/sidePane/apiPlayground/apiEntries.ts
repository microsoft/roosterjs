import * as React from 'react';
import ApiPaneProps, { ApiPlaygroundComponent } from './ApiPaneProps';
import BlockElementsPane from './blockElements/BlockElementsPane';
import GetDarkColorPane from './darkColor/GetDarkColorPane';
import GetSelectedRegionsPane from './region/GetSelectedRegionsPane';
import GetSelectionPane from './getSelection/getSelectionPane';
import InsertContentPane from './insertContent/InsertContentPane';
import InsertEntityPane from './insertEntity/InsertEntityPane';
import MatchLinkPane from './matchLink/MatchLinkPane';
import SanitizerPane from './sanitizer/SanitizerPane';
import VListPane from './vlist/VListPane';
import VTablePane from './vtable/VTablePane';

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
    vlist: {
        name: 'VList',
        component: VListPane,
    },
    vtable: {
        name: 'VTable',
        component: VTablePane,
    },
    getDarkColor: {
        name: 'getDarkColor',
        component: GetDarkColorPane,
    },
    getSelection: {
        name: 'getSelection',
        component: GetSelectionPane,
    },
    more: {
        name: 'Coming soon...',
    },
};

export default apiEntries;
