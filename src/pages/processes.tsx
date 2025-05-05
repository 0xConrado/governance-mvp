import { useEffect, useState } from 'react';
import ProcessForm from '@/components/ProcessForm';
import { Typography, List, ListItem, ListItemText } from '@mui/material';

type Process = {
  id: string;
  title: string;
  status: string;
};

export default function ProcessesPage() {
  const [processes, setProcesses] = useState<Process[]>([]);

  useEffect(() => {
    fetch('/api/processes')
      .then((res) => res.json())
      .then(setProcesses);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4">Processos Governamentais</Typography>
      <ProcessForm />
      <List>
        {processes.map((process) => (
          <ListItem key={process.id}>
            <ListItemText 
              primary={process.title} 
              secondary={`Status: ${process.status}`} 
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}