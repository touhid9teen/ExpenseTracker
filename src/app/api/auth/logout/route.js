import { NextResponse } from 'next/server';
import { withApiLog } from '../../../../utils/apiLogger';

export const runtime = 'edge';

async function postHandler() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('auth_token');
  return response;
}

export const POST = withApiLog(postHandler);
