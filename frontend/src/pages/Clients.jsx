import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Clients() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]); 
  const [searchId, setSearchId] = useState(''); 
  const [form, setForm] = useState({ id: null, name: '', cpf: '', cep: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    loadClients();
    setAnimate(true);
  }, []);

  useEffect(() => {
    if (searchId.trim() === '') {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client => 
        client.id.toString().includes(searchId)
      );
      setFilteredClients(filtered);
    }
  }, [searchId, clients]);

  const loadClients = async () => {
    try {
      const response = await axios.get('/clients', authConfig);
      setClients(response.data);
      setFilteredClients(response.data); 
    } catch (error) {
      navigate('/login');
    }
  };

  const validateForm = () => {
    if (!/^\d+$/.test(form.cpf)) {
      setErrorMessage('O CPF deve conter apenas números.');
      return false;
    }
    if (form.cpf.length !== 11) {
      setErrorMessage(`CPF incompleto: faltam ${11 - form.cpf.length} dígitos.`);
      return false;
    }
    if (!/^\d+$/.test(form.cep)) {
      setErrorMessage('O CEP deve conter apenas números.');
      return false;
    }
    if (form.cep.length !== 8) {
      setErrorMessage('O CEP deve ter 8 dígitos.');
      return false;
    }
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (form.id) {
        await axios.put(`/clients/${form.id}`, form, authConfig);
      } else {
        await axios.post('/clients', form, authConfig);
      }
      setForm({ id: null, name: '', cpf: '', cep: '' });
      loadClients();
    } catch (error) {
      let msgBackend = error.response?.data;
      if (typeof msgBackend === 'object') msgBackend = "Erro de validação nos dados.";
      setErrorMessage(msgBackend || 'Erro ao conectar com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      setIsLoading(true);
      try {
        await axios.delete(`/clients/${id}`, authConfig);
        if (form.id === id) setForm({ id: null, name: '', cpf: '', cep: '' });
        loadClients();
      } catch (error) {
        alert('Erro ao excluir.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (client) => {
    setErrorMessage('');
    setForm({ 
      id: client.id, 
      name: client.name, 
      cpf: client.cpf, 
      cep: client.cep || '' 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    try {

      const refreshToken = localStorage.getItem('refreshToken'); 
      if (refreshToken) {
         await axios.post('/auth/logout', { token: refreshToken }, authConfig);
      }
    } catch (error) {
      console.error("Erro ao fazer logout no servidor", error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <style>
        {`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .card-hover:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
          }
          .input-modern:focus {
            border-color: #007bff;
            box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
            outline: none;
          }
          
          .icon-btn {
            background: transparent;
            border: none;
            font-size: 20px;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: all 0.2s ease;
            display: flex;
            alignItems: center;
            justifyContent: center;
          }
          .icon-btn:hover {
             background-color: rgba(0,0,0,0.05);
             transform: scale(1.1);
          }
          .edit-btn { color: #ffc107; }
          .edit-btn:hover { color: #e0a800; }
          
          .delete-btn { color: #dc3545; } 
          .delete-btn:hover { color: #c82333; }
        `}
      </style>

      <div style={{ width: '100%' }}>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '30px',
          opacity: animate ? 1 : 0,
          transition: 'opacity 0.5s ease-in'
        }}>
          <div>
            <h1 style={{ color: '#333', margin: 0, fontSize: '28px' }}>Gestão de Clientes</h1>
            <p style={{ color: '#666', margin: '5px 0 0 0' }}>Gerencie sua base de contatos</p>
          </div>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Sair
          </button>
        </div>

        {/* CARD DO FORMULÁRIO */}
        <div style={{ 
          ...styles.card, 
          borderLeft: '5px solid #007bff',
          animation: 'slideDown 0.6s ease-out forwards'
        }}>
          <h3 style={{ marginTop: 0, color: '#444', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {form.id ? '✏️ Editando Cliente' : '✨ Novo Cadastro'}
          </h3>
          
          <form onSubmit={handleSave} style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 2, minWidth: '300px' }}>
              <label style={styles.label}>Nome Completo</label>
              <input 
                className="input-modern"
                placeholder="Ex: João da Silva" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                required 
                disabled={isLoading} 
                style={styles.input} 
              />
            </div>

            <div style={{ flex: 1, minWidth: '180px' }}>
              <label style={styles.label}>CPF (só números)</label>
              <input 
                className="input-modern"
                placeholder="000.000.000-00" 
                value={form.cpf} 
                onChange={e => setForm({...form, cpf: e.target.value})} 
                required 
                disabled={isLoading}
                maxLength={11}
                style={styles.input}
              />
            </div>

            <div style={{ width: '140px' }}>
              <label style={styles.label}>CEP</label>
              <input 
                className="input-modern"
                placeholder="00000-000" 
                value={form.cep} 
                onChange={e => setForm({...form, cep: e.target.value})} 
                required 
                disabled={isLoading}
                maxLength={8}
                style={styles.input}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', paddingBottom: '1px' }}>
              <button 
                type="submit" 
                disabled={isLoading} 
                style={{ 
                  ...styles.primaryButton, 
                  background: isLoading ? '#ccc' : (form.id ? '#ffc107' : '#28a745'),
                  color: form.id ? '#000' : '#fff'
                }}>
                {isLoading ? 'Salvando...' : (form.id ? 'Salvar' : 'Cadastrar')}
              </button>
              
              {form.id && (
                <button type="button" disabled={isLoading} onClick={() => { setForm({ id: null, name: '', cpf: '', cep: '' }); setErrorMessage(''); }} style={styles.secondaryButton}>
                  Cancelar
                </button>
              )}
            </div>
          </form>

          {errorMessage && (
            <div style={styles.errorBox}>
              ⚠️ {errorMessage}
            </div>
          )}
        </div>

        {/* ÁREA DE BUSCA E LISTAGEM */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '40px', marginBottom: '20px' }}>
          <h3 style={{ color: '#555', margin: 0, paddingLeft: '5px', fontSize: '22px' }}>
            Clientes ({filteredClients.length})
          </h3>
          
          {/* CAMPO DE BUSCA NOVO */}
          <div style={{ position: 'relative', width: '250px' }}>
            <span style={{ position: 'absolute', left: '10px', top: '12px', fontSize: '18px' }}>🔍</span>
            <input 
              className="input-modern"
              placeholder="Buscar por ID..." 
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              style={{ ...styles.input, paddingLeft: '35px', height: '45px' }}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredClients.length === 0 && (
            <div style={{ textAlign: 'center', padding: '50px', color: '#999', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <h3>Nenhum cliente encontrado.</h3>
              <p>{searchId ? `Nenhum registro com ID contendo "${searchId}"` : 'Utilize o formulário acima para cadastrar.'}</p>
            </div>
          )}

          {filteredClients.map((client, index) => (
            <div 
              key={client.id} 
              className="card-hover"
              style={{ 
                ...styles.clientCard,
                animation: `fadeUp 0.5s ease-out forwards ${index * 0.1}s`,
                opacity: 0 
              }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={styles.avatar}>
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <strong style={{ fontSize: '18px', color: '#333' }}>{client.name}</strong>
                    <span style={{ fontSize: '12px', background: '#e3f2fd', color: '#0d47a1', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                      ID: {client.id}
                    </span>
                  </div>
                  <span style={{ color: '#888', fontSize: '14px', background: '#f0f0f0', padding: '2px 8px', borderRadius: '4px', marginTop: '4px', display: 'inline-block' }}>
                    CPF: {client.cpf}
                  </span>
                  <div style={{ color: '#555', marginTop: '8px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                     📍 {client.logradouro}, {client.bairro} - {client.cidade}/{client.uf}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '5px' }}>
                <button disabled={isLoading} onClick={() => handleEdit(client)} className="icon-btn edit-btn" title="Editar">
                  ✏️
                </button>
                <button disabled={isLoading} onClick={() => handleDelete(client.id)} className="icon-btn delete-btn" title="Excluir">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    width: '100%', 
    background: '#f0f2f5', 
    padding: '40px 5%', 
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    display: 'flex',
    justifyContent: 'center',
    boxSizing: 'border-box', 
    position: 'absolute', 
    top: 0,
    left: 0,
    right: 0
  },
  card: {
    background: '#ffffff',
    padding: '35px', 
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)', 
    marginBottom: '40px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#555',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '14px', 
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    fontSize: '16px',
    color: '#333',
    background: '#f9f9f9',
    transition: 'all 0.3s',
  },
  primaryButton: {
    padding: '14px 30px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'filter 0.2s',
    height: '50px', 
  },
  secondaryButton: {
    padding: '14px 25px',
    border: '1px solid #ccc',
    background: 'transparent',
    color: '#666',
    borderRadius: '8px',
    cursor: 'pointer',
    height: '50px',
    fontWeight: 'bold',
  },
  logoutButton: {
    background: '#ffebec',
    color: '#d63031',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '30px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 5px rgba(214, 48, 49, 0.2)',
  },
  clientCard: {
    background: '#ffffff',
    padding: '25px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    border: '1px solid #f0f0f0',
    transition: 'all 0.3s ease',
  },
  avatar: {
    width: '55px',
    height: '55px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)', 
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '22px',
    boxShadow: '0 4px 10px rgba(0, 13, 255, 0.2)',
  },
  errorBox: {
    marginTop: '20px',
    background: '#ffebee',
    color: '#c62828',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '15px',
    borderLeft: '5px solid #c62828',
    display: 'flex',
    alignItems: 'center',
    fontWeight: '500',
  }
};

export default Clients;