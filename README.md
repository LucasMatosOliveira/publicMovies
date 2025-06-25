# 🎬 publicMovies

Um app mobile simples, feito com **React Native** + **Expo**, que exibe uma lista de filmes públicos. Puxa dados de uma API (ou JSON local), e permite navegar entre listagens e detalhes de filmes.

---

## 🚀 Tecnologias

- React Native
- Expo
- React Navigation (Stack)
- Fetch / Axios (para chamadas de API)
- (Opcional) Context API ou Redux para gerenciamento de estado

---

## 📦 Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/LucasMatosOliveira/publicMovies.git
   cd publicMovies
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Rode o app com Expo:
   ```bash
   npx expo start
   ```
 - Use o app Expo Go no seu celular (escaneie o QR Code).
 - Ou clique em "Run on Android/iOS simulator".


## 🧩 Estrutura do projeto

```bash
publicMovies/
├── App.js
├── package.json
├── src/
│   ├── components/      # Componentes reutilizáveis (cards, headers ...)
│   ├── screens/         # Telas do app (Home, Detalhes, etc)
│   ├── services/        # API, chamadas de dados
│   └── navigation/      # Configuração do React Navigation

```

## 📱 Funcionalidades
 - Lista de filmes com imagem, título e nota.

 - Tela de detalhes com descrição, elenco, trailer, etc.

 - Pull to refresh para atualizar conteúdo.

 - Navegação entre telas com React Navigation.

 - (Opcional) Salvar filmes como favoritos com AsyncStorage.

## 🔗 Recursos úteis

- 📘 [Documentação do Expo](https://docs.expo.dev)
- 🚦 [React Navigation](https://reactnavigation.org/)
- 🔌 [Axios](https://axios-http.com/)
- 🎥 [Archive Database](https://archive.org)