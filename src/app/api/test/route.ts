import { NextResponse } from 'next/server';
import { query } from '@/lib/pg-db';

export async function GET() {
  try {
    // Test the database connection with a simple query
    const result = await query('SELECT NOW() as now');
    
    return NextResponse.json({
      success: true,
      databaseTime: result.rows[0].now,
      message: 'Database connection successful!'
    });
    
  } catch (error: any) {
    console.error('Database connection test failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to connect to the database',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
