import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';

type Process = {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
};

type EditProcessDialogProps = {
  process: Process;
  open: boolean;
  onClose: () => void;
  onSave: (updatedProcess: Process) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
};

export default function EditProcessDialog({
  process,
  open,
  onClose,
  onSave,
  onDelete
}: EditProcessDialogProps) {
  const [title, setTitle] = useState(process.title);
  const [status, setStatus] = useState(process.status);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave({
        ...process,
        title,
        status
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (onDelete && confirm('Tem certeza que deseja excluir este processo?')) {
      setLoading(true);
      try {
        await onDelete(process.id);
        onClose();
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Processo</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Título"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 3 }}
        />
        
        <TextField
          select
          label="Status"
          fullWidth
          variant="outlined"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          SelectProps={{
            native: true
          }}
        >
          <option value="pending">Pendente</option>
          <option value="approved">Aprovado</option>
          <option value="rejected">Rejeitado</option>
        </TextField>
      </DialogContent>
      <DialogActions>
        {onDelete && (
          <Button 
            onClick={handleDelete} 
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Excluir'}
          </Button>
        )}
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSave} 
          color="primary" 
          disabled={loading || !title}
        >
          {loading ? <CircularProgress size={24} /> : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}