import React from 'react';
import { Column } from '@togglecorp/toggle-ui/build/components/Table';

type Options = {
    sortable?: boolean;
    defaultSortDirection?: 'asc' | 'desc';
    filterType?: string;
    orderable?: boolean;
    columnClassName?: string;
    headerCellRendererClassName?: string;
    headerContainerClassName?: string;
    cellRendererClassName?: string;
    cellContainerClassName?: string;
    columnWidth?: number;
    columnStretch?: boolean;
    columnStyle?: React.CSSProperties;
};

// eslint-disable-next-line import/prefer-default-export
export function createElementColumn<D, K, CompProps>(
    id: string,
    title: string,
    cellRenderer: React.ComponentType<CompProps>,
    cellRendererParams: (key: K, datum: D, index: number) => Omit<CompProps, 'className' | 'name'>,
    options: Options = {},
): Column<D, K, CompProps, object> {
    return {
        id,
        title,
        headerCellRenderer: () => <div>{title}</div>,
        headerCellRendererParams: {} as Omit<CompProps, 'className' | 'name'>,
        headerCellRendererClassName: options.headerCellRendererClassName,
        headerContainerClassName: options.headerContainerClassName,
        columnClassName: options.columnClassName,
        columnStyle: options.columnStyle,
        columnWidth: options.columnWidth,
        columnStretch: options.columnStretch,
        cellRenderer,
        cellRendererParams,
        cellRendererClassName: options.cellRendererClassName,
        cellContainerClassName: options.cellContainerClassName,
    };
}
