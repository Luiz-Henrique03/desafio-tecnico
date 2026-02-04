import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Clients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ id: null, name: '', cpf: '', cep: '' });
  const [errorMessage, setErrorMessage] = useState(''); // Estado para guardar o erro
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

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Limpa erro anterior

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
      // Pega a mensagem exata que o Backend mandou (ex: "CEP inválido")
      const msg = error.response?.data || 'Erro ao conectar com o servidor.';
      setErrorMessage(msg);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      try {
        await axios.delete(`/clients/${id}`, authConfig);
        if (form.id === id) setForm({ id: null, name: '', cpf: '', cep: '' });
        loadClients();
      } catch (error) {
        alert('Erro ao excluir.');
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

      {/* CARD DO FORMULÁRIO */}
      <div style={{ background: '#2c2c2c', padding: '25px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #444' }}>
        <h3 style={{ marginTop: 0, color: '#FFF', marginBottom: '15px' }}>{form.id ? 'Editar Cliente' : 'Novo Cliente'}</h3>
        
        <form onSubmit={handleSave} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Inputs com fundo BRANCO e letra PRETA para garantir leitura */}
          <input 
            placeholder="Nome Completo" 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
            required 
            style={{ padding: '12px', flex: 2, minWidth: '200px', borderRadius: '4px', border: 'none', background: '#FFF', color: '#000' }} 
          />
          <input 
            placeholder="CPF (apenas números)" 
            value={form.cpf} 
            onChange={e => setForm({...form, cpf: e.target.value})} 
            required 
            maxLength={11}
            style={{ padding: '12px', flex: 1, minWidth: '120px', borderRadius: '4px', border: 'none', background: '#FFF', color: '#000' }}
          />
          <input 
            placeholder="CEP" 
            value={form.cep} 
            onChange={e => setForm({...form, cep: e.target.value})} 
            required 
            maxLength={8}
            style={{ padding: '12px', width: '100px', borderRadius: '4px', border: 'none', background: '#FFF', color: '#000' }}
          />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '12px 25px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
              {form.id ? 'SALVAR' : 'CADASTRAR'}
            </button>
            {form.id && (
              <button type="button" onClick={() => { setForm({ id: null, name: '', cpf: '', cep: '' }); setErrorMessage(''); }} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '12px', cursor: 'pointer', borderRadius: '4px' }}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* ÁREA DE MENSAGEM DE ERRO (Inline) */}
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
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}>
            <div>
              <strong style={{ fontSize: '1.2em', color: '#000' }}>{client.name}</strong> 
              <span style={{ color: '#555', marginLeft: '10px', fontSize: '0.9em' }}>(CPF: {client.cpf})</span>
              <div style={{ color: '#444', marginTop: '8px' }}>
                 📍 {client.logradouro}, {client.bairro} - {client.cidade}/{client.uf}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleEdit(client)} style={{ background: '#ffc107', color: '#000', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>✏️ Editar</button>
              <button onClick={() => handleDelete(client.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>🗑️ Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Clients;