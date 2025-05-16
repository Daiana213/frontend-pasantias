import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_URL } from '../../config';

export default function VerificarEmail() {
  const [status, setStatus] = useState('verificando');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/verificar-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        });

        if (response.ok) {
          setStatus('verificado');
          setTimeout(() => {
            navigate('/login-estudiante');
          }, 3000);
        } else {
          setStatus('error');
        }
      } catch (error) {
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
      <h2>Verificación de Email</h2>
      {status === 'verificando' && <p>Verificando tu dirección de email...</p>}
      {status === 'verificado' && (
        <div>
          <p>¡Email verificado exitosamente!</p>
          <p>Serás redirigido al inicio de sesión en unos segundos...</p>
        </div>
      )}
      {status === 'error' && (
        <div>
          <p>Hubo un error al verificar tu email.</p>
          <p>Por favor, intenta nuevamente o contacta con soporte.</p>
        </div>
      )}
    </div>
  );
}