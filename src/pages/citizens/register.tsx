import { Container, Typography } from '@mui/material';
import CitizenForm from '@/components/CitizenForm';

export default function CitizenRegisterPage() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cadastro de Cidadão
      </Typography>
      <CitizenForm />
    </Container>
  );
}