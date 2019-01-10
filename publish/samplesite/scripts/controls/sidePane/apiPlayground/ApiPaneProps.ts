import * as React from 'react';
import { Editor } from 'roosterjs-editor-core';
import { PluginEvent } from 'roosterjs-editor-types';

export default interface ApiPaneProps {
    getEditor: () => Editor;
}

export interface ApiPlaygroundComponent extends React.Component<ApiPaneProps, any> {
    onPluginEvent?: (e: PluginEvent) => void;
}
