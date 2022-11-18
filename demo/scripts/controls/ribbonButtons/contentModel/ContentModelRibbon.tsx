import * as React from 'react';
import { bulletedListButton } from './bulletedListButton';
import { decreaseIndentButton } from './decreaseIndentButton';
import { fontButton } from './fontButton';
import { formatTableButton } from './formatTableButton';
import { increaseIndentButton } from './increaseIndentButton';
import { insertTableButton } from './insertTableButton';
import { listStartNumberButton } from './listStartNumberButton';
import { numberedListButton } from './numberedListButton';
import { Ribbon, RibbonPlugin } from 'roosterjs-react';
import { setBulletedListStyleButton } from './setBulletedListStyleButton';
import { setNumberedListStyleButton } from './setNumberedListStyleButton';
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
    fontButton,
    bulletedListButton,
    numberedListButton,
    decreaseIndentButton,
    increaseIndentButton,
    setBulletedListStyleButton,
    setNumberedListStyleButton,
    listStartNumberButton,
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
