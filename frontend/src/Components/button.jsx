import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Logo from "../../public/add.svg"

export default function BasicButtons() {
  return (
    <Stack spacing={2} direction="row">
      <Button variant="contained" sx={{background: "#ffffff", padding: "8px 0px", borderRadius: "40px", color: "black", width: "7vw", gap: "8px", fontWeight: "bolder", textAlign: "center", textTransform: "none"}}> <img src={Logo} alt="" width={25} />Sk'ask</Button>
    </Stack>
  );
}