import { Pool, PoolClient, QueryResult, QueryConfig, QueryResultRow } from 'pg';

// Extend the PoolClient type to include our custom properties
declare module 'pg' {
  interface PoolClient {
    lastQuery?: string;
    query: <T extends QueryResultRow = any>(
      queryTextOrConfig: string | QueryConfig,
      values?: any[]
    ) => Promise<QueryResult<T>>;
  }
}

const pool = new Pool({
  user: 'postgres',
  password: '123456',
  host: 'localhost',
  port: 5433,
  database: 'data1',
  // Increase timeouts for development
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 20,
});

// Test the connection on startup
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
  } else {
    console.log('Successfully connected to PostgreSQL');
  }
});

export async function query<T extends QueryResultRow = any>(
  text: string, 
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { 
      text, 
      duration, 
      rows: res.rowCount 
    });
    return res;
  } catch (error) {
    console.error('Error executing query:', { 
      text, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    throw error;
  }
}

export async function getClient() {
  const client = await pool.connect();
  const originalQuery = client.query;
  const originalRelease = client.release;
  
  // Set a timeout of 5 seconds
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
    if (client.lastQuery) {
      console.error(`The last executed query on this client was: ${client.lastQuery}`);
    }
  }, 5000);

  // Monkey patch the query method to keep track of the last query executed
  client.query = function<T extends QueryResultRow = any>(
    queryTextOrConfig: string | QueryConfig,
    values?: any[]
  ): Promise<QueryResult<T>> {
    client.lastQuery = typeof queryTextOrConfig === 'string' 
      ? queryTextOrConfig 
      : queryTextOrConfig.text;
    
    // Type assertion to handle the generic type properly
    return originalQuery.call(client, queryTextOrConfig, values) as Promise<QueryResult<T>>;
  };

  client.release = (err?: Error | boolean) => {
    // Clear the timeout
    clearTimeout(timeout);
    
    // Reset the query method to the original
    client.query = originalQuery;
    client.release = originalRelease;
    
    return originalRelease.apply(client, [err]);
  };

  return client;
}

// Handle pool errors
pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
  // Don't crash on idle client errors
});

// Clean up on process exit
process.on('SIGINT', async () => {
  try {
    await pool.end();
    console.log('Pool has ended');
    process.exit(0);
  } catch (err) {
    console.error('Error during pool shutdown', err);
    process.exit(1);
  }
});

export default {
  query,
  getClient,
  pool, // Export pool for transactions if needed
};
