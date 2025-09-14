// app/api/tenants/[slug]/upgrade/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthenticatedUser } from '../../../../../lib/auth';

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  const { user, error } = await getAuthenticatedUser(req);
  if (error) return error;
  
  if (user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
  }
  
  const { tenantId } = user;
  const { slug } = params;

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });

  if (tenant.slug !== slug) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const updatedTenant = await prisma.tenant.update({
    where: { id: tenantId },
    data: { plan: 'PRO' },
  });

  return NextResponse.json({ message: 'Plan upgraded to PRO!', tenant: updatedTenant });
};