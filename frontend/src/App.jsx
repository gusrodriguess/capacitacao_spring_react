import { useState, useEffect } from 'react';
import Formulario from './components/Formulario';
import ListaConvidados from './components/ListaConvidados';
import './App.css';

function App() {
  const [convidados, setConvidados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // GET - Buscar dados
  useEffect(() => {
    fetch("http://localhost:8080/convidados")
      .then(res => res.json())
      .then(dados => {
        setConvidados(dados);
        setCarregando(false);
      });
  }, []);

  // POST - Cadastrar
  const cadastrarConvidado = async (nomeDigitado) => {
    const res = await fetch("http://localhost:8080/convidados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nomeDigitado, confirmado: false })
    });
    const novo = await res.json();
    setConvidados([...convidados, novo]);
  };

  // PUT - Alternar Status
  const alternarConfirmacao = async (convidado) => {
    const res = await fetch(`http://localhost:8080/convidados/${convidado.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...convidado, confirmado: !convidado.confirmado })
    });
    const atualizado = await res.json();
    setConvidados(convidados.map(c => c.id === convidado.id ? atualizado : c));
  };

  // DELETE - Remover
  const deletarConvidado = async (id) => {
    if (!confirm("Deseja remover?")) return;
    await fetch(`http://localhost:8080/convidados/${id}`, { method: "DELETE" });
    setConvidados(convidados.filter(c => c.id !== id));
  };

  // Métricas derivadas do estado (Cálculos dinâmicos)
  const total = convidados.length;
  const confirmados = convidados.filter(c => c.confirmado).length;

  // if (carregando) return <div className="container"><p>Carregando...</p></div>;

  return (
    <div className="container">
      <h1>Lista de Convidados</h1>

      {/* Elemento de Métricas */}
      <div className="dashboard-cards">
        <div className="card">Total: <strong>{total}</strong></div>
        <div className="card">Confirmados: <strong>{confirmados}</strong></div>
        <div className="card">Pendentes: <strong>{total - confirmados}</strong></div>
      </div>

      {/* Componente de Formuário */}
      <Formulario onCadastrar={cadastrarConvidado} />

      {/* Componente de Lista */}
      <ListaConvidados
        convidados={convidados}
        onAlternar={alternarConfirmacao}
        onDeletar={deletarConvidado}
      />
    </div>
  );
}

export default App;