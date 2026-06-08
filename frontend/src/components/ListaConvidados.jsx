import ItemConvidado from './ItemConvidado';

function ListaConvidados({ convidados, onAlternar, onDeletar }) {
    if (convidados.length === 0) {
        return <p>Nenhum convidado na lista ainda.</p>;
    }

    return (
        <ul>
            {convidados.map(c => (
                <ItemConvidado
                    key={c.id}
                    convidado={c}
                    onAlternar={onAlternar}
                    onDeletar={onDeletar}
                />
            ))}
        </ul>
    );
}

export default ListaConvidados;