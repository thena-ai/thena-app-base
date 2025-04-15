# NestJS Backend Scaffold

A comprehensive NestJS backend scaffold with integrated PostgreSQL, Redis caching, Bull MQ for job processing, and Pino logging.

## Features

- **Framework**: NestJS with Express
- **Database**: PostgreSQL with TypeORM
- **Caching**: Redis with TTL and invalidation strategies
- **Queue System**: Bull MQ for job processing
- **Logging**: Pino logger with configurable levels
- **API Documentation**: Swagger/OpenAPI
- **Configuration**: Environment-based with validation
- **Docker Support**: Multi-container setup with Docker Compose

## Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose
- PostgreSQL
- Redis

## Getting Started

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run start:dev
   ```

### Docker Development

1. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

## Environment Variables

- `PORT`: Application port (default: 3000)
- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port
- `DB_USERNAME`: PostgreSQL username
- `DB_PASSWORD`: PostgreSQL password
- `DB_NAME`: PostgreSQL database name
- `DB_SYNCHRONIZE`: Enable/disable TypeORM synchronize
- `REDIS_HOST`: Redis host
- `REDIS_PORT`: Redis port
- `REDIS_CACHE_TTL`: Cache TTL in seconds
- `LOG_LEVEL`: Logging level (error, warn, info, debug)
- `QUEUE_MONITOR`: Enable/disable Bull queue monitor

## API Documentation

Swagger documentation is available at `/api` when the application is running.

## Project Structure

```
├── src/
│   ├── config/           # Configuration files
│   ├── modules/          # Feature modules
│   │   ├── redis/        # Redis cache module
│   │   └── example/      # Example CRUD module
│   ├── app.module.ts     # Root application module
│   └── main.ts          # Application entry point
├── test/                 # Test files
├── docker-compose.yml    # Docker services configuration
├── Dockerfile           # Application container configuration
└── package.json         # Project dependencies and scripts
```

## Available Scripts

- `npm run start`: Start the application
- `npm run start:dev`: Start in development mode with hot-reload
- `npm run build`: Build the application
- `npm run test`: Run tests
- `npm run test:e2e`: Run end-to-end tests
- `npm run lint`: Lint the code
- `npm run format`: Format the code

## Example Module

The scaffold includes an example module demonstrating:
- CRUD operations with TypeORM
- Redis caching integration
- Bull MQ job processing
- Swagger documentation
- Pino logging

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.