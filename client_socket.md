client/
└── src/
    ├── components/
    ├── constants/
    │   ├── api.ts
    │   ├── routes.ts
    │   └── socket.events.ts      ⭐  Stores every event name
    │
    ├── hooks/
    │   ├── useSocket.ts          ⭐  React hook for components
    │   └── ...
    │
    ├── lib/
    │   ├── axios.ts
    │   └── socket.ts             ⭐     Creates **only one** socket instance => export socket
    │
    ├── pages/
    ├── schemas/
    ├── services/
    │   ├── auth.service.ts
    │   ├── meeting.service.ts
    │   └── socket.service.ts     ⭐  High-level methods that wrap `socket.emit`
    │
    ├── store/
    │   ├── auth.store.ts
    │   ├── meeting.store.ts
    │   └── socket.store.ts       ⭐ (optional)  Don't store the socket object itself.
    │
    ├── types/
    │   ├── meeting.ts
    │   ├── socket.ts             ⭐  Interfaces.
    │   └── ...
    │
    └── utils/
