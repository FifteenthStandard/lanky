import * as React from 'react';
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material';
import {
  AddComment,
  Edit,
  Quiz,
} from '@mui/icons-material';

export default function Actions() {
  return <SpeedDial
    ariaLabel="SpeedDial basic example"
    sx={{ position: 'fixed', bottom: 16, right: 16 }}
    icon={<SpeedDialIcon />}
  >
    <SpeedDialAction
      icon={<AddComment />}
      tooltipTitle="Add&nbsp;Phrase"
      tooltipOpen
    />
    <SpeedDialAction
      icon={<Edit />}
      tooltipTitle="Edit&nbsp;Phrases"
      tooltipOpen
    />
    <SpeedDialAction
      icon={<Quiz />}
      tooltipTitle="Quiz"
      tooltipOpen
    />
  </SpeedDial>;
};
