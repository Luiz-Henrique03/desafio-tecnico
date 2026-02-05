import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isVisible, setIsVisible] = useState(false); 
  const [isRegisterMode, setIsRegisterMode] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isRegisterMode) {
        await axios.post('/auth/register', { login, password });
        setSuccess('Conta criada com sucesso! Faça login agora.');
        setIsRegisterMode(false); 
        setPassword('');
       
      } else {
        const response = await axios.post('/auth/login', { login, password });
        localStorage.setItem('token', response.data.token);
        navigate('/clientes');
      }
    } catch (err) {
      if (isRegisterMode) {
        setError('Erro ao criar conta. Usuário já existe?');
      } else {
        setError('Acesso negado. Verifique suas credenciais.');
      }
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError('');
    setSuccess('');
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .input-focus:focus {
            border-color: #007bff !important;
            box-shadow: 0 0 0 3px rgba(0,123,255,0.1) !important;
            outline: none;
          }
          .btn-hover:hover {
            background-color: #0056b3 !important;
            transform: translateY(-1px);
          }
          .btn-hover:active {
            transform: translateY(1px);
          }
          .link-toggle:hover {
            text-decoration: underline;
          }
        `}
      </style>

      <div style={{
        ...styles.card,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
      }}>
        
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h2 style={{ color: '#333', margin: '0 0 10px 0', fontSize: '24px' }}>
            {isRegisterMode ? 'Nova Conta' : 'Bem-vindo'}
          </h2>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
            {isRegisterMode ? 'Preencha os dados para se registrar' : 'Insira suas credenciais para acessar'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', textTransform: 'uppercase' }}>Usuário</label>
            <input 
              className="input-focus"
              type="text" 
              placeholder="Ex: admin" 
              value={login} 
              onChange={(e) => setLogin(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', textTransform: 'uppercase' }}>Senha</label>
            <input 
              className="input-focus"
              type="password" 
              placeholder="••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-hover"
            style={{
              ...styles.button,
              background: isRegisterMode ? '#28a745' : '#007bff' // Verde para cadastro, Azul para login
            }}
          >
            {isRegisterMode ? 'CADASTRAR' : 'ENTRAR NO SISTEMA'}
          </button>

          {/* Mensagens de Erro e Sucesso */}
          {error && <div style={styles.errorMessage}>⚠️ {error}</div>}
          {success && <div style={styles.successMessage}>✅ {success}</div>}
        </form>

        <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
          {isRegisterMode ? 'Já tem uma conta? ' : 'Não tem conta? '}
          <span 
            onClick={toggleMode} 
            className="link-toggle"
            style={{ color: '#007bff', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {isRegisterMode ? 'Fazer Login' : 'Cadastre-se'}
          </span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f0f2f5', 
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  card: {
    background: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)', 
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '12px 15px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '15px',
    color: '#333',
    background: '#fafafa',
    transition: 'all 0.3s ease',
  },
  button: {
    padding: '14px',
    marginTop: '10px',
    borderRadius: '6px',
    border: 'none',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  errorMessage: {
    color: '#d32f2f',
    background: '#ffebee',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '13px',
    textAlign: 'center',
    border: '1px solid #ffcdd2',
  },
  successMessage: {
    color: '#155724',
    background: '#d4edda',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '13px',
    textAlign: 'center',
    border: '1px solid #c3e6cb',
  }
};

export default Login;