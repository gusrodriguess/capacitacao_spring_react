# Capacitação Full-Stack 🚀
**Projeto:** Gerenciador de Convidados (Spring Boot + React)

---

## 🏗️ 1. Preparação de Ambiente
Antes de começarmos, garanta que sua máquina está pronta:

1.  **Copie a pasta do projeto** para a sua **Área de Trabalho**.
2.  **Abra o VS Code**.
3.  Vá em `File > Open Folder` e selecione a pasta do **Backend**.
4.  Abra um segundo VS Code (ou uma nova janela `Ctrl+Shift+N`) e selecione a pasta do **Frontend**.

---

## Backend (Spring Boot)
Nosso objetivo é criar uma API robusta que gerencia os dados dos convidados usando uma arquitetura em camadas.

### 🚀 Fluxo de Desenvolvimento e Camadas:

1.  **Entidade (`Convidado.java`):** Define a estrutura da tabela no banco de dados.
    ```java
    @Entity
    @Data
    public class Convidado {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        @NotBlank(message = "O nome do convidado é obrigatório")
        private String nome;
        private boolean confirmado;
    }
    ```

2.  **Repository (`ConvidadoRepository.java`):** Interface que herda o `JpaRepository`. Ela contém os métodos de Banco de Dados (Salvar, Listar, Deletar) prontos para uso.
    ```java
    @Repository
    public interface ConvidadoRepository extends JpaRepository<Convidado, Long> { }
    ```

3.  **Service (`ConvidadoService.java`):** Camada intermediária onde aplicamos as regras de negócio antes de salvar ou listar dados.
    ```java
    @Service
    public class ConvidadoService {
        @Autowired
        private ConvidadoRepository repository;

        public List<Convidado> listarTodos() {
            return repository.findAll();
        }
    
        public Convidado salvar(Convidado c) {
            return repository.save(c);
        }
    }
    ```

4.  **Controller (`ConvidadoController.java`):** Porta de entrada da API. Define as rotas que o Frontend irá chamar.
    ```java
    @RestController
    @RequestMapping("/api/convidados")
    @CrossOrigin(origins = "http://localhost:5173") 
    public class ConvidadoController {
        @Autowired
        private ConvidadoService service;

        @GetMapping
        public List<Convidado> listar() {
            return service.listarTodos();
        }

        @PostMapping
        public Convidado salvar(@Valid @RequestBody Convidado c) {
            return service.salvar(c);
        }
    }
    ```

> **✅ Teste de Sucesso:** Execute o projeto Java e abra o navegador em `http://localhost:8080/api/convidados`. Se aparecer `[]`, o backend está pronto!


5. ** Outras Informações Revelantes: **
#### Mapeamento de Banco de Dados (JPA / Hibernate)

`@Entity`
- Diz ao Spring/Hibernate: "Esta classe representa uma tabela no banco de dados". Cada objeto criado a partir dela será uma linha nessa tabela.

`@Id e @GeneratedValue`
Trabalham sempre juntas no atributo que será a Chave Primária da tabela.
- `@Id`: Identifica o campo como o ID único da entidade.
- `@GeneratedValue(strategy = GenerationType.IDENTITY)`: Diz para o banco de dados gerar esse ID automaticamente (1, 2, 3...).

`@Column`
- Usada quando você quer customizar uma coluna da tabela. Por exemplo, mudar o nome da coluna no banco ou dizer que ela não pode ser vazia: @Column(name = "nome_completo", nullable = false).

#### Relacionamentos entre Tabelas
Raramente um sistema tem apenas uma tabela. Para ligar uma tabela à outra, usamos:

`@OneToMany / @ManyToOne`: 
- O relacionamento mais comum (Um-para-Muitos / Muitos-para-Um). Ex: Um Convidado pertence a um Evento (ManyToOne), e um Evento tem vários Convidados (OneToMany).

`@ManyToMany`: 
- Muitos-para-Muitos. Ex: Alunos e Disciplinas (um aluno faz várias disciplinas, e uma disciplina tem vários alunos).

#### Validação de Dados (Bean Validation)

`@NotBlank`: 
- Garante que o texto não foi enviado vazio ou apenas com espaços.
`@Size(min = 2, max = 50)`:
Define um limite mínimo e máximo de caracteres.
`@Email`:
- Valida se o formato do texto é de um e-mail válido.
`@Positive`:
- Garante que o número enviado é maior que zero (ótimo para preços ou idades).

```java
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity // Diz que vira tabela no banco
@Table(name = "tb_convidados") // Define o nome da tabela
public class Convidado {

    @Id // Chave primária
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremento
    private Long id;

    @NotBlank(message = "O nome não pode ser vazio") // Validação
    @Size(min = 3, message = "O nome deve ter pelo menos 3 caracteres")
    @Column(name = "nome_completo", nullable = false) // Customização do banco
    private String nome;

    private boolean confirmado;

    // Construtores, Getters e Setters...
}
```

⚠️ Nota: Para que essas validações funcionem, você precisa colocar a anotação @Valid antes do @RequestBody lá no seu Controller.
---




## Frontend (React)
Agora vamos criar a interface visual e conectá-la à nossa API.

