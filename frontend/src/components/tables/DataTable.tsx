import * as React from 'react';
import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	chakra,
	Text,
} from '@chakra-ui/react';
import { SearchIcon, TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
	useReactTable,
	flexRender,
	getCoreRowModel,
	SortingState,
	getSortedRowModel,
	FilterFn,
	getFilteredRowModel,
	ColumnDef,
	ExpandedState,
	getExpandedRowModel,
} from '@tanstack/react-table';

import { rankItem } from '@tanstack/match-sorter-utils';
import { PurpleInput } from '../inputs/PurpleInput';

export type DataTableProps<Data extends object> = {
	data: Data[];
	columns: ColumnDef<Data, any>[];
	globalFilter?: string;
	setGlobalFilterState?: any;
	headerTitle: string;
};

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
	const itemRank = rankItem(row.getValue(columnId), value);

	addMeta({
		itemRank,
	});

	return itemRank.passed;
};

export function DataTable<Data extends object>({
	data,
	columns,
	globalFilter,
	setGlobalFilterState,
	headerTitle,
}: DataTableProps<Data>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [expanded, setExpanded] = React.useState<ExpandedState>({});

	const table = useReactTable({
		columns,
		data,

		getCoreRowModel: getCoreRowModel(),
		globalFilterFn: fuzzyFilter,
		onGlobalFilterChange: setGlobalFilterState,
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		filterFns: {
			fuzzy: fuzzyFilter,
		},
		state: {
			sorting,
			globalFilter,
			expanded,
		},
		getExpandedRowModel: getExpandedRowModel(),
		onExpandedChange: setExpanded,
		getSubRows: (originalRow) => originalRow,
	});

	return (
		<>
			<div className='flex flex-row items-center justify-between px-4'>
				<Text color='white' fontSize='2xl' fontWeight='semibold'>
					{headerTitle}
				</Text>
				<PurpleInput
					iconLeft={<SearchIcon color='white' />}
					text={''}
					w='30%'
					placeHolder='Search'
					value={globalFilter}
					setValue={setGlobalFilterState}
				/>
			</div>
			<Table p={2}>
				<Thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<Tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								const meta: any = header.column.columnDef.meta;
								return (
									<Th
										textColor='white'
										key={header.id}
										onClick={header.column.getToggleSortingHandler()}
										isNumeric={meta?.isNumeric}
										borderColor='system-purple.500'>
										{flexRender(
											header.column.columnDef.header,
											header.getContext()
										)}
										<chakra.span pl='4'>
											{header.column.getIsSorted() ? (
												header.column.getIsSorted() === 'desc' ? (
													<TriangleDownIcon aria-label='sorted descending' />
												) : (
													<TriangleUpIcon aria-label='sorted ascending' />
												)
											) : null}
										</chakra.span>
									</Th>
								);
							})}
						</Tr>
					))}
				</Thead>
				<Tbody>
					{table.getRowModel().rows.map((row) => (
						<Tr
							_hover={{
								background: 'black',
							}}
							key={row.id}
							textColor='white'>
							{row.getAllCells().map((cell) => {
								const meta: any = cell.column.columnDef.meta;
								return (
									<Td
										borderColor='system-purple.500'
										key={cell.id}
										isNumeric={meta?.isNumeric}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</Td>
								);
							})}
						</Tr>
					))}
				</Tbody>
			</Table>
		</>
	);
}
