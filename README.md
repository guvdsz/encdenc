# Processador de arquivos com streams em Node.js

Aplicação de estudo em Node.js que demonstra o uso de **streams de transformação** (`Transform`) para processar arquivos em blocos, exibindo o progresso da operação no terminal.

O projeto implementa duas transformações:

- **Encrypt**: incrementa em 1 o valor de cada byte diferente de `255`;
- **Decrypt**: decrementa em 1 o valor de cada byte diferente de `255`.

O processamento é feito com streams para evitar a necessidade de carregar o arquivo inteiro na memória.

> **Aviso:** este projeto é educacional e não deve ser usado para proteger informações reais. A transformação implementada não é um algoritmo criptográfico seguro e não substitui criptografia como AES ou ferramentas especializadas.

## Requisitos

- Node.js instalado;
- Um arquivo `encrypted.txt` no diretório raiz do projeto.

O código usa apenas módulos nativos do Node.js (`node:stream` e `node:fs/promises`), portanto não é necessário instalar dependências com npm.

## Como executar

Clone o repositório e entre na pasta do projeto:

```bash
git clone https://github.com/guvdsz/encdenc.git
cd encdenc
```

Execute a aplicação:

```bash
node app.js
```

Ao executar, o programa:

1. abre `encrypted.txt` para leitura;
2. processa o conteúdo em chunks por meio da classe `Decrypt`;
3. grava o resultado em `decrypted.txt`;
4. informa o progresso periodicamente no terminal.

Exemplo de saída:

```text
Decrypted 100.00%
```

O arquivo `decrypted.txt` é criado ou sobrescrito a cada execução.

## Fluxo atual

```text
encrypted.txt
      |
      v
  Decrypt (Transform)
      |
      v
decrypted.txt
```

O arquivo `read.txt` e a função `encrypt()` fazem parte da implementação do fluxo de criptografia, mas a função `encrypt()` não é chamada pelo ponto de entrada atual. Assim, a execução padrão do projeto realiza somente a descriptografia de um arquivo `encrypted.txt` já existente.

## Estrutura do projeto

```text
.
├── app.js          # Classes de transformação e fluxo de arquivos
├── read.txt        # Arquivo de entrada previsto para o fluxo de criptografia
├── encrypted.txt   # Arquivo de entrada do fluxo executado atualmente
└── decrypted.txt   # Resultado da descriptografia
```

## Como o processamento funciona

As classes `Encrypt` e `Decrypt` herdam de `Transform` e sobrescrevem o método `_transform`. Para cada chunk recebido:

- cada byte é percorrido individualmente;
- bytes diferentes de `255` são incrementados ou decrementados;
- o chunk transformado é enviado para o próximo estágio da pipeline;
- a quantidade de bytes processados é acumulada;
- o progresso é exibido após cinco chunks ou ao final do arquivo.

O tamanho total do arquivo é obtido com `fs.stat`, permitindo calcular o percentual processado.
