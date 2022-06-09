import { FC } from "react";
import { Box, Card, Typography } from "@mui/material";

import { CommonButton } from "../common/CommonButton";
import { CommonTextField } from "../common/CommonTextField";
import abi from "../../utils/WavePortal.json";
import { ethers } from "ethers";

type Props = {
  message: string;
  messageSetter: any;
}

export const WaveFormCard: FC<Props> = ({
  message,
  messageSetter
}) => {
  const contractAddress = "0xEEdf33F342b4250cAa1B8a74791576378277CCbB";
  const contractABI = abi.abi;
  const wave = async () => {
    try {
      const ethereum = (window as any).ethereum;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        /* ABIを参照 */
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        /* コントラクトに👋（wave）を書き込む */
        const waveTxn = await wavePortalContract.wave(message, {
          gasLimit: 300000,
        });
        console.log("Mining...", waveTxn.hash);
        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card sx={{ maxWidth: 275 ,padding: 10}}>
      <Typography variant="h2" paddingBottom={3}>Welcome!</Typography>
      <Typography>メッセージと共に👋を送ってください</Typography>
      <Box height={10} />
      <CommonTextField
        message={message}
        messageSetter={messageSetter}
      />
      <Box height={10}/>
      <CommonButton
        handleSubmit={wave}
      >
        Wave👋👋
      </CommonButton>
    </Card>
  )
}