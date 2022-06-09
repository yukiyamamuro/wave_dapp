import { FC } from "react";
import { Button } from "@mui/material";

type Props = {
  currentAccount: string;
  setCurrentAccount: any;
}

export const WalletConnectionButton: FC<Props> = ({
  currentAccount,
  setCurrentAccount
}) => {
  const connectWallet = async () => {
    try {
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        alert("Cant find Metamask. Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {!currentAccount &&
        (<Button
          variant="contained"
          fullWidth
          onClick={connectWallet}
          >
          Connect Your Wallet
        </Button>)
      }
      {currentAccount &&
        (
          <Button
            variant="contained"
            disabled
          >
            Metamask is Connected!!
          </Button>
        )
      }
    </>
  )
}