# iSpeak

## O que é
iSpeak é um Progressive Web App (PWA) que funciona como um mini-dicionário bilíngue, oferecendo 3.000 palavras em inglês com seus significados em português. Ele foi criado para ajudar estudantes e curiosos a expandirem seu vocabulário de forma simples e prática.

## Como usar
- Abra o app no navegador.
- Uma palavra em inglês e seu significado em português aparecerão de forma aleatória.
- Cada palavra só reaparece depois que todas as outras já foram exibidas.
- Use o botão em forma de mãozinha aberta para copiar a palavra e seu significado.
- Use o botão com dedinho deslizante para passar para a próxima palavra aleatória.
- Marque palavras como favoritas para revisão.
- Utilize o campo de busca para localizar palavras específicas.

## Instalação no PC
1. Abra o iSpeak no navegador (Chrome, Edge ou outro compatível).
2. Clique no ícone de instalação (geralmente aparece na barra de endereços).
3. O app será instalado e poderá ser aberto como um programa independente.

## Instalação no celular
1. Abra o iSpeak no navegador do celular.
2. Clique em "Adicionar à tela inicial".
3. O app ficará disponível como um aplicativo nativo.

## Uso offline
- O iSpeak funciona mesmo sem internet, graças ao service worker.
- O banco de palavras está armazenado localmente no arquivo `words.json`, garantindo acesso contínuo.

## Estrutura do projeto
- index.html → página principal com layout e referências.
- style.css → estilos para tema claro/escuro.
- script.js → lógica de exibição aleatória sem repetição, favoritos e botões copiar/próxima.
- words.json → banco de dados externo com as 3.000 palavras em inglês e português.
- manifest.json → configuração PWA com ícones.
- service-worker.js → cache offline.
- logo.svg → logotipo principal com o monograma iS.
- icon-192.png e icon-512.png → ícones derivados do logotipo.
- README.md → instruções e documentação.
