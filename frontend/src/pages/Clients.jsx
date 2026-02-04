import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Clients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ id: null, name: '', cpf: '', cep: '' });
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
      alert('Sessão expirada.');
      navigate('/login');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        // ATUALIZAR (PUT)
        await axios.put(`/clients/${form.id}`, form, authConfig);
        alert('Cliente atualizado!');
      } else {
        // CRIAR (POST)
        await axios.post('/clients', form, authConfig);
        alert('Cliente cadastrado!');
      }
      setForm({ id: null, name: '', cpf: '', cep: '' }); // Limpa form
      loadClients();
    } catch (error) {
      alert('Erro ao salvar. Verifique os dados.');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await axios.delete(`/clients/${id}`, authConfig);
        loadClients();
      } catch (error) {
        alert('Erro ao excluir.');
      }
    }
  };

  const handleEdit = (client) => {
    // Preenche o formulário com os dados do cliente para edição
    setForm({ 
      id: client.id, 
      name: client.name, 
      cpf: client.cpf, 
      cep: client.address?.cep || '' // Garante que não quebre se não tiver CEP
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Gestão de Clientes</h1>
        <button onClick={handleLogout} style={{ background: '#d9534f', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px' }}>Sair</button>
      </div>

      {/* FORMULÁRIO */}
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h3 style={{ marginTop: 0 }}>{form.id ? 'Editar Cliente' : 'Novo Cliente'}</h3>
        <form onSubmit={handleSave} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input 
            placeholder="Nome Completo" 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
            required 
            style={{ padding: '10px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input 
            placeholder="CPF" 
            value={form.cpf} 
            onChange={e => setForm({...form, cpf: e.target.value})} 
            required 
            maxLength={11}
            style={{ padding: '10px', width: '120px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input 
            placeholder="CEP" 
            value={form.cep} 
            onChange={e => setForm({...form, cep: e.target.value})} 
            required 
            maxLength={8}
            style={{ padding: '10px', width: '100px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
            {form.id ? 'SALVAR ALTERAÇÃO' : 'CADASTRAR'}
          </button>
          {form.id && (
            <button type="button" onClick={() => setForm({ id: null, name: '', cpf: '', cep: '' })} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '4px' }}>
              Cancelar
            </button>
          )}
        </form>
      </div>

      {/* LISTA */}
      <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Lista de Clientes ({clients.length})</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {clients.map(client => (
          <li key={client.id} style={{ background: 'white', border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '1.1em' }}>{client.name}</strong> <span style={{ color: '#666' }}>(CPF: {client.cpf})</span>
              <div style={{ fontSize: '0.9em', color: '#555', marginTop: '5px' }}>
                 📍 {client.logradouro}, {client.bairro} - {client.cidade}/{client.uf}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleEdit(client)} style={{ background: '#ffc107', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '3px' }}>✏️ Editar</button>
              <button onClick={() => handleDelete(client.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '3px' }}>🗑️ Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Clients;