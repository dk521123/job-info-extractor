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

type JobInfo = {
  id: number;
  file_name: string;
  file_type: string;
  company_name: string;
  position: string;
  location: string;
  salary: string;
  created_at?: string;
  updated_at?: string;
};

const LIMIT = 5;

const ItemList: React.FC = () => {
  const [jobs, setJobs] = useState<JobInfo[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

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

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Job Listings
      </Typography>

      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          fullWidth
          label="Search (Company Name, Position, Location)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
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
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`${job.position} at ${job.company_name}`}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary" component="span">
                          {job.location} | {job.salary}
                        </Typography>
                        <Typography variant="caption" display="block" component="span">
                          File: {job.file_name} ({job.file_type})
                        </Typography>
                        <Typography variant="caption" display="block" component="span">
                          Created at: {new Date(job.created_at || '').toLocaleString()}
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
          Prev
        </Button>
        <Button variant="outlined" onClick={handleNext} disabled={jobs.length < LIMIT}>
          Next
        </Button>
      </Stack>
    </Box>
  );
};

export default ItemList;
