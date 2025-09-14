// app/api/notes/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthenticatedUser } from '../../../lib/auth';

const prisma = new PrismaClient();

export async function GET(req) {
  const { user, error } = await getAuthenticatedUser(req);
  if (error) return error;
  
  const { tenantId } = user;
  const notes = await prisma.note.findMany({
    where: { tenantId: tenantId },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(notes, { status: 200 });
}

export async function POST(req) {
  const { user, error } = await getAuthenticatedUser(req);
  if (error) return error;

  const { userId, tenantId } = user;
  const { title, content } = await req.json();

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (tenant.plan === 'FREE') {
    const noteCount = await prisma.note.count({ where: { tenantId } });
    if (noteCount >= 3) {
      return NextResponse.json({ message: 'Free plan limit of 3 notes reached. Please upgrade.' }, { status: 403 });
    }
  }

  const newNote = await prisma.note.create({
    data: { title, content, tenantId, authorId: userId },
  });
  return NextResponse.json(newNote, { status: 201 });
}