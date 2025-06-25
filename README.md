# 🎬 publicMovies

Um app mobile simples, feito com **React Native** + **Expo**, que exibe uma lista de filmes públicos. Puxa dados da API do Archive.org, permite navegar entre listagens e detalhes de filmes, além da possibilidade de assistir os filmes diretamente no app.

---

## 🚀 Tecnologias

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **React Navigation** - Navegação entre telas
- **SQLite** - Banco de dados local
- **React Native WebView** - Reprodução de vídeos
- **Expo Image** - Otimização de imagens
- **AsyncStorage** - Armazenamento local

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

3. Execute o app:
   ```bash
   npx expo start
   ```

4. Para testar:
   - 📱 Use o app **Expo Go** no seu celular (escaneie o QR Code)
   - 💻 Ou clique em "Run on Android/iOS simulator"

---

## 📱 Funcionalidades

### 🎥 **Catálogo de Filmes**
- Lista infinita de filmes com scroll
- Imagens otimizadas dos posters
- Informações básicas (título, descrição)
- Filtro automático de duplicatas

### ❤️ **Sistema de Favoritos**
- Adicionar/remover filmes dos favoritos
- Lista dedicada de favoritos
- Sincronização automática entre telas
- Persistência local com SQLite

### 🎬 **Reprodução de Vídeos**
- Player integrado com WebView
- Controle de tempo assistido
- Retomada automática do último ponto
- Suporte a diferentes formatos de vídeo

### ⏱️ **Controle de Progresso**
- Salva automaticamente o tempo assistido
- Histórico de visualização
- Retoma de onde parou
- Reset de progresso

### 🎨 **Interface**
- Design responsivo e moderno
- Suporte a tema claro/escuro
- Navegação por abas
- Feedback háptico

---

## 🏗️ Estrutura do Projeto

```
publicMovies/
├── app/                    # Telas do app (Expo Router)
│   ├── (tabs)/            # Navegação por abas
│   └── movie/             # Tela de detalhes do filme
├── components/            # Componentes reutilizáveis
├── services/             # Serviços e lógica de negócio
│   ├── database/         # Configuração do SQLite
│   ├── favorites.ts      # Gerenciamento de favoritos
│   └── movieTime.ts      # Controle de tempo
├── api/                  # Integração com APIs
└── constants/            # Constantes e configurações
```

---

## 🔧 Configuração

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI
- Android Studio (para emulador Android)
- Xcode (para emulador iOS - apenas macOS)

### Variáveis de Ambiente
O app utiliza a API pública do Archive.org, não sendo necessárias variáveis de ambiente.

---

## 🚀 Deploy

### Android
```bash
npx expo build:android
```

### iOS
```bash
npx expo build:ios
```

---

## 🔗 Links Úteis

- 📘 [Documentação do Expo](https://docs.expo.dev)
- 🚦 [React Navigation](https://reactnavigation.org/)
- 🎥 [Archive.org API](https://archive.org/developers/)
- 📱 [Expo Go App](https://expo.dev/client)
- 🎨 [React Native](https://reactnative.dev/)

---