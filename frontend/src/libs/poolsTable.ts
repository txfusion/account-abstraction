import { ColumnDef, RowData } from "@tanstack/react-table";

type Pool = {
    name: string;
    symbol: string;
    logoURI: string;
};

export type ColumnDefExtended<TData extends RowData, TValue = unknown> = ColumnDef<TData, TValue> & {
    isImage?: boolean,
}

export const columns: ColumnDefExtended<Pool>[] = [
    {
        accessorKey: 'name',
        cell: info => info.getValue(),
    },
    {
        accessorKey: 'symbol',
        cell: info => info.getValue(),
    }
];

