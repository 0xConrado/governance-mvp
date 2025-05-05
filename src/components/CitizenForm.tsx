'use client';
import { useState } from 'react';
import { Button, TextField, Grid, MenuItem } from '@mui/material';

const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

// Adicione estas props no componente
type CitizenFormProps = {
  initialData?: Partial<Citizen>;
  isEdit?: boolean;
};

// Atualize a assinatura do componente para receber props
export default function CitizenForm({ initialData = {}, isEdit = false }: CitizenFormProps) {
  const [form, setForm] = useState({
    full_name: initialData.full_name || '',
    cpf: initialData.cpf || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    address: initialData.address || '',
    city: initialData.city || '',
    state: initialData.state || '',
    birth_date: initialData.birth_date || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = isEdit ? `/api/citizens/${initialData.id}` : '/api/citizens';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar');
      }

      alert(isEdit ? 'Cidadão atualizado com sucesso!' : 'Cidadão cadastrado com sucesso!');

      if (!isEdit) {
        setForm({
          full_name: '',
          cpf: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          birth_date: ''
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nome Completo"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="CPF"
            name="cpf"
            value={formatCPF(form.cpf)}
            onChange={(e) => {
              const { name, value } = e.target;
              setForm(prev => ({ ...prev, [name]: value.replace(/\D/g, '') }));
            }}
            inputProps={{ maxLength: 14 }}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Data de Nascimento"
            name="birth_date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.birth_date}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Telefone"
            name="phone"
            value={form.phone}
            onChange={(e) => {
              const { name, value } = e.target;
              setForm(prev => ({ ...prev, [name]: value.replace(/\D/g, '') }));
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Endereço"
            name="address"
            value={form.address}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Cidade"
            name="city"
            value={form.city}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Estado"
            name="state"
            value={form.state}
            onChange={handleChange}
          >
            {states.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
          >
            {loading
              ? isEdit ? 'Atualizando...' : 'Cadastrando...'
              : isEdit ? 'Atualizar Cidadão' : 'Cadastrar Cidadão'}
          </Button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </Grid>
      </Grid>
    </form>
  );
}
