# ImmunoTrack: Carteira de Vacinação Digital

Este projeto implementa uma **Carteira de Vacinação Digital** com um frontend em HTML/CSS/JavaScript e um backend em **Python** utilizando o framework **Flask** e um banco de dados **SQLite** para gerenciamento de usuários e dados.

## Estrutura do Projeto

O projeto está organizado da seguinte forma:

```
project_vacina/
├── backend/
│   ├── app.py          # Aplicação principal Flask (rotas, lógica de negócio)
│   ├── database.py     # Módulo para gerenciamento do banco de dados SQLite
│   └── database.db     # Banco de dados SQLite (criado na primeira execução)
├── frontend/
│   ├── static/
│   │   ├── css/        # Arquivos CSS (estilos)
│   │   └── js/         # Arquivos JavaScript (lógica de frontend)
│   └── templates/      # Arquivos HTML (páginas da aplicação)
└── README.md           # Este arquivo
```

## Funcionalidades Principais

1.  **Autenticação de Usuário:**
    *   Cadastro de novos usuários (CPF, nome, senha, etc.).
    *   Login com CPF e senha.
    *   Gerenciamento de sessão.
2.  **Frontend Refatorado:**
    *   Estrutura de pastas e nomes de arquivos padronizados e em português/inglês.
    *   Uso de `url_for` do Flask para referenciar corretamente os arquivos estáticos e rotas.
3.  **Gerenciamento de Dados:**
    *   Uso de SQLite para persistência de dados de usuários.

## Como Executar o Projeto

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### 1. Pré-requisitos

Você precisa ter o **Python 3** instalado em seu sistema.

### 2. Instalação de Dependências

O projeto agora requer as seguintes bibliotecas Python: `Flask`, `Werkzeug` e `fpdf2`. (As bibliotecas `qrcode` e `Pillow` foram removidas, pois a funcionalidade de QR Code foi retirada).

Navegue até a pasta raiz do projeto e instale as dependências:

```bash
# Navegue até a pasta do projeto
cd /caminho/para/Carteira_de_vacinacao_digital

# Instale as bibliotecas necessárias
pip install Flask Werkzeug fpdf2
```

> **Nota sobre Fpdf2:** Esta biblioteca não requer dependências externas do sistema operacional, o que facilita a execução em ambientes como o Windows. No entanto, a geração do PDF é feita de forma programática e não é uma cópia exata do HTML da página.

### 3. Inicialização do Banco de Dados

O banco de dados `database.db` é criado e inicializado automaticamente na primeira execução do `database.py`.

```bash
# Execute o script de inicialização do banco de dados
python database.py
```

> **Nota:** Um usuário de teste é criado automaticamente com **CPF: `12345678900`** e **Senha: `123456`**.

### 4. Execução da Aplicação Flask

Execute o arquivo principal da aplicação Flask:

```bash
# Execute a aplicação
python app.py
```

A aplicação estará acessível em `http://127.0.0.1:5000/` (ou `http://localhost:5000/`).

### 5. Acessando a Aplicação

*   **Página Inicial:** Acesse `http://127.0.0.1:5000/`
*   **Login:** Use o usuário de teste (`12345678900` / `123456`) ou cadastre um novo.
*   **Páginas Protegidas:** Após o login, você será redirecionado para o perfil e poderá acessar a carteira de vacinação e a gestão familiar.

## Melhorias Realizadas

*   **Estrutura de Pastas:** Organização em `backend/` e `frontend/` (com `templates/` e `static/`).
*   **Nomenclatura:** Arquivos HTML, CSS e JS renomeados para nomes mais claros e padronizados (ex: `login.html`, `profile.css`, `accordion.js`).
*   **Backend:** Implementação de um servidor Flask com rotas para login, cadastro, logout e páginas protegidas.
*   **Segurança:** Uso de `werkzeug.security` para armazenar senhas com hash (melhor prática de segurança).
*   **Integração:** Uso da sintaxe Jinja (`{{ url_for(...) }}`) nos arquivos HTML para garantir a correta resolução de URLs pelo Flask.
*   **Sessão:** Implementação de sessões para manter o estado de login do usuário.
*   **Mensagens Flash:** Uso de `flash` para exibir mensagens de sucesso/erro ao usuário.
*   **Dados do Usuário na Carteira:** Os dados cadastrais do usuário (Nome, CPF, CNS, Data de Nascimento) são exibidos dinamicamente na página da carteira de vacinação.

*   **Download de PDF Funcional:** Implementação de uma rota Flask que utiliza **Fpdf2** para gerar um PDF programático com os dados do usuário e o histórico de vacinação. Esta solução não requer dependências externas do sistema operacional.
*   **Exibição de Vacinas (Formato Inovador):** As vacinas são exibidas na carteira principal como **"quadrados clicáveis"** que alternam entre o **Nome da Vacina** e a **Data de Aplicação** ao serem clicados.
*   **Histórico Detalhado:** O botão "Histórico" na carteira foi substituído por um link para uma nova página (`/vaccine_history`) que exibe a lista completa de vacinas em formato de tabela, com funcionalidade de busca e clique para detalhes.
