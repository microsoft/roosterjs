import { ImageSelection, TableSelection } from 'roosterjs-content-model-types';

export interface ContentModelSelectionPluginState {
    tableSelection?: TableSelection;
    imageSelection?: ImageSelection;
}
