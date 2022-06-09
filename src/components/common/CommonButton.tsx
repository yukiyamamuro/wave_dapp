import { FC, ReactNode } from "react";
import { Button } from "@mui/material";

export type Props = {
  children: ReactNode;
  handleSubmit: () => Promise<void>;
}

export const CommonButton: FC<Props> = ({ children, handleSubmit }) => {
  return (
    <Button
      variant="outlined"
      fullWidth
      onSubmit={handleSubmit}
    >
      {children}
    </Button>
  )
}