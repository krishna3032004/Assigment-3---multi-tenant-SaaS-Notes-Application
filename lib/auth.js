// lib/auth.js
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-that-is-long';

// Yeh function ab har API file mein call hoga
export const getAuthenticatedUser = async (req) => {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
      return { user: null, error: NextResponse.json({ message: 'Authentication required' }, { status: 401 }) };
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userExists = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!userExists) {
      return { user: null, error: NextResponse.json({ message: 'User not found' }, { status: 404 }) };
    }

    return { user: decoded, error: null };
  } catch (error) {
    return { user: null, error: NextResponse.json({ message: 'Invalid or expired token' }, { status: 403 }) };
  }
};