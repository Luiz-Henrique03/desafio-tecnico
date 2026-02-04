import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Clients from './pages/Clients'; // <--- IMPORTANTE: Importar a nova página

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Adicionando a rota de Clientes */}
        <Route path="/clients" element={<Clients />} />
        
        {/* Redireciona qualquer outra rota para o login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;