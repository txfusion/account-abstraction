import { useEffect, useState } from "react";
import {
  useAccount,
} from "wagmi";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import AccountManagmentModal from "@/components/AccountManagmentModal";
import { PurpleButton } from "@/components/buttons/PurpleButton";
import { PurpleInput } from "@/components/inputs/PurpleInput";
import { connectAccount, createAccount, disconectAccount } from "@/libs/accountManagment";
import { AccountButton } from "@/components/buttons/AccountButton";
import { columns } from "../libs/poolsTable"
import { DataTable } from "@/components/DataTable";
import { SearchIcon } from "@chakra-ui/icons";


function Dashboard() {

  let { isConnected } = useAccount();
  let [connected, setConnected] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [globalFilter, setGlobalFilterState] = useState('');

  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/pools')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <>
      <AccountManagmentModal isOpen={isOpen} onClose={onClose} setConnected={setConnected} connectAccount={connectAccount} createAccount={createAccount}></AccountManagmentModal>
      <Box
        ms="100"
        me="100"
        p={5}
        justifyItems="center"
        justifySelf="center"
        border="0.1rem"
        backgroundColor="black"
        borderStyle="solid"
        borderColor="system-purple.500"
        borderRadius="3xl"
        w="50%"
      >
        <Flex>
          {!connected ? <PurpleButton onClick={onOpen} text={"Account Managment"}></PurpleButton> : <AccountButton disconnect={disconectAccount} setConnected={setConnected}></AccountButton>}
        </Flex>
        <Box
          backgroundColor="system-gray.900"
          borderStyle="solid"
          border="0.4rem"
          borderRadius="2xl"
          mt="10"
          pt="2"
          pb="10">
          <PurpleInput icon={<SearchIcon color="white"/>} text={""} w="20%" placeHolder="Search" setValue={setGlobalFilterState}></PurpleInput>
          <DataTable columns={columns} data={data} globalFilter={globalFilter} setGlobalFilterState={setGlobalFilterState} mergeObjects={[{ mergeField: "name", mergeWith: "logoURI", isImage: true }]} buttonEnd={{ text: "Deposit", onClick: null }} />
        </Box>
      </Box>
    </>
  );
}

export default Dashboard