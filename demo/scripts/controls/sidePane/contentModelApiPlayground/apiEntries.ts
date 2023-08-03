import * as React from 'react';
import ApiPaneProps, { ApiPlaygroundComponent } from './ApiPaneProps';
import InsertEntityPane from './insertEntity/InsertEntityPane';

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
    entity: {
        name: 'Insert Entity',
        component: InsertEntityPane,
    },
    more: {
        name: 'Coming soon...',
    },
};

export default apiEntries;
