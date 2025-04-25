import * as React from 'react';
import HintTextPane from './hintText/hintTextPane';
import InsertEntityPane from './insertEntity/InsertEntityPane';
import PastePane from './paste/PastePane';
import { ApiPaneProps, ApiPlaygroundComponent } from './ApiPaneProps';

export interface ApiPlaygroundReactComponent
    extends React.Component<ApiPaneProps, any>,
        ApiPlaygroundComponent {}

interface ApiEntry {
    name: string;
    component?: { new (props: ApiPaneProps): ApiPlaygroundReactComponent };
}

const apiEntries: { [key: string]: ApiEntry } = {
    empty: {
        name: 'Please select',
    },
    entity: {
        name: 'Insert Entity',
        component: InsertEntityPane,
    },
    paste: {
        name: 'Paste',
        component: PastePane,
    },
    hintText: {
        name: 'Hint Text',
        component: HintTextPane,
    },
    more: {
        name: 'Coming soon...',
    },
};

export default apiEntries;
