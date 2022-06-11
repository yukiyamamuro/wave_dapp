import { Box, Button, Card, Grid, TextField, Typography } from "@mui/material";
import { ethers } from "ethers";
import { FC, useEffect, useState } from "react";

import { WaveList } from "./components/feature/WaveList";
import { Ethereum } from './types/Ethereum';
import abi from "./utils/WavePortal.json";

declare global {
  interface Window {
    ethereum: Ethereum;
  }
}

type Wave = {
  address: any;
  timestamp: any;
  message: string;
};

export const App: FC = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [messageValue, setMessageValue] = useState("");
  const [allWaves, setAllWaves] = useState<Wave[]>([]);
  console.log("currentAccount: ", currentAccount);

  const contractAddress = "0xEEdf33F342b4250cAa1B8a74791576378277CCbB";
  const contractABI = abi.abi;

  const getAllWaves = async () => {
    const { ethereum } = window;
    try {
      if (!ethereum) {
        console.log("Ethereum object doesn't exist!");
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      const waves = await wavePortalContract.getAllWaves() as any[];
      const wavesCleaned: Wave[] = waves.map((wave) => {
        return {
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        };
      });

      setAllWaves(wavesCleaned);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    let wavePortalContract: any;

    const onNewWave = (from: any, timestamp: any, message: any) => {
      console.log("NewWave", from, timestamp, message);
      getAllWaves();
    };

    const { ethereum } = window;
    if (!ethereum) {
      console.log("Ethereum object doesn't exist!");
      return () => {
        if (wavePortalContract) {
          wavePortalContract.off("NewWave", onNewWave);
        }
      };
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on("NewWave", onNewWave);
    getAllWaves();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      }

      console.log("We have the ethereum object", ethereum);

      const accounts = await ethereum.request!({ method: "eth_accounts" });
      console.log(accounts);
      if (accounts.length === 0) {
        console.log("No authorized account found");
        return;
      }

      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } catch (e) {
      console.error(e);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request!({ method: "eth_requestAccounts" });
      console.log("Connected: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (e) {
      console.error(e);
    }
  };

  const wave = async () => {
    console.log("try wave!");
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Ethereum object doesn't exist!");
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      let count = await wavePortalContract.getTotalWaves();
      console.log("Retrieved total wave count...", count.toNumber());
      console.log("Signer:", signer);

      let contractBalance = await provider.getBalance(wavePortalContract.address);
      console.log("Contract balance:", ethers.utils.formatEther(contractBalance));

      const waveTxn = await wavePortalContract.wave(messageValue, {
        gasLimit: 300000,
      });
      console.log("Mining...", waveTxn.hash);
      await waveTxn.wait();
      console.log("Mined -- ", waveTxn.hash);
      count = await wavePortalContract.getTotalWaves();
      console.log("Retrieved total wave count...", count.toNumber());

      let contractBalance_post = await provider.getBalance(
        wavePortalContract.address
      );
      console.log("contractBalance: ", contractBalance);
      console.log("contractBalance_post: ", contractBalance_post);
      /* コントラクトの残高が減っていることを確認 */
      if (contractBalance_post < contractBalance) {
        /* 減っていたら下記を出力 */
        console.log("User won ETH!");
      } else {
        console.log("User didn't win ETH.");
      }
      console.log(
        "Contract balance after wave:",
        ethers.utils.formatEther(contractBalance_post)
      );
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);


  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        >
        <Grid>
          <Box padding={10}>
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
          </Box>
          <Card sx={{ maxWidth: 275 ,padding: 10}}>
            <Typography variant="h2" paddingBottom={3}>Welcome!</Typography>
            <Typography>メッセージと共に👋を送ってください</Typography>
            <Box height={10} />
            <TextField
              fullWidth
              placeholder="メッセージを入力"
              label="message"
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
            />
            <Box height={10}/>
            <Button
              variant="outlined"
              fullWidth
              onClick={wave}
            >
              Wave👋👋
            </Button>
          </Card>
        </Grid>
      </Box>
      <Box margin={5}>
        <WaveList
          currentAccount={currentAccount}
          allWaves={allWaves}
        />
      </Box>
    </>
  )
}