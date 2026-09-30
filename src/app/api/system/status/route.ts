import { NextResponse } from 'next/server';
import { getSystemAIStatus } from '@/services/ai/provider-factory';

export async function GET() {
  try {
    const status = getSystemAIStatus();
    return NextResponse.json(status);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to retrieve system status' },
      { status: 500 }
    );
  }
}
