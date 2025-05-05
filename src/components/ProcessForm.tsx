import { useState } from 'react';
import { Button, TextField } from '@mui/material';

export default function ProcessForm() {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/processes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (response.ok) {
      setTitle('');
      alert('Processo cadastrado!');
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
      />
      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        style={{ marginTop: '1rem' }}
      >
        Enviar
      </Button>
    </form>
  );
}