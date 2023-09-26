import { SelectionRangeEx, SelectionRangeTypes } from 'roosterjs-editor-types';
import { SetDOMSelection } from '../../publicTypes/ContentModelEditorCore';

/**
 * @internal
 */
export const setDOMSelection: SetDOMSelection = (core, selection) => {
    // TODO: Get rid of SelectionRangeEx in standalone editor
    const rangeEx: SelectionRangeEx =
        selection.type == 'range'
            ? {
                  type: SelectionRangeTypes.Normal,
                  ranges: [selection.range],
                  areAllCollapsed: selection.range.collapsed,
              }
            : selection.type == 'image'
            ? {
                  type: SelectionRangeTypes.ImageSelection,
                  ranges: [],
                  areAllCollapsed: false,
                  image: selection.image,
              }
            : {
                  type: SelectionRangeTypes.TableSelection,
                  ranges: [],
                  areAllCollapsed: false,
                  table: selection.table,
                  coordinates: {
                      firstCell: {
                          x: selection.firstColumn,
                          y: selection.firstRow,
                      },
                      lastCell: {
                          x: selection.lastColumn,
                          y: selection.lastRow,
                      },
                  },
              };

    core.api.select(core, rangeEx);
};
