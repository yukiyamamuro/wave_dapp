import { FC } from "react";
import { TextField } from "@mui/material";

type Props = {
  message: string;
  messageSetter: any;
}


export const CommonTextField: FC<Props> = ({
  message,
  messageSetter
}) => {
  return (
    <TextField
      fullWidth
      placeholder="メッセージを入力"
      label="message"
      value={message}
      onChange={(e) => messageSetter(e.target.value)}
    />
  )
}