import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/ai/gemini';

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    const prompt = `
      You are an AI assistant for a Resource Allocation Configurator application.
      The user is working with data about clients, workers, and tasks.
      
      Current context:
      - Data loaded: ${context.hasData}
      - Clients: ${context.dataStats.clients}
      - Workers: ${context.dataStats.workers}
      - Tasks: ${context.dataStats.tasks}
      
      Help the user with:
      - Understanding the application features
      - Data validation and cleaning
      - Creating business rules
      - Setting priorities
      - General questions about resource allocation
      
      Be concise, helpful, and friendly.
      
      User message: ${message}
    `;

    const response = await generateContent(prompt);

    return NextResponse.json({
      message: response
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}