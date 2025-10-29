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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ItemDialog } from './dialogs/ItemDialog';
import { SearchBox } from './SearchBox';
import type { UpdatedJobInfo } from '../types/JobInfo';
import { SettingsManager } from '../utils/SettingsManager';

const rowLimit = SettingsManager.getRowLimit();

type Props = {
  reloadTrigger?: number;
  onUploadComplete: () => void;
};

export const ItemList: React.FC<Props> = ({ reloadTrigger, onUploadComplete }) => {
  const [jobs, setJobs] = useState<UpdatedJobInfo[]>([]);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<UpdatedJobInfo | null>(null);

  const { t } = useTranslation();

  const fetchJobs = async (offsetValue: number, searchQuery: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('limit', rowLimit.toString());
      params.append('offset', offsetValue.toString());
      if (searchQuery) {
          params.append('search', searchQuery);
      }
      console.log('Fetching jobs with params:', params.toString());
      const url = `${import.meta.env.VITE_API_BASE_URL}/list/?${params.toString()}`;
      const response = await fetch(url, { method: 'GET' });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const job_info_list = await response.json();
      setJobs(job_info_list.job_info_list);
      setTotalCount(job_info_list.total_count);
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

  const handleNext = () => {
    setOffset((prev) => prev + rowLimit);
  };

  const handlePrevious = () => {
    setOffset((prev) => Math.max(prev - rowLimit, 0));
  };

  const handleSelect = (jobInfo: UpdatedJobInfo) => {
    setSelectedJob(jobInfo);
    setOpenDialog(true);
  };

  const handleSave = (updatedJobInfo: UpdatedJobInfo) => {
    switch (updatedJobInfo.updateType) {
      case "update":
        // Update the target job info in the list
        setJobs((prevJobs) =>
          prevJobs.map((jobInfo) => (jobInfo.id === updatedJobInfo.id ? updatedJobInfo : jobInfo))
        );
        break;
      case "delete":
        // Delete the target job info in the list
        setJobs((prevJobs) =>
          prevJobs.filter((jobInfo) => jobInfo.id !== updatedJobInfo.id)
        );
        break;
      default:
        break;
    }
      
    setOpenDialog(false);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('jobList')}
      </Typography>

      {/* Search bar for AWS-like filters */}
      <SearchBox onSearch={(filters) => {
        const queryString = filters.map(f => `${f.key}:${f.value}`).join(' ');
        setOffset(0);
        setQuery(queryString);
      }} />
      
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
        <Button variant="outlined" onClick={handleNext} disabled={offset + rowLimit >= totalCount}>
          {t('next')}
        </Button>
        <Box>({t('totalCount')}: {totalCount})</Box>
      </Stack>

      <ItemDialog
        isForNew={false}
        openDialog={openDialog}
        onClose={() => setOpenDialog(false)}
        targetJobInfo={selectedJob ?? undefined}
        onSave={handleSave}
      />
    </Box>
  );
};

export default ItemList;
