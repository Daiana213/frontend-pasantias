import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_URL } from '../../config';

export default function VerificarEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verificando');
  const navigate = useNavigate();

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/verificar-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        });

        if (response.ok) {
          setStatus('verificado');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Error:', error);
        setStatus('error');
      }
    };

    if (token) {
      verificarToken();
    } else {
      setStatus('error');
    }
  }, [token, navigate]);

  return (
    <div className="verificar-email-container">
      {status === 'verificando' && <p>Verificando tu email...</p>}
      {status === 'verificado' && (
        <div>
          <h2>¡Email verificado!</h2>
          <p>Tu cuenta ha sido verificada exitosamente. Serás redirigido al login...</p>
        </div>
      )}
      {status === 'error' && (
        <div>
          <h2>Error de verificación</h2>
          <p>No se pudo verificar tu email. Por favor, intenta nuevamente o contacta al administrador.</p>
        </div>
      )}
    </div>
  );
}