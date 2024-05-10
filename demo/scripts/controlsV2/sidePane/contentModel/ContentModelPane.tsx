import * as React from 'react';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { ContentModelDocumentView } from './components/model/ContentModelDocumentView';
import { exportButton } from './buttons/exportButton';
import { importModelButton } from './buttons/importModelButton';
import { Ribbon, RibbonButton, RibbonPlugin } from '../../roosterjsReact/ribbon';
import { SidePaneElementProps } from '../SidePaneElement';

const styles = require('./ContentModelPane.scss');

export interface ContentModelPaneState {
    model: ContentModelDocument;
}

export interface ContentModelPaneProps extends ContentModelPaneState, SidePaneElementProps {
    ribbonPlugin: RibbonPlugin;
    refreshButton: RibbonButton<string>;
}

export class ContentModelPane extends React.Component<
    ContentModelPaneProps,
    ContentModelPaneState
> {
    private contentModelButtons: RibbonButton<any>[];

    constructor(props: ContentModelPaneProps) {
        super(props);

        this.contentModelButtons = [this.props.refreshButton, exportButton, importModelButton];

        this.state = {
            model: null,
        };
    }

    setContentModel(model: ContentModelDocument) {
        this.setState({
            model: model,
        });
    }

    render() {
        return (
            <>
                <Ribbon buttons={this.contentModelButtons} plugin={this.props.ribbonPlugin} />
                <div className={styles.contentModel}>
                    {this.state.model ? <ContentModelDocumentView doc={this.state.model} /> : null}
                </div>
            </>
        );
    }
}
