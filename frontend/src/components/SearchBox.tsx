import React, { useState, useRef } from 'react';
import { Box, Chip, TextField, Button, MenuItem, Paper, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Filter = { key: string; value: string };

const KEY_SUGGESTIONS = [
  'company_name', 'place', 'position', 'location', 'salary',
  'file_name', 'file_type', 'created_at', 'updated_at', 'id'
];

export const SearchBox: React.FC<{
  onSearch: (filters: Filter[]) => void;
}> = ({ onSearch }) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<Filter[]>([]);
  const [isComposing, setIsComposing] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [isEnteringValue, setIsEnteringValue] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Input handling
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposing) return;

    // ":" Move to Value input mode...
    if (e.key === ':' && !isEnteringValue) {
      e.preventDefault();
      setIsEnteringValue(true);
      return;
    }

    // "Space" : Inputed
    if (e.key === ' ' && isEnteringValue) {
      e.preventDefault();
      const trimmed = valueInput.trim();
      if (keyInput && trimmed) {
        setFilters((prev) => [...prev, { key: keyInput, value: trimmed }]);
        setKeyInput('');
        setValueInput('');
        setIsEnteringValue(false);
      }
      // Keep focused
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }

    // key inpput mode by Backspace
    if (e.key === 'Backspace' && isEnteringValue && valueInput === '') {
      const newText = `${keyInput}`.slice(0, -1);
      setKeyInput(newText);
      setIsEnteringValue(false);
      e.preventDefault();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (!isEnteringValue) {
      setKeyInput(text);
    } else {
      const [key, ...rest] = text.split(':');
      const value = rest.join(':');
      if (!text.includes(':')) {
        // ":" disappeared, move to key input mode
        setIsEnteringValue(false);
        setKeyInput(text);
        setValueInput('');
      } else {
        setKeyInput(key);
        setValueInput(value);
      }
    }
  };

  const handleSearch = () => {
    let newFilters = [...filters];
    if (keyInput && valueInput) {
      // Add any in-progress input
      newFilters.push({ key: keyInput, value: valueInput });
    }
    console.log("Search clicked:", newFilters);
    onSearch(newFilters);
  };

  const removeFilter = (index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 1,
        width: '100%',
        maxWidth: 800,
        border: '1px solid #ccc',
        borderRadius: 2,
        p: 1,
      }}
    >
      {filters.map((f, i) => (
        <Chip
          key={i}
          label={`${f.key}: ${f.value}`}
          onDelete={() => removeFilter(i)}
          color="primary"
          variant="outlined"
        />
      ))}

      <TextField
        inputRef={inputRef}
        variant="standard"
        value={`${keyInput}${isEnteringValue ? ':' : ''}${valueInput}`}
        onChange={handleChange}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onKeyDown={handleKeyDown}
        placeholder={t('searchPlaceholder')}
        sx={{
          flex: 1,
          minWidth: 300,
        }}
      />

      <Button variant="contained" onClick={handleSearch}>
        {t('search')}
      </Button>

      {/* Show key suggestions */}
      {!isEnteringValue && keyInput && (
        <Paper sx={{ position: 'absolute', mt: 5, zIndex: 10, width: 300 }}>
          {KEY_SUGGESTIONS.filter((k) => k.includes(keyInput)).map((k) => (
            <MenuItem
              key={k}
              onClick={() => {
                setKeyInput(k);
                setIsEnteringValue(true);
                setTimeout(() => inputRef.current?.focus(), 0);
              }}
            >
              <ListItemText primary={k} />
            </MenuItem>
          ))}
        </Paper>
      )}
    </Box>
  );
};
