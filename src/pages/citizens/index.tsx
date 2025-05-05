import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  TextField,
  Button
} from '@mui/material';
import Link from 'next/link';

type Citizen = {
  id: number;
  full_name: string;
  cpf: string;
  email: string;
};

export default function CitizensListPage() {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCitizens = async () => {
      try {
        const response = await fetch(`/api/citizens?search=${search}`);
        const data = await response.json();
        setCitizens(data);
      } catch (error) {
        console.error('Erro ao buscar cidadãos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCitizens();
  }, [search]);

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cidadãos Cadastrados
      </Typography>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <TextField
          label="Buscar por nome ou CPF"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link href="/citizens/register" passHref>
          <Button variant="contained" color="primary">
            Novo Cadastro
          </Button>
        </Link>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome Completo</TableCell>
              <TableCell>CPF</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Carregando...</TableCell>
              </TableRow>
            ) : citizens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Nenhum cidadão encontrado</TableCell>
              </TableRow>
            ) : (
              citizens.map((citizen) => (
                <TableRow key={citizen.id}>
                  <TableCell>{citizen.id}</TableCell>
                  <TableCell>{citizen.full_name}</TableCell>
                  <TableCell>{formatCPF(citizen.cpf)}</TableCell>
                  <TableCell>{citizen.email}</TableCell>
                  <TableCell>
                    <Link href={`/citizens/edit/${citizen.id}`} passHref>
                      <Button size="small">Editar</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}