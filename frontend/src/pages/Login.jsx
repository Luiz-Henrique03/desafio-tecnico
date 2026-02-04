import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false); // Controla a animação
  const navigate = useNavigate();

  // Ativa a animação assim que a tela carrega
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Limpa erro antigo
    try {
      const response = await axios.post('/auth/login', { login, password });
      localStorage.setItem('token', response.data.token);
      navigate('/clients');
    } catch (err) {
      setError('Acesso negado. Verifique suas credenciais.');
    }
  };

  return (
    <div style={styles.container}>
      {/* Injeção de CSS para animações e focus dos inputs */}
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
        `}
      </style>

      {/* Card de Login */}
      <div style={{
        ...styles.card,
        opacity: isVisible ? 1 : 0, // Começa invisível
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)', // Começa mais pra baixo
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' // A mágica da suavidade
      }}>
        
        {/* Cabeçalho do Card */}
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h2 style={{ color: '#333', margin: '0 0 10px 0', fontSize: '24px' }}>Bem-vindo</h2>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Insira suas credenciais para acessar</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Campo Login */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', textTransform: 'uppercase' }}>Usuário</label>
            <input 
              className="input-focus"
              type="text" 
              placeholder="Ex: admin" 
              value={login} 
              onChange={(e) => setLogin(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* Campo Senha */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', textTransform: 'uppercase' }}>Senha</label>
            <input 
              className="input-focus"
              type="password" 
              placeholder="••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* Botão Entrar */}
          <button 
            type="submit" 
            className="btn-hover"
            style={styles.button}
          >
            ENTRAR NO SISTEMA
          </button>

          {/* Mensagem de Erro */}
          {error && (
            <div style={styles.errorMessage}>
              ⚠️ {error}
            </div>
          )}
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#aaa' }}>
          &copy; 2026 Sistema de Gestão
        </div>
      </div>
    </div>
  );
}

// Estilos em Objeto (CSS-in-JS "raiz")
const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f0f2f5', // Um cinza bem clarinho elegante
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  card: {
    background: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)', // Sombra suave e moderna
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
    background: '#007bff', // Azul profissional
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 6px rgba(0,123,255,0.2)',
  },
  errorMessage: {
    color: '#d32f2f',
    background: '#ffebee',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '13px',
    textAlign: 'center',
    border: '1px solid #ffcdd2',
  }
};

export default Login;