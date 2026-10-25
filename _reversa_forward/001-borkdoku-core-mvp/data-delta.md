# Data Delta: Borkdoku Core MVP

> Identificador: `001-borkdoku-core-mvp`  
> Data: `2026-10-25`  

---

## 1. Banco de Dados Local do Navegador (IndexedDB)

Nome do Banco: `borkdoku_db`  
Versão do Schema: `1`

### Tabela: `completed_levels`
Armazena o histórico de fases resolvidas pelo jogador.

| Campo | Tipo | Chave | Descrição |
|---|---|---|---|
| `levelId` | `string` | PK | Identificador único da fase (ex: `level-001`, `daily-20261025`) |
| `size` | `number` | Index | Dimensão da grade ($5$ a $9$) |
| `completedAt` | `string` | | Timestamp ISO 8601 da conclusão |
| `durationSeconds`| `number` | | Tempo total decorrido em segundos |
| `movesCount` | `number` | | Quantidade de toques/ações realizadas |
| `mistakesCount` | `number` | | Quantidade de violações de regra cometidas |

### Tabela: `player_settings`
Armazena configurações e preferências do usuário.

| Campo | Tipo | Chave | Descrição |
|---|---|---|---|
| `key` | `string` | PK | Nome da configuração (ex: `theme`, `audio`, `vibration`) |
| `value` | `any` | | Valor correspondente (booleano, string, etc.) |

---

## 2. Formato do Arquivo de Backup (`borkdoku-backup.json`)

```json
{
  "schemaVersion": "1.0",
  "exportedAt": "2026-10-25T12:00:00.000Z",
  "checksum": "sha256-string...",
  "statistics": {
    "gamesPlayed": 42,
    "gamesWon": 40,
    "currentStreak": 7,
    "bestStreak": 14,
    "bestTimesBySize": {
      "5": 28,
      "6": 55,
      "7": 112,
      "8": 240
    }
  },
  "completedLevels": [
    {
      "levelId": "level-1",
      "size": 6,
      "completedAt": "2026-10-25T10:15:00.000Z",
      "durationSeconds": 55,
      "movesCount": 18
    }
  ],
  "unlockedBreeds": [
    "golden-retriever",
    "beagle",
    "pug",
    "corgi"
  ],
  "settings": {
    "soundEnabled": true,
    "theme": "cozy-light"
  }
}
```
