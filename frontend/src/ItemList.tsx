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

const ItemList: React.FC = () => {
  const [jobs, setJobs] = useState<JobInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/list/`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Job Listings
      </Typography>

      <Paper elevation={3}>
        <List>
          {jobs.map((job, index) => (
            <React.Fragment key={job.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={`${job.position} at ${job.company_name}`}
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        component="span"
                      >
                        {job.location} | {job.salary}
                      </Typography>
                      <Typography variant="caption" display="block" component="span">
                        File: {job.file_name} ({job.file_type})
                      </Typography>
                      <Typography variant="caption" display="block" component="span">
                        Created at: {new Date(job.created_at || '').toLocaleString()}
                      </Typography>
                      <Typography variant="caption" display="block" component="span">
                        Updated at: {new Date(job.updated_at || '').toLocaleString()}
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
    </Box>
  );
};

export default ItemList;
