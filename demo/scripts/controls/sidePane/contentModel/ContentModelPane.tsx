import * as React from 'react';
import ContentModelRibbonButton from '../../ribbonButtons/contentModel/ContentModelRibbonButton';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { ContentModelDocumentView } from '../../contentModel/components/model/ContentModelDocumentView';
import { ContentModelRibbon } from '../../ribbonButtons/contentModel/ContentModelRibbon';
import { ContentModelRibbonPlugin } from '../../ribbonButtons/contentModel/ContentModelRibbonPlugin';
import { exportButton } from './buttons/exportButton';
import { refreshButton } from './buttons/refreshButton';
import { SidePaneElementProps } from '../SidePaneElement';

const styles = require('./ContentModelPane.scss');

export interface ContentModelPaneState {
    model: ContentModelDocument;
}

export interface ContentModelPaneProps extends ContentModelPaneState, SidePaneElementProps {
    ribbonPlugin: ContentModelRibbonPlugin;
}

export default class ContentModelPane extends React.Component<
    ContentModelPaneProps,
    ContentModelPaneState
> {
    private contentModelButtons: ContentModelRibbonButton<any>[];

    constructor(props: ContentModelPaneProps) {
        super(props);

        this.contentModelButtons = [refreshButton, exportButton];

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
                <ContentModelRibbon
                    buttons={this.contentModelButtons}
                    plugin={this.props.ribbonPlugin}
                />
                <div className={styles.contentModel}>
                    {this.state.model ? <ContentModelDocumentView doc={this.state.model} /> : null}
                </div>
            </>
        );
    }
}
