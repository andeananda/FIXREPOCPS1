import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; 

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM acc ORDER BY time DESC LIMIT 20');

    return NextResponse.json({
      success: true,
      logs: rows
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
}