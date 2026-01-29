
# Projet : Application Frontend avec Architecture Hexagonale
**Organisation** : Patrick Letourneux
**Tech Stack** : React, TypeScript, Redux
---

## Contexte du Projet
Cette application utilise une **architecture hexagonale** pour isoler la logique métier des détails techniques. Le store Redux fait partie du **domaine** (`/domain/store`) car il modélise l'état métier de l'application. Les composants React n'accèdent jamais directement au store Redux : l'accès se fait via des **ports** et des **adaptateurs**. Les **hooks React** ne doivent jamais apparaître dans le domaine.

---

## Architecture Hexagonale : Principes Clés
- **Domaine** : Contient la logique métier, les entités, les **ports** (interfaces) et le **store Redux** (état métier). Aucun hook React dans le domaine.
- **Adaptateurs** : Implémentent les ports pour accéder aux détails techniques (API, stockage). Les hooks React d'accès au store se trouvent ici.
- **Inversion de dépendances** : Le domaine définit des ports (interfaces). Les adaptateurs les implémentent.
- **Composants React** : N'accèdent qu'aux adaptateurs (via des hooks), jamais directement au store Redux.

---

## Structure des Dossiers

```
/src
  /domain            # Logique métier, entités, ports, store
    /entities         # Modèles de données (ex : User.ts)
    /ports            # Interfaces pour interagir avec l'état global
    /store            # Slices Redux (état métier, pas de hooks)
  /adapters           # Implémentations des ports
    /redux            # Adaptateur Redux (hooks React ici)
    /api              # Appels API
    /localStorage     # Stockage local
  /ui                 # Composants React, pages
```

---

## Exemples de Code

### 1. Définition d'un Port pour l'État Global (Domaine)
```typescript
// /domain/ports/UserStatePort.ts
export interface UserStatePort {
  user: User | null;
  setUser(user: User): void;
  clearUser(): void;
}
```

### 2. Store Redux (Domaine — pas de hooks ici)
```typescript
// /domain/store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../entities/User";

interface UserState {
  data: User | null;
}

const initialState: UserState = { data: null };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.data = action.payload;
    },
    clearUser(state) {
      state.data = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
```

### 3. Implémentation de l'Adaptateur Redux (Adaptateur — hooks ici)
```typescript
// /adapters/redux/useUserState.ts
import { useSelector, useDispatch } from "react-redux";
import { UserStatePort } from "../../domain/ports/UserStatePort";
import { setUser as setUserAction, clearUser as clearUserAction } from "../../domain/store/userSlice";
import { RootState } from "../../domain/store";
import { User } from "../../domain/entities/User";

export const useUserState = (): UserStatePort => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.data);

  return {
    user,
    setUser: (u: User) => dispatch(setUserAction(u)),
    clearUser: () => dispatch(clearUserAction()),
  };
};
```

### 4. Utilisation dans un Composant React (UI)
```typescript
// /ui/components/UserProfile.tsx
import { useUserState } from "../../adapters/redux/useUserState";

export const UserProfile = () => {
  const { user, setUser } = useUserState();

  const handleLogin = () => {
    setUser({ id: "1", name: "Patrick" });
  };

  return (
    <div>
      {user ? <div>Bonjour, {user.name}</div> : <button onClick={handleLogin}>Se connecter</button>}
    </div>
  );
};
```

---

## Conventions et Bonnes Pratiques

- **TypeScript** : Obligatoire pour tous les fichiers. Typer les slices, les ports et les adaptateurs.
- **Tests** : Tester les adaptateurs en isolation.
- **Documentation** : Chaque port et adaptateur doit être documenté avec JSDoc.
- **Redux** : Le store est dans `/domain/store` (état métier), mais n'est accédé par l'UI que via les adaptateurs.
- **Hooks React** : Interdits dans `/domain`. Ils n'apparaissent que dans `/adapters` et `/ui`.
