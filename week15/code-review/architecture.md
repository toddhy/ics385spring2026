flowchart LR
  subgraph Client
    A[Browser] --> B[React Marketing Page]
    A --> C[React Dashboard]
  end
  subgraph Server
    C --> D[Express API]
    B --> D
    D --> E[MongoDB / Mongoose]
    D --> F[OpenWeatherMap API]
    D --> G[Other External APIs]
  end
  subgraph ClientLibs
    C --> H[Chart.js]
  end
  E -->|stores| I[(Users, TourismData, Reviews)]
  D -->|fetches| I
  style A fill:#f9f,stroke:#333,stroke-width:1px
  style D fill:#bfe,stroke:#333
  style E fill:#ffe,stroke:#333