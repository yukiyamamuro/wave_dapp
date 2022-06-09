import { FC } from "react";

type Props = {
  currentAccount: string;
  allWaves: any[];
}

export const WaveList: FC<Props> = ({
  currentAccount,
  allWaves
}) => {
  return (
    <>
      {currentAccount &&
          allWaves
            .slice(0)
            .reverse()
            .map((wave, index) => {
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#F8F8FF",
                    marginTop: "16px",
                    padding: "8px",
                  }}
                >
                  <div>Address: {wave.address}</div>
                  <div>Time: {wave.timestamp.toString()}</div>
                  <div>Message: {wave.message}</div>
                </div>
              );
            })}
    </>
  )
}