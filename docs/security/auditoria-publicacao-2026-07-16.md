# Auditoria de publicação — 16/07/2026

## Escopo

Verificação pontual do repositório público `Allthomaz/Questionario`, incluindo os arquivos
versionados no `main` e o histórico disponível localmente.

## Resultado

- O repositório é público.
- Não foram identificados e-mails, telefones, CPF ou dados de pacientes nos arquivos
  versionados, inclusive no relatório Excel.
- Não foram identificados arquivos `.env`, chaves privadas ou padrões comuns de tokens no
  código e no histórico analisado.
- O código não expõe uma rota de leitura da planilha de pacientes.

## Ponto de atenção prioritário

A URL de implantação do Google Apps Script está versionada em `api/proxy.js` e também
referenciada em `src/main.js`. O Apps Script recebe `POST` e grava registros na planilha sem
autenticação de origem ou assinatura. Portanto, alguém que descubra essa URL pode enviar
registros falsos ou gerar spam na planilha.

Isso não é evidência de leitura pública da planilha. O acesso aos dados existentes depende das
permissões efetivas da planilha e da configuração da implantação do Apps Script, que não foram
verificadas nesta auditoria de código.

## Quando for hora de blindar

1. Criar nova implantação do Apps Script e desativar a URL atual.
2. Remover URLs fixas do repositório público.
3. Usar assinatura secreta entre a função Vercel e o Apps Script.
4. Adicionar limitação de requisições e proteção antispam ao endpoint público.
5. Confirmar que a planilha está restrita apenas às pessoas autorizadas.
6. Incluir aviso de privacidade e base de consentimento apropriados, pois o formulário trata
   dados de saúde.

## Decisão atual

Nenhuma correção foi aplicada nesta data. O usuário optou por manter o repositório público por
enquanto e tratar a organização das contas e a blindagem em outra sessão.
