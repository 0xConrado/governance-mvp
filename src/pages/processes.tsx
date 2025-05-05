import { useEffect, useState } from 'react';
import ProcessForm from '@/components/ProcessForm';
import EditProcessDialog from '@/components/EditProcessDialog';
import { 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  CircularProgress,
  IconButton,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

type Process = {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
};

export default function ProcessesPage() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);

  const fetchProcesses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/processes');
      const data = await response.json();
      setProcesses(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  const handleEditClick = (process: Process) => {
    setEditingProcess(process);
  };

  const handleUpdateProcess = async (updatedProcess: Process) => {
    await fetch('/api/processes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProcess),
    });
    fetchProcesses();
    setEditingProcess(null);
  };

  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Processos Governamentais
      </Typography>
      
      <ProcessForm onProcessAdded={fetchProcesses} />
      
      {loading ? (
        <CircularProgress sx={{ display: 'block', margin: '2rem auto' }} />
      ) : (
        <List>
          {processes.map((process) => (
            <ListItem 
              key={process.id}
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="edit"
                  onClick={() => handleEditClick(process)}
                >
                  <EditIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={process.title}
                secondary={`Status: ${process.status}`}
              />
            </ListItem>
          ))}
        </List>
      )}

      {editingProcess && (
        <EditProcessDialog
          process={editingProcess}
          open={Boolean(editingProcess)}
          onClose={() => setEditingProcess(null)}
          onSave={handleUpdateProcess}
        />
      )}
    </Box>
  );
}