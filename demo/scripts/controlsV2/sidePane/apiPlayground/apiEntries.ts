import * as React from 'react';
import CreateModelFromHtmlPane from './createModelFromHtml/CreateModelFromHtmlPane';
import InsertCustomContainerPane from './insertCustomContainer/InsertCustomContainerPane';
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
    createModelFromHtml: {
        name: 'Create Model from HTML',
        component: CreateModelFromHtmlPane,
    },
    customContainer: {
        name: 'Insert Custom Container',
        component: InsertCustomContainerPane,
    },
    more: {
        name: 'Coming soon...',
    },
};

export default apiEntries;
