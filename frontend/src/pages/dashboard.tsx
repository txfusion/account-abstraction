import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useContract,
  useContractRead,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import { SendTransaction } from "../components/SendTransaction";



function Dashboard() {

  let { connector: activeConnector, isConnected } = useAccount();

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="container">
      {isConnected ? (
        <h2 className="activeConnector">
          <SendTransaction/>
        </h2>
      ) : (
        <h2>Not Connected</h2>
      )}
      </div>
    );
}

export default Dashboard