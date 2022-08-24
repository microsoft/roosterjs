import * as React from 'react';
import { formatTableButton } from './formatTableButton';
import { insertTableButton } from './insertTableButton';
import { Ribbon, RibbonPlugin } from 'roosterjs-react';
import { setTableCellShadeButton } from './setTableCellShadeButton';
import { setTableHeaderButton } from './setTableHeaderButton';
import {
    tableAlignCellButton,
    tableAlignTableButton,
    tableDeleteButton,
    tableInsertButton,
    tableMergeButton,
    tableSplitButton,
} from './tableEditButtons';

const buttons = [
    insertTableButton,
    formatTableButton,
    setTableCellShadeButton,
    setTableHeaderButton,
    tableInsertButton,
    tableDeleteButton,
    tableMergeButton,
    tableSplitButton,
    tableAlignCellButton,
    tableAlignTableButton,
];

export default function ContentModelRibbon(props: { ribbonPlugin: RibbonPlugin; isRtl: boolean }) {
    const { ribbonPlugin, isRtl } = props;

    return <Ribbon buttons={buttons} plugin={ribbonPlugin} dir={isRtl ? 'rtl' : 'ltr'} />;
}
