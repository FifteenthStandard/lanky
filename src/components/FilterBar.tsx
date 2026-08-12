import {
  InputAdornment,
  Paper,
  TextField,
} from '@mui/material';
import {
  Close,
  FilterList,
} from '@mui/icons-material';

export default function FilterBar({
  value,
  onChange,
}: {
  value: string,
  onChange: (value: string) => void,
}): React.ReactElement {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  };

  function handleClickClear() {
    onChange('');
  };

  return (
    <Paper
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
      }}
    >
      <TextField
        fullWidth
        placeholder="Filter by English, 中文, pin yin, jyut6 ping3"
        value={value}
        onChange={handleChange}
        slotProps={{
          htmlInput: {
            enterKeyHint: 'search',
          },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                {value
                  ? <Close onClick={handleClickClear} sx={{ cursor: 'pointer' }} />
                  : <FilterList />
                }
              </InputAdornment>
            ),
          },
        }}
      />
    </Paper>
  );
};
