import { useLocation, useNavigate } from 'react-router-dom';
import {
  Badge,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';
import {
  FactCheck,
  Translate,
} from '@mui/icons-material';
import { useVocab } from '../contexts';

export default function Navigation(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const vocab = useVocab();

  const selectedTab = location.pathname;

  function handleChange(_: React.SyntheticEvent, newValue: string): void {
    navigate(newValue);
  };

  return (
    <BottomNavigation
      showLabels
      value={selectedTab}
      onChange={handleChange}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <BottomNavigationAction
        label="List"
        icon={<Badge badgeContent={vocab.vocab.length} color="primary"><Translate /></Badge>}
        value="/"
      />
      <BottomNavigationAction
        label="Test"
        icon={<FactCheck />}
        value="/test"
      />
    </BottomNavigation>
  );
};
