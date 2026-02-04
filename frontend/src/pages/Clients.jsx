import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Clients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ id: null, name: '', cpf: '', cep: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // <--- NOVO: Estado de Carregamento
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await axios.get('/clients', authConfig);
      setClients(response.data);
    } catch (error) {
      navigate('/login');
    }
  };

  // --- NOVA FUNÇÃO DE VALIDAÇÃO MANUAL ---
  const validateForm = () => {
    // 1. Valida CPF
    // Remove qualquer coisa que não seja número para testar
    if (!/^\d+$/.test(form.cpf)) {
      setErrorMessage('O CPF deve conter apenas números (sem pontos ou traços).');
      return false;
    }
    if (form.cpf.length !== 11) {
      setErrorMessage(`CPF incompleto: Você digitou ${form.cpf.length} dígitos, mas são necessários 11.`);
      return false;
    }

    // 2. Valida CEP
    if (!/^\d+$/.test(form.cep)) {
      setErrorMessage('O CEP deve conter apenas números.');
      return false;
    }
    if (form.cep.length !== 8) {
      setErrorMessage('O CEP deve ter exatamente 8 dígitos.');
      return false;
    }

    return true; // Passou em tudo!
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Roda a validação antes de chamar o servidor
    if (!validateForm()) return;

    setIsLoading(true); // <--- ATIVA O LOADING

    try {
      if (form.id) {
        await axios.put(`/clients/${form.id}`, form, authConfig);
      } else {
        await axios.post('/clients', form, authConfig);
      }
      
      // Sucesso
      setForm({ id: null, name: '', cpf: '', cep: '' });
      loadClients();
    } catch (error) {
      // Tenta pegar a mensagem específica do Java (String), se for objeto genérico, usa fallback
      let msgBackend = error.response?.data;
      
      // Às vezes o Spring manda um JSON complexo de erro de validação (@Valid)
      if (typeof msgBackend === 'object') {
        msgBackend = "Erro de validação. Verifique se os dados estão no formato correto.";
      }
      
      setErrorMessage(msgBackend || 'Erro ao conectar com o servidor.');
    } finally {
      setIsLoading(false); // <--- DESATIVA O LOADING (Dando certo ou errado)
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
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#FFF' }}>Gestão de Clientes</h1>
        <button onClick={handleLogout} style={{ background: '#d9534f', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px' }}>Sair</button>
      </div>

      {/* FORMULÁRIO */}
      <div style={{ background: '#222', padding: '25px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #444' }}>
        <h3 style={{ marginTop: 0, color: '#FFF', marginBottom: '15px' }}>{form.id ? 'Editar Cliente' : 'Novo Cliente'}</h3>
        
        <form onSubmit={handleSave} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <input 
            placeholder="Nome Completo" 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
            required 
            disabled={isLoading} // Trava enquanto carrega
            style={{ padding: '12px', flex: 2, minWidth: '200px', borderRadius: '4px', border: '1px solid #555', background: '#333', color: '#FFF' }} 
          />
          <input 
            placeholder="CPF (apenas números)" 
            value={form.cpf} 
            onChange={e => setForm({...form, cpf: e.target.value})} 
            required 
            disabled={isLoading}
            maxLength={11}
            style={{ padding: '12px', flex: 1, minWidth: '120px', borderRadius: '4px', border: '1px solid #555', background: '#333', color: '#FFF' }}
          />
          <input 
            placeholder="CEP" 
            value={form.cep} 
            onChange={e => setForm({...form, cep: e.target.value})} 
            required 
            disabled={isLoading}
            maxLength={8}
            style={{ padding: '12px', width: '100px', borderRadius: '4px', border: '1px solid #555', background: '#333', color: '#FFF' }}
          />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit" 
              disabled={isLoading} // Desabilita o botão para evitar clique duplo
              style={{ 
                background: isLoading ? '#555' : '#28a745', // Fica cinza se estiver carregando
                color: 'white', 
                border: 'none', 
                padding: '12px 25px', 
                cursor: isLoading ? 'not-allowed' : 'pointer', 
                borderRadius: '4px', 
                fontWeight: 'bold',
                minWidth: '120px'
              }}>
              {isLoading ? '⏳ Processando...' : (form.id ? 'SALVAR' : 'CADASTRAR')}
            </button>
            
            {form.id && (
              <button type="button" disabled={isLoading} onClick={() => { setForm({ id: null, name: '', cpf: '', cep: '' }); setErrorMessage(''); }} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '12px', cursor: 'pointer', borderRadius: '4px' }}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* MENSAGEM DE ERRO VISUAL */}
        {errorMessage && (
          <div style={{ marginTop: '15px', color: '#ff6b6b', background: 'rgba(255,0,0,0.1)', padding: '10px', borderRadius: '4px', border: '1px solid #ff6b6b' }}>
            ⚠️ {errorMessage}
          </div>
        )}
      </div>

      {/* LISTA DE CLIENTES */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {clients.map(client => (
          <li key={client.id} style={{ 
              background: 'white', 
              padding: '20px', 
              marginBottom: '15px', 
              borderRadius: '8px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              color: '#000',
              opacity: isLoading ? 0.5 : 1 // Dá um efeito visual na lista quando está carregando
          }}>
            <div>
              <strong style={{ fontSize: '1.2em', color: '#000' }}>{client.name}</strong> 
              <span style={{ color: '#555', marginLeft: '10px', fontSize: '0.9em' }}>(CPF: {client.cpf})</span>
              <div style={{ color: '#444', marginTop: '8px' }}>
                 📍 {client.logradouro}, {client.bairro} - {client.cidade}/{client.uf}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button disabled={isLoading} onClick={() => handleEdit(client)} style={{ background: '#ffc107', color: '#000', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>✏️ Editar</button>
              <button disabled={isLoading} onClick={() => handleDelete(client.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>🗑️ Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Clients;