import React from "react";
import { styled, Tooltip } from "@mui/material";

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }}/>
))(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: 'white',
    color: 'black',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    fontSize: '13px',
  },
}));

export { StyledTooltip };
