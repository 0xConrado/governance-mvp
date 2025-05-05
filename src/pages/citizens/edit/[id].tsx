import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CitizenForm from '@/components/CitizenForm';
import { Container, Typography } from '@mui/material';

export default function EditCitizenPage() {
  const router = useRouter();
  const { id } = router.query;
  const [citizen, setCitizen] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/citizens/${id}`)
        .then(res => res.json())
        .then(data => setCitizen(data));
    }
  }, [id]);

  if (!citizen) return <div>Carregando...</div>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Editar Cidadão
      </Typography>
      <CitizenForm initialData={citizen} isEdit />
    </Container>
  );
}