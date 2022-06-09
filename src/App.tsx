import { Box, Grid } from "@mui/material";
import { ethers } from "ethers";
import { FC, useEffect, useState } from "react";
import { WalletConnectionButton } from "./components/feature/WalletConnectButton";

import { WaveFormCard } from "./components/feature/WaveFormCard";
import { WaveList } from "./components/feature/WaveList";
import abi from "./utils/WavePortal.json";

export const App: FC = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [messageValue, setMessageValue] = useState("");
  /* すべてのwavesを保存する状態変数を定義 */
  const [allWaves, setAllWaves] = useState([]);
  console.log("currentAccount: ", currentAccount);
  /* デプロイされたコントラクトのアドレスを保持する変数を作成 */
  const contractAddress = "0xEEdf33F342b4250cAa1B8a74791576378277CCbB";
  /* コントラクトからすべてのwavesを取得するメソッドを作成 */
  /* ABIの内容を参照する変数を作成 */
  const contractABI = abi.abi;

  const getAllWaves = async () => {
    const ethereum = (window as any).ethereum;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        /* コントラクトからgetAllWavesメソッドを呼び出す */
        const waves = await wavePortalContract.getAllWaves();
        /* UIに必要なのは、アドレス、タイムスタンプ、メッセージだけなので、以下のように設定 */
        const wavesCleaned = waves.map((wave: any) => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          };
        });
        /* React Stateにデータを格納する */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      /* ユーザーのウォレットへのアクセスが許可されているかどうかを確認 */
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllWaves();
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
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
            <WalletConnectionButton
              currentAccount={currentAccount}
              setCurrentAccount={setCurrentAccount}
              />
          </Box>
          <WaveFormCard
            message={messageValue}
            messageSetter={setMessageValue}
            />
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