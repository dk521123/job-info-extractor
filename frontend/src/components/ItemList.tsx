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
  TextField
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ItemDialog } from './ItemDialog';
import type { JobInfo } from '../types/JobInfo';

const LIMIT = 5;

export const ItemList: React.FC = () => {
  const [jobs, setJobs] = useState<JobInfo[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(offset, query);
  }, [offset, query]);

  const handleSearch = () => {
    setOffset(0);
    setQuery(search);
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

      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          fullWidth
          label={t('searchLabel')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          {t('search')}
        </Button>
      </Stack>

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
                    cursor: "pointer"
                  }}
                  onClick={() => handleSelect(job)}
                >
                  <ListItemText
                    primary={`${job.position} @ ${job.company_name}`}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary" component="span">
                          {job.location} | {job.salary}
                        </Typography>
                      </>
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
      <div>
        <ItemDialog
          openDialog={openDialog}
          onClose={() => setOpenDialog(false)}
          targetJobInfo={selectedJob ?? undefined}
          onSave={handleSave}
        />
      </div>
    </Box>
  );
};

export default ItemList;
