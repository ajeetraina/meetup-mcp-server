# Meetup MCP Server

A Model Context Protocol (MCP) server implementation for Meetup applications. This server handles context management, prompt engineering, and model interactions following the MCP specification.

## Features

- Model Context Protocol implementation
- Context management for AI models
- API endpoints for model interactions
- Customizable prompt templates
- Session management
- Context history tracking
- Authentication and authorization

## Installation

```bash
# Clone the repository
git clone https://github.com/ajeetraina/meetup-mcp-server.git

# Navigate to the project directory
cd meetup-mcp-server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the server
npm start
```

## API Endpoints

- `POST /api/context`: Create a new context
- `GET /api/context/:id`: Retrieve a context
- `PUT /api/context/:id`: Update a context
- `POST /api/prompt`: Process a prompt with context
- `POST /api/completion`: Get completion with managed context

## Configuration

Edit the `.env` file to configure:

- Server port
- Database connection
- Model providers and API keys
- Logging level
- Authentication settings

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Run tests
npm test
```

## License

MIT
