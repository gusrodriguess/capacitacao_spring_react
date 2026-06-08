import { useState } from 'react';

function Formulario({ onCadastrar }) {
    const [valorInput, setValorInput] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault(); // Evita que a página recarregue ao submeter o formulário
        if (!valorInput.trim()) return;

        onCadastrar(valorInput); // Dispara a função do componente pai
        setValorInput(""); // Limpa o campo
    };

    return (
        <form onSubmit={handleSubmit} className="input-box">
            <input
                value={valorInput}
                onChange={(e) => setValorInput(e.target.value)}
                placeholder="Nome do convidado..."
            />
            <button type="submit">Adicionar</button>
        </form>
    );
}

export default Formulario;