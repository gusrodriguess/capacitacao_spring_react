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

## 🟢 PARTE 1: Backend (Spring Boot)
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
        public Convidado salvar(@RequestBody Convidado c) {
            return service.salvar(c);
        }
    }
    ```

> **✅ Teste de Sucesso:** Execute o projeto Java e abra o navegador em `http://localhost:8080/api/convidados`. Se aparecer `[]`, o backend está pronto!

---

## 🔵 PARTE 2: Frontend (React)
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

