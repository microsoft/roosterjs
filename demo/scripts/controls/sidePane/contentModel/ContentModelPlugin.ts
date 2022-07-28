import ContentModelPane, { ContentModelPaneProps } from './ContentModelPane';
import HackedEditor from '../../hackedEditor/HackedEditor';
import SidePanePluginImpl from '../SidePanePluginImpl';
import { addRangeToSelection } from 'roosterjs-editor-dom';
import { createRibbonPlugin, RibbonPlugin } from 'roosterjs-react';
import { PREDEFINED_STYLES } from '../shared/PredefinedTableStyles';
import { SidePaneElementProps } from '../SidePaneElement';
import {
    applyTableFormat,
    ContentModelBlockType,
    ContentModelDocument,
} from 'roosterjs-content-model';
import {
    ChangeSource,
    IEditor,
    PluginEvent,
    PluginEventType,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

export default class ContentModelPlugin extends SidePanePluginImpl<
    ContentModelPane,
    ContentModelPaneProps
> {
    private contentModelRibbon: RibbonPlugin;

    constructor() {
        super(ContentModelPane, 'contentModel', 'Content Model (Under development)');
        this.contentModelRibbon = createRibbonPlugin();
    }

    initialize(editor: IEditor): void {
        super.initialize(editor);

        this.contentModelRibbon.initialize(editor);
        editor.getDocument().addEventListener('selectionchange', this.onModelChange);
    }

    dispose(): void {
        this.contentModelRibbon.dispose();
        this.editor.getDocument().removeEventListener('selectionchange', this.onModelChange);

        super.dispose();
    }

    onPluginEvent(e: PluginEvent) {
        if (
            e.eventType == PluginEventType.ContentChanged &&
            (e.source == ChangeSource.SwitchToDarkMode ||
                e.source == ChangeSource.SwitchToLightMode)
        ) {
            this.onModelChange();
        }

        this.contentModelRibbon.onPluginEvent(e);
    }

    private onGetModel = () => {
        return isHackedEditor(this.editor) ? this.editor.getContentModel() : null;
    };

    protected getComponentProps(baseProps: SidePaneElementProps): ContentModelPaneProps {
        return {
            ...baseProps,
            model: null,
            ribbonPlugin: this.contentModelRibbon,
            onUpdateModel: this.onGetModel,
            onCreateDOM: this.onCreateDOM,
            onFormatTable: this.onFormatTable,
        };
    }

    private onModelChange = () => {
        this.getComponent(component => {
            const model = this.onGetModel();
            component.setContentModel(model);
        });
    };

    private onCreateDOM = (model: ContentModelDocument) => {
        if (isHackedEditor(this.editor)) {
            const [fragment, selection] = this.editor.getDOMFromContentModel(model);
            const win = window.open('about:blank');

            win.document.body.appendChild(fragment);

            if (selection) {
                switch (selection.type) {
                    case SelectionRangeTypes.Normal:
                        addRangeToSelection(selection.ranges[0]);
                        break;

                    case SelectionRangeTypes.TableSelection:
                        // TODO
                        break;
                }
            }
        }
    };

    private onFormatTable = (key: string) => {
        const table = this.editor.queryElements('table')[0];
        const format = PREDEFINED_STYLES[key]?.('#ABABAB', '#ABABAB20');
        const parent = table.parentNode;

        this.editor.addUndoSnapshot(() => {
            if (table && isHackedEditor(this.editor) && format && parent) {
                const model = this.editor.getContentModel(table);
                const tableModel = model.blocks[0];

                if (tableModel?.blockType == ContentModelBlockType.Table) {
                    applyTableFormat(tableModel, format);

                    const [newFragment] = this.editor.getDOMFromContentModel(model);

                    parent.replaceChild(newFragment, table);
                }
            }
        }, ChangeSource.Format);
    };
}

function isHackedEditor(editor: IEditor | null): editor is HackedEditor {
    return editor && !!(<HackedEditor>editor).getContentModel;
}
