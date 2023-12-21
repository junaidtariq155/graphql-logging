# graphql-logging

`graphql-logging` is a logging middleware for GraphQL servers, providing detailed logs for incoming GraphQL requests.

## Features

- Logs incoming GraphQL requests with details such as query, variables, execution time, and more.
- Helps in debugging and performance monitoring of GraphQL APIs.
- Easy to integrate with existing GraphQL server setups.

## Installation

Install the package using npm:

```bash
npm install graphql-logging
```

# Usage

## Basic Usage

### 1. Install Dependencies:

```bash
npm install graphql-logging
```

### 2. Add in their code:

```bash
const GraphQLLogger = require('graphql-logging');

const logger = new GraphQLLogger();

// Log some messages
logger.log('GraphQL request received');
logger.log('Query execution completed');

// Export logs to JSON
logger.exportLogs({ format: 'json' });

// Export logs to CSV
logger.exportLogs({ format: 'csv' });

// Get and print all logs
console.log('All Logs:', logger.getLogs());
```

## Contributing

Contributions are welcome! Please follow the contribution guidelines to contribute to this project.
