# Thena Platform App Scaffold

A NestJS-based scaffold for building applications on the Thena platform. This scaffold provides a production-ready setup for handling Thena platform webhooks through a queue-based architecture.

[![Coverage](https://img.shields.io/badge/Coverage-11.94%25-red.svg)](https://github.com/amyth/scaffold)
[![Coverage](https://img.shields.io/badge/Coverage%20(Functions)-16.66%25-red.svg)](https://github.com/amyth/scaffold)
[![Coverage](https://img.shields.io/badge/Coverage%20(Lines)-11.81%25-red.svg)](https://github.com/amyth/scaffold)

## Overview

This scaffold implements a robust webhook processing system for the Thena platform with the following flow:
1. **Webhook Endpoints** (`/thena/events`, `/thena/installations`): Receive platform events and installation updates
2. **Queue System**: Events are queued using Bull MQ to ensure reliable processing
3. **Processors**: Dedicated workers process events asynchronously with retry capabilities

## Features

- **Thena Platform Integration**:
  - Webhook endpoints for platform events and installations
  - Queue-based event processing with Bull MQ
  - Automatic retry mechanisms for failed events
  - Event validation and type safety
  
- **Infrastructure**:
  - **Framework**: NestJS with Express
  - **Queue System**: Bull MQ with Bull Board UI for monitoring
  - **Logging**: Pino logger with request context
  - **Configuration**: Environment-based with validation
  - **Testing**: Jest with coverage reporting
  - **Code Quality**: ESLint + Prettier with Husky pre-commit hooks
  - **Docker Support**: Multi-container setup with Docker Compose

## Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose
- Redis (for queue management)
- pnpm (package manager)

## Getting Started

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   pnpm run start:dev
   ```

### Webhook Processing Flow

1. **Event Reception**:
   - Platform events are received at `/thena/events`
   - Installation updates are received at `/thena/installations`

2. **Queue Management**:
   - Events are queued in `thena-platform-events` queue
   - Installations are queued in `thena-platform-installations` queue
   - Bull Board UI at `/admin/queues` for monitoring

3. **Event Processing**:
   - Dedicated processors handle each event type
   - Automatic retries on failures
   - Configurable concurrency and rate limiting

4. **Customization**:
   - Add your business logic in the respective processors:
     - `src/modules/thena/processors/event.processor.ts`
     - `src/modules/thena/processors/installation.processor.ts`

## Environment Variables

- `PORT`: Application port (default: 3000)
- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port (default: 54322 for Supabase)
- `DB_USERNAME`: PostgreSQL username
- `DB_PASSWORD`: PostgreSQL password
- `DB_NAME`: PostgreSQL database name
- `DB_SYNCHRONIZE`: Enable/disable TypeORM synchronize
- `REDIS_HOST`: Redis host
- `REDIS_PORT`: Redis port
- `REDIS_CACHE_TTL`: Cache TTL in seconds
- `LOG_LEVEL`: Logging level (error, warn, info, debug)
- `LOG_COLORS`: Enable/disable colored logs
- `LOG_TIME_FORMAT`: Log timestamp format
- `QUEUE_MONITOR`: Enable/disable Bull Board queue monitor

## API Documentation

- Swagger documentation is available at `/api` when the application is running
- Bull Board queue monitor is available at `/admin/queues` (when enabled)

## Project Structure

```
├── src/
│   ├── config/              # Configuration module and validation
│   │   ├── config.module.ts
│   │   ├── configuration.ts
│   │   └── validation.ts
│   ├── database/           # Database module and entities
│   │   ├── database.module.ts
│   │   ├── entities/
│   │   └── repositories/
│   ├── modules/            # Feature modules
│   │   └── thena/         # Example module with queues
│   │       ├── processors/  # Queue processors
│   │       ├── thena.controller.ts
│   │       ├── thena.service.ts
│   │       └── thena.module.ts
│   ├── queue/             # Queue configuration
│   │   └── queue.module.ts
│   ├── redis/             # Redis cache module
│   │   ├── redis.module.ts
│   │   └── services/
│   ├── app.module.ts      # Root application module
│   └── main.ts           # Application entry point
├── test/                  # Test files
├── docker-compose.yml     # Docker services configuration
├── Dockerfile            # Application container configuration
└── package.json          # Project dependencies and scripts

## Available Scripts

- `pnpm run start`: Start the application
- `pnpm run start:dev`: Start in development mode with hot-reload
- `pnpm run build`: Build the application
- `pnpm run test`: Run tests
- `pnpm run test:cov`: Run tests with coverage
- `pnpm run test:e2e`: Run end-to-end tests
- `pnpm run lint`: Lint the code
- `pnpm run format`: Format the code

## Example Module (Thena)

The scaffold includes a Thena module demonstrating:
- Event-driven architecture with Bull queues
- Queue processors with retry strategies
- Request validation and error handling
- Swagger documentation
- Pino logging with request context
- Unit testing with 100% coverage

## Testing

This project uses Jest for unit testing and end-to-end testing. To run tests, use the following commands:

- `pnpm run test`: Run unit tests
- `pnpm run test:cov`: Run unit tests with coverage reporting
- `pnpm run test:e2e`: Run end-to-end tests

## Code Quality

This project uses ESLint and Prettier for code quality and formatting. To lint and format the code, use the following commands:

- `pnpm run lint`: Lint the code
- `pnpm run format`: Format the code

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.