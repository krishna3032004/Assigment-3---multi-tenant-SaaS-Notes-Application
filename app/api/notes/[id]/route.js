// app/api/notes/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthenticatedUser } from '../../../../lib/auth';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { user, error } = await getAuthenticatedUser(req);
  if (error) return error;

  const { tenantId } = user;
  const { id } = params;

  const note = await prisma.note.findFirst({ where: { id: id, tenantId: tenantId } });
  if (!note) {
    return NextResponse.json({ message: 'Note not found' }, { status: 404 });
  }
  return NextResponse.json(note, { status: 200 });
}

export async function PUT(req, { params }) {
  const { user, error } = await getAuthenticatedUser(req);
  if (error) return error;
  
  const { tenantId } = user;
  const { id } = params;
  const { title, content } = await req.json();

  const noteToUpdate = await prisma.note.findFirst({ where: { id: id, tenantId: tenantId } });
  if (!noteToUpdate) {
    return NextResponse.json({ message: 'Note not found or you do not have permission to edit it.' }, { status: 404 });
  }

  const updatedNote = await prisma.note.update({ where: { id: id }, data: { title, content } });
  return NextResponse.json(updatedNote, { status: 200 });
}

export async function DELETE(req, { params }) {
  const { user, error } = await getAuthenticatedUser(req);
  if (error) return error;

  const { tenantId } = user;
  const { id } = params;

  const noteToDelete = await prisma.note.findFirst({ where: { id: id, tenantId: tenantId } });
  if (!noteToDelete) {
    return NextResponse.json({ message: 'Note not found or you do not have permission to delete it.' }, { status: 404 });
  }

  await prisma.note.delete({ where: { id: id } });
  return NextResponse.json({ message: 'Note deleted successfully' }, { status: 200 });
}