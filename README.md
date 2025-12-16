Este guia fornece as instruções necessárias para configurar, executar e testar a aplicação localmente usando Docker.

📝 Sumário
Pré-requisitos
Configuração e Execução
Testes
Documentação da API

✅ Pré-requisitos
Certifique-se de que o Git e o Docker (incluindo Docker Compose) estejam instalados em sua máquina.

⚙️ Configuração e Execução
Siga estes passos para ter a aplicação rodando:

1. Clonar o Repositório
   Obtenha o código-fonte do projeto:

```bash
git clone https://github.com/LucasFilgueiras/gac-teste-tecnico.git
cd gac-teste-tecnico
```

2. Configurar Variáveis de Ambiente
   Crie o arquivo de configuração de ambiente na raiz do projeto, baseado no template fornecido:

```bash
cp .env.example .env
```

Edite o arquivo recém-criado .env e preencha as variáveis de acordo com suas configurações locais e do Docker.

IMPORTANTE: Certifique-se de definir a porta (ex: PORT=3000) conforme especificado no .env.example.

3. Iniciar o Ambiente
   Utilize o Docker Compose para construir as imagens e iniciar todos os serviços (aplicação e banco de dados, se houver) de uma vez:

# Inicia a construção e sobe os containers (em primeiro plano)

```bash
docker-compose up --build
```

# Para rodar em segundo plano (detached mode)

# docker-compose up -d --build

Após a execução bem-sucedida, a aplicação estará acessível na porta configurada.

🧪 Testes
Para executar o suite de testes unitários da aplicação:

# Certifique-se de que as dependências do Node.js estão instaladas no seu host,

# ou execute o comando dentro do container da aplicação.

```bash
yarn test
```

📖 Documentação da API
A documentação interativa da API, gerada via Swagger/OpenAPI, está disponível na seguinte URL após a aplicação estar em execução:

URL: http://localhost:[PORT]/api-docs

Nota: Substitua [PORT] pela porta que você definiu na sua variável de ambiente PORT (ex: 3000).
