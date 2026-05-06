import { NextResponse } from 'next/server';
import { query } from '@/lib/db'; 

export async function POST(request: Request) {
  try {
    const { phoneNumber, password } = await request.json();

    if (!phoneNumber || !password) {
      return NextResponse.json(
        { success: false, message: 'Nomor telepon dan password wajib diisi' },
        { status: 400 }
      );
    }

    const users = await query(
      'SELECT username, domain FROM subscriber WHERE username = ? AND password = ?',
      [phoneNumber, password]
    ) as any[];


    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Nomor atau password salah' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Login berhasil',
      token: 'session-' + Math.random().toString(36).substr(2), // Token sederhana
      data: {
        username: users[0].username,
        domain: users[0].domain
      }
    });

  } catch (error) {
    console.error('Database Login Error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}