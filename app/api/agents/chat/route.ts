import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userId, model = config.openrouter.defaultModel } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!config.openrouter.apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    // Call OpenRouter API
    const openrouterResponse = await fetch(`${config.openrouter.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.openrouter.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'FanPit Platform',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: `You are FanPit AI, an intelligent assistant for a space booking and event planning platform. You help users find spaces, book venues, check pricing, plan events, and answer questions about the platform.

Key capabilities:
- Space Discovery: Help users find suitable spaces based on location, capacity, amenities, and budget
- Booking Assistance: Guide users through the booking process and answer questions
- Pricing Information: Provide pricing details and help with cost calculations
- Event Planning: Assist with event planning and space requirements
- General Support: Answer questions about the platform and its features

Always be helpful, friendly, and professional. Provide specific, actionable advice when possible. If you don't know something specific about the platform, say so and offer to help in other ways.

Current context: User is interacting with the FanPit platform and may need help with space booking, event planning, or general platform usage.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!openrouterResponse.ok) {
      const errorText = await openrouterResponse.text();
      console.error('OpenRouter API error:', errorText);
      throw new Error(`OpenRouter API error: ${openrouterResponse.status}`);
    }

    const openrouterData = await openrouterResponse.json();
    const responseContent = openrouterData.choices[0]?.message?.content || 'I apologize, but I cannot generate a response at this time.';

    // Determine which agent would handle this request
    const agent = determineAgent(message);
    
    // Generate suggestions based on the message
    const suggestions = generateSuggestions(message, agent);

    // Generate actions based on the message content
    const actions = generateActions(message, agent);

    const response = {
      response: responseContent,
      timestamp: new Date().toISOString(),
      agent: agent,
      confidence: 0.9, // High confidence for most responses
      suggestions: suggestions,
      actions: actions,
      usage: {
        tokens_used: openrouterData.usage?.total_tokens || 0,
        response_time_ms: Date.now() - Date.now(), // This would be calculated properly in production
        model_used: model
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json(
      {
        response: 'I apologize, but I\'m experiencing technical difficulties right now. Please try again in a moment.',
        timestamp: new Date().toISOString(),
        agent: 'fallback_assistant',
        confidence: 0.5,
        suggestions: ['Try again', 'Contact support', 'Browse spaces manually']
      },
      { status: 500 }
    );
  }
}

function determineAgent(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('find') || lowerMessage.includes('space') || lowerMessage.includes('venue') || lowerMessage.includes('location')) {
    return 'smart_space_discovery';
  } else if (lowerMessage.includes('book') || lowerMessage.includes('reserve') || lowerMessage.includes('booking')) {
    return 'intelligent_booking';
  } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing') || lowerMessage.includes('expensive')) {
    return 'dynamic_pricing';
  } else if (lowerMessage.includes('event') || lowerMessage.includes('party') || lowerMessage.includes('meeting') || lowerMessage.includes('conference')) {
    return 'event_planning';
  } else {
    return 'virtual_concierge';
  }
}

function generateSuggestions(message: string, agent: string): string[] {
  const lowerMessage = message.toLowerCase();
  
  if (agent === 'smart_space_discovery') {
    return ['Show me spaces in Mumbai', 'Find conference rooms', 'Browse by category'];
  } else if (agent === 'intelligent_booking') {
    return ['Book this space', 'Check availability', 'View pricing details'];
  } else if (agent === 'dynamic_pricing') {
    return ['Calculate total cost', 'Apply promo code', 'Compare pricing'];
  } else if (agent === 'event_planning') {
    return ['Plan my event', 'Find event spaces', 'Check catering options'];
  } else {
    return ['Browse spaces', 'Get help', 'Contact support'];
  }
}

function generateActions(message: string, agent: string): Array<{type: string, label: string, data?: any}> {
  const lowerMessage = message.toLowerCase();
  const actions = [];
  
  if (agent === 'smart_space_discovery') {
    actions.push({
      type: 'browse_spaces',
      label: 'Browse Spaces',
      data: { category: 'all' }
    });
  }
  
  if (agent === 'intelligent_booking') {
    actions.push({
      type: 'start_booking',
      label: 'Start Booking',
      data: { step: 'calendar' }
    });
  }
  
  if (agent === 'virtual_concierge' && lowerMessage.includes('help')) {
    actions.push({
      type: 'get_help',
      label: 'Get Help',
      data: { section: 'support' }
    });
  }
  
  return actions;
}
