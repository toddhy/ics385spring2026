flowchart TD
  A[Visitor] --> B[Login Page]
  B --> C[POST /auth/local]
  B --> D[GET /auth/google]
  C --> E[Passport Local -> verify]
  D --> F[Passport Google -> OAuth callback]
  E --> G{User exists?}
  F --> G
  G -->|yes| H[Create Session / JWT]
  G -->|no| I[Create User in MongoDB]
  I --> H
  H --> J[Set Cookie / Redirect to Dashboard]
  J --> K[Protected Route -> Admin Action]
  K --> L[Express -> Mongoose update]
  style E fill:#ffd,stroke:#333
  style F fill:#ffd,stroke:#333
  style I fill:#efe,stroke:#333