### 🚀 Comandos Iniciais:
Abra o terminal na pasta do **Frontend** e execute:
```bash
npm install
npm run dev
```

### 📝 Implementação da Lógica (App.jsx)
```javascript
    function App() {
      const [convidados, setConvidados] = useState([]);
      const [valorInput, setValorInput] = useState("");
    
      // 1. Buscar dados (GET) ao carregar a página
      useEffect(() => {
        fetch("http://localhost:8080/api/convidados")
          .then(res => res.json())
          .then(dados => setConvidados(dados));
      }, []);
    
      // 2. Enviar dados (POST) para o Java
      const cadastrar = async () => {
        const res = await fetch("http://localhost:8080/api/convidados", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome: valorInput, confirmado: false })
        });
        const novo = await res.json();
        setConvidados([...convidados, novo]); // Atualiza a lista na tela
        setValorInput(""); // Limpa o input
      };
    
      return (
        <div className="container">
          <h1>Lista de Convidados</h1>
          <input 
            value={valorInput} 
            onChange={(e) => setValorInput(e.target.value)} 
            placeholder="Nome do convidado..." 
          />
          <button onClick={cadastrar}>Adicionar</button>
    
          <ul>
            {convidados.map(c => (
              <li key={c.id}>{c.nome} - {c.confirmado ? "✅" : "⏳"}</li>
            ))}
          </ul>
        </div>
      );
    }
    
    export default App;
```

### Implementando mais elementos do React (Componentes)
##### src/components/Formulario.jsx
```javascript
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
```

##### src/components/ItemConvidado.jsx
```javascript
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
```

##### src/components/ListaConvidados.jsx
```javascript
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
```

##### O novo App.jsx
```javascript
    import { useState, useEffect } from 'react';
    import Formulario from './components/Formulario';
    import ListaConvidados from './components/ListaConvidados';
    import './App.css';
    
    function App() {
      const [convidados, setConvidados] = useState([]);
      const [carregando, setCarregando] = useState(true);
    
      // GET - Buscar dados
      useEffect(() => {
        fetch("http://localhost:8080/api/convidados")
          .then(res => res.json())
          .then(dados => {
            setConvidados(dados);
            setCarregando(false);
          });
      }, []);
    
      // POST - Cadastrar
      const cadastrarConvidado = async (nomeDigitado) => {
        const res = await fetch("http://localhost:8080/api/convidados", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome: nomeDigitado, confirmado: false })
        });
        const novo = await res.json();
        setConvidados([...convidados, novo]);
      };
    
      // PUT - Alternar Status
      const alternarConfirmacao = async (convidado) => {
        const res = await fetch(`http://localhost:8080/api/convidados/${convidado.id}`, {
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
        await fetch(`http://localhost:8080/api/convidados/${id}`, { method: "DELETE" });
        setConvidados(convidados.filter(c => c.id !== id));
      };
    
      // Métricas derivadas do estado (Cálculos dinâmicos)
      const total = convidados.length;
      const confirmados = convidados.filter(c => c.confirmado).length;
    
      if (carregando) return <div className="container"><p>Carregando...</p></div>;
    
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
```

## ⚙️ 3. Configurações Essenciais (application.properties)

O arquivo `application.properties` (localizado em `src/main/resources/`) é o centro de controle do Spring Boot. É nele que configuramos como a aplicação se comporta, qual banco de dados usar e a porta do servidor, tudo sem alterar o código Java.

Substitua o conteúdo do seu arquivo `application.properties` por este:

```properties
# -------------------------------------------------------------------
# CONFIGURAÇÕES DO SERVIDOR
# -------------------------------------------------------------------
server.port=8080

# -------------------------------------------------------------------
# CONFIGURAÇÕES DO BANCO DE DADOS (H2 em Memória)
# -------------------------------------------------------------------
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# Habilita o painel do H2 no navegador (http://localhost:8080/h2-console)
spring.h2.console.enabled=true
spring.h2.console.settings.web-allow-others=true

# -------------------------------------------------------------------
# CONFIGURAÇÕES DO JPA / HIBERNATE
# -------------------------------------------------------------------
# Cria e atualiza as tabelas automaticamente com base na classe Java
spring.jpa.hibernate.ddl-auto=update

# Mostra no console do terminal os comandos SQL sendo executados
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```


-----

### 🛠️ Resolução de Problemas (FAQ)
- **"Meu código não compila (Java)"**: Verifique se esqueceu algum ; e se as anotações (@Entity, @Service, etc) foram importadas corretamente.
- **"Erro de CORS"**: No Java, o @CrossOrigin deve apontar exatamente para a porta do React (5173).
- **"Lista não carrega":** Verifique no Console do Navegador (F12) se a requisição para 8080 está retornando erro.
- **"Comando npm não encontrado"**: Verifique se o Node.js está instalado corretamente na máquina do laboratório.

-----

### 💡 Links e Informações Úteis
- **Banco de Dados H2**: http://localhost:8080/h2-console
  - **JDBC URL**: jdbc:h2:mem:testdb | User: sa | Password: (em branco)
- **Documentação Spring**: docs.spring.io
- **Documentação React**: react.dev

