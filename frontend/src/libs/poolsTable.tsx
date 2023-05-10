import { ColumnDef, RowData, createColumnHelper } from "@tanstack/react-table";
import { Pool } from "./types";
import { Box, HStack, Image } from "@chakra-ui/react";
import { PurpleButton } from "@/components/buttons/PurpleButton";

const DepositAction = ({ getValue, row, column, table }) => {
  return (<PurpleButton text={"Deposit"} onClick={null} attributes={row.id} closeClick={null} />);
}

const MergePictureWithName = ({ getValue, row, column, table }) => {
  return (
    <HStack
      spacing={5}>
      <Box
        borderColor="system-purple.500"
        border="0.2rem">
        <Image
          boxSize='50px'
          src={row.original.logoURI} alt='Image' />
      </Box>
      <Box>
        {getValue()}
      </Box>
    </HStack>);
}

const columnHelper = createColumnHelper<Pool>();

export type ColumnDefExtended<TData extends RowData, TValue = unknown> = ColumnDef<TData, TValue> & {
  isImage?: boolean,
}

export const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: MergePictureWithName
  }),
  columnHelper.accessor("symbol", {
    header: "Symbol",
  }),
  columnHelper.display({
    id: "edit",
    cell: DepositAction,
  }),
];

