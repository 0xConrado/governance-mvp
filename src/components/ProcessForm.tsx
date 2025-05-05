import { useState } from 'react';
import { Button, TextField, CircularProgress } from '@mui/material';

export default function ProcessForm({ onProcessAdded }: { onProcessAdded?: () => void }) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/processes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (response.ok) {
        setTitle('');
        onProcessAdded?.();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '2rem 0' }}>
      <TextField
        label="Título do Processo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        required
        disabled={loading}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        style={{ marginTop: '1rem' }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Enviar'}
      </Button>
    </form>
  );
}