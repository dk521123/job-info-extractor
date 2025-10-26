import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  CircularProgress,
  Button,
  Stack,
  Chip,
  TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ItemDialog } from './ItemDialog';
import type { JobInfo } from '../types/JobInfo';
import type { Filter } from '../types/Filter';

const LIMIT = 5;

type Props = {
  reloadTrigger?: number;
  onUploadComplete: () => void;
};

export const ItemList: React.FC<Props> = ({ reloadTrigger, onUploadComplete }) => {
  const [jobs, setJobs] = useState<JobInfo[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  // For AWS-like search filters
  const [filters, setFilters] = useState<Filter[]>([]);
  const [input, setInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const [query, setQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobInfo | null>(null);

  const { t } = useTranslation();

  const fetchJobs = async (offsetValue: number, searchQuery: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: LIMIT.toString(),
        offset: offsetValue.toString(),
      });
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/list?${params.toString()}`
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setJobs(data);
      onUploadComplete();
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get jobs on mount and when offset or query changes
  useEffect(() => {
    fetchJobs(offset, query);
  }, [offset, query, reloadTrigger]);

  // Input handling for AWS-like search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ignore key events during composition (for IME input)
    if (isComposing) return;

    // Space key adds a new filter
    if (e.key === ' ') {
      const trimmed = input.trim();

      // Check for "key:value" format
      if (trimmed.includes(':')) {
        const [key, ...valueParts] = trimmed.split(':');
        // Re-join value parts in case value contains ':'
        const value = valueParts.join(':');
        if (key && value) {
          setFilters((prev) => [...prev, { key, value }]);
          setInput('');
          // Prevent space input
          e.preventDefault();
        }
      }
    }
  };

  const handleRemoveFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleSearch = () => {
    setOffset(0);
    // Join filters into a single query string
    const queryString = filters.map((f) => `${f.key}:${f.value}`).join(' ');
    setQuery(queryString);
  };

  const handleNext = () => {
    setOffset((prev) => prev + LIMIT);
  };

  const handlePrevious = () => {
    setOffset((prev) => Math.max(prev - LIMIT, 0));
  };

  const handleSelect = (jobInfo: JobInfo) => {
    setSelectedJob(jobInfo);
    setOpenDialog(true);
  };

  const handleSave = (updatedJobInfo: JobInfo) => {
    setJobs((prev) =>
      prev.map((jobInfo) => (jobInfo.id === updatedJobInfo.id ? updatedJobInfo : jobInfo))
    );
    setOpenDialog(false);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('jobList')}
      </Typography>

      {/* Search bar for AWS-like filters */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
          p: 1,
          border: '1px solid #ccc',
          borderRadius: 2,
          mb: 2,
        }}
      >
        {filters.map((f, i) => (
          <Chip
            key={i}
            label={`${f.key}: ${f.value}`}
            onDelete={() => handleRemoveFilter(i)}
            color="primary"
            variant="outlined"
          />
        ))}
        <TextField
          variant="standard"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder={t('searchPlaceholder')}
          sx={{ flex: 1, minWidth: 200 }}
        />
        <Button variant="contained" onClick={handleSearch}>
          {t('search')}
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3}>
          <List>
            {jobs.map((job, index) => (
              <React.Fragment key={job.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSelect(job)}
                >
                  <ListItemText
                    primary={`${job.position} @ ${job.company_name}`}
                    secondary={
                      <Typography variant="body2" color="text.secondary" component="span">
                        {job.location} | {job.salary}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < jobs.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
        <Button variant="outlined" onClick={handlePrevious} disabled={offset === 0}>
          {t('prev')}
        </Button>
        <Button variant="outlined" onClick={handleNext} disabled={jobs.length < LIMIT}>
          {t('next')}
        </Button>
      </Stack>

      <ItemDialog
        openDialog={openDialog}
        onClose={() => setOpenDialog(false)}
        targetJobInfo={selectedJob ?? undefined}
        onSave={handleSave}
      />
    </Box>
  );
};

export default ItemList;
