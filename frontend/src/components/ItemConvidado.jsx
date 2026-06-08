function ItemConvidado({ convidado, onAlternar, onDeletar }) {
    return (
        <li className="convidado-item">
            <span
                onClick={() => onAlternar(convidado)}
                style={{ cursor: 'pointer' }}
                className={convidado.confirmado ? "confirmado" : "pendente"}
            >
                {convidado.nome} - {convidado.confirmado ? "✅ Confirmado" : "⏳ Pendente"}
            </span>
            <button className="btn-deletar" onClick={() => onDeletar(convidado.id)}>❌</button>
        </li>
    );
}

export default ItemConvidado;