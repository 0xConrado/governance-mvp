import Link from 'next/link';
import { Button, Container } from '@mui/material';

export default function Home() {
  return (
    <Container style={{ textAlign: 'center', padding: '4rem' }}>
      <h1>Sistema de Gestão Governamental</h1>
      <Link href="/processes" passHref>
        <Button variant="contained" color="primary">
          Acessar Processos
        </Button>
      </Link>
    </Container>
  );
}