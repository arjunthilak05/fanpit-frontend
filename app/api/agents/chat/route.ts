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

    let responseContent = '';

    // Try to use OpenRouter if API key is available
    if (config.openrouter.apiKey) {
      try {
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
          throw new Error(`OpenRouter API error: ${openrouterResponse.status}`);
        }

        const openrouterData = await openrouterResponse.json();
        responseContent = openrouterData.choices[0]?.message?.content || 'I apologize, but I cannot generate a response at this time.';
      } catch (openrouterError) {
        console.warn('OpenRouter API unavailable, using fallback response:', openrouterError);
        responseContent = generateFallbackResponse(message);
      }
    } else {
      // Use fallback response when OpenRouter API key is not configured
      responseContent = generateFallbackResponse(message);
    }

    // Determine which agent would handle this request
    const agent = determineAgent(message);
    
    // Generate suggestions based on the message
    const suggestions = generateSuggestions(message, agent);

    // Generate actions based on the message content
    const actions = generateActions(message, agent);

    // Check if user is asking about places/spaces in Mumbai or other cities
    const shouldShowTiles = shouldShowSpaceTiles(message);

    // Generate space data if tiles should be shown
    const spaces = shouldShowTiles ? generateSpaceData(message) : null;

    const response = {
      response: responseContent,
      timestamp: new Date().toISOString(),
      agent: agent,
      confidence: 0.9, // High confidence for most responses
      suggestions: suggestions,
      actions: actions,
      spaces: spaces,
      showTiles: shouldShowTiles,
      usage: {
        tokens_used: (typeof openrouterData !== 'undefined' && openrouterData.usage?.total_tokens) || 0,
        response_time_ms: 300, // Approximate response time
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

function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm your FanPit AI assistant. I can help you find spaces, book venues, check pricing, or plan events. What can I help you with today?";
  }
  
  if (lowerMessage.includes('browse spaces') || (lowerMessage.includes('show') && lowerMessage.includes('spaces'))) {
    return "Here are some popular spaces available on FanPit:\n\n🏢 **Modern Co-working Hub** - Mumbai\n• Capacity: 50 people • ₹500/hour\n• WiFi, Coffee, Projector, AC\n\n🎯 **Business Conference Center** - Delhi\n• Capacity: 100 people • ₹800/hour\n• Premium AV setup, Catering available\n\n🎨 **Creative Studio Space** - Bangalore\n• Capacity: 30 people • ₹400/hour\n• Natural lighting, Art supplies\n\nClick 'Browse Spaces' below to see all available options and book directly!";
  }
  
  if (lowerMessage.includes('mumbai') || lowerMessage.includes('delhi') || lowerMessage.includes('bangalore')) {
    const city = lowerMessage.includes('mumbai') ? 'Mumbai' : lowerMessage.includes('delhi') ? 'Delhi' : 'Bangalore';
    return `Great choice! ${city} has amazing spaces available:\n\n🏙️ **${city} Spaces:**\n• Co-working spaces: ₹300-600/hour\n• Meeting rooms: ₹400-800/hour\n• Event venues: ₹1000-2000/hour\n\n**Popular amenities:** WiFi, Parking, Catering, AV Equipment\n\nWould you like to see specific spaces in ${city}? Click 'Browse Spaces' to explore all options!`;
  }
  
  if (lowerMessage.includes('find') || lowerMessage.includes('space') || lowerMessage.includes('venue')) {
    return "I can help you find the perfect space! Here's what we have:\n\n📍 **By Location:** Mumbai, Delhi, Bangalore, Pune\n👥 **By Capacity:** Small (1-10), Medium (10-50), Large (50+)\n🏢 **By Type:** Co-working, Meeting rooms, Event spaces\n💰 **By Budget:** ₹200-2000+ per hour\n\n**Popular searches:**\n• Conference rooms with projector\n• Creative spaces with natural light\n• Party venues with catering\n\nClick 'Browse Spaces' to see all options!";
  }
  
  if (lowerMessage.includes('book') || lowerMessage.includes('reserve')) {
    return "Booking is easy on FanPit! Here's how it works:\n\n✅ **3-Step Process:**\n1. **Select** - Choose your space and time slot\n2. **Details** - Enter your information\n3. **Payment** - Secure payment via Razorpay\n\n💳 **Payment Options:**\nCredit/Debit cards, UPI, Net banking, Wallets\n\n🔒 **Secure & Instant:**\nAll bookings are confirmed immediately with QR codes for easy check-in.\n\nReady to book? Click 'Start Booking' or browse spaces first!";
  }
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return "Here's our transparent pricing structure:\n\n💰 **Typical Rates:**\n• Co-working spaces: ₹300-600/hour\n• Meeting rooms: ₹400-1000/hour\n• Event venues: ₹1000-3000/hour\n\n⏰ **Time-based Pricing:**\n• Peak hours (9AM-6PM): Standard rates\n• Off-peak (6PM-9PM): +20% premium\n• Weekends: Special packages available\n\n🎟️ **Discounts Available:**\n• First-time users: 10% off\n• Bulk bookings: Up to 20% off\n• Promo codes: Check for current offers\n\n**All prices include GST. No hidden fees!**";
  }
  
  if (lowerMessage.includes('event') || lowerMessage.includes('party') || lowerMessage.includes('meeting')) {
    return "Perfect! FanPit has spaces for all types of events:\n\n🎉 **Event Types We Support:**\n• Corporate meetings & conferences\n• Team building & workshops\n• Birthday parties & celebrations\n• Product launches & networking\n• Training sessions & seminars\n\n🏢 **Event Spaces Available:**\n• Small meeting rooms (10-20 people)\n• Large conference halls (50-200 people)\n• Outdoor venues for parties\n• Creative studios for workshops\n\n✨ **Event Services:**\n• Catering partnerships\n• AV equipment included\n• Decoration assistance\n• Photography setups\n\nWhat type of event are you planning?";
  }
  
  return "I'm here to help you with space bookings, event planning, pricing, and general questions about the FanPit platform. Could you please tell me more about what you're looking for?\n\n**Quick options:**\n• Browse available spaces\n• Get pricing information\n• Start booking process\n• Plan your event";
}

function shouldShowSpaceTiles(message: string): boolean {
  const lowerMessage = message.toLowerCase();

  // Check if user is asking about places, spaces, venues in cities
  const spaceKeywords = ['places', 'spaces', 'venues', 'locations', 'find', 'show me', 'looking for'];
  const cityKeywords = ['mumbai', 'delhi', 'bangalore', 'pune', 'chennai', 'hyderabad', 'kolkata'];

  const hasSpaceKeyword = spaceKeywords.some(keyword => lowerMessage.includes(keyword));
  const hasCityKeyword = cityKeywords.some(city => lowerMessage.includes(city));

  // Also check for phrases like "spaces in Mumbai", "places in Delhi", etc.
  const spaceInCityPattern = /(?:spaces?|places?|venues?|locations?)\s+(?:in|at|near)\s+(?:mumbai|delhi|bangalore|pune|chennai|hyderabad|kolkata)/i;
  const findInCityPattern = /(?:find|show|browse|search)\s+(?:spaces?|places?|venues?|locations?)\s+(?:in|at|near)\s+(?:mumbai|delhi|bangalore|pune|chennai|hyderabad|kolkata)/i;

  return hasSpaceKeyword && hasCityKeyword ||
         spaceInCityPattern.test(message) ||
         findInCityPattern.test(message);
}

function generateSpaceData(message: string) {
  const lowerMessage = message.toLowerCase();

  // Determine which city the user is asking about
  const cities = ['mumbai', 'delhi', 'bangalore', 'pune', 'chennai', 'hyderabad', 'kolkata'];
  const city = cities.find(c => lowerMessage.includes(c)) || 'mumbai';

  const cityDisplayName = city.charAt(0).toUpperCase() + city.slice(1);

  // Generate different spaces based on the city
  const baseSpaces = [
    {
      id: '1',
      name: `${cityDisplayName} Modern Co-working Hub`,
      location: `${cityDisplayName}, Maharashtra`,
      price: city === 'mumbai' ? 500 : city === 'delhi' ? 450 : 400,
      capacity: 50,
      amenities: ['WiFi', 'Coffee', 'Projector', 'AC'],
      rating: 4.5,
      reviews: Math.floor(Math.random() * 100) + 50,
      type: 'Co-working'
    },
    {
      id: '2',
      name: `${cityDisplayName} Business Conference Center`,
      location: `${cityDisplayName}, Maharashtra`,
      price: city === 'mumbai' ? 800 : city === 'delhi' ? 750 : 700,
      capacity: 100,
      amenities: ['AV Setup', 'Catering', 'Parking', 'Stage'],
      rating: 4.8,
      reviews: Math.floor(Math.random() * 100) + 40,
      type: 'Conference'
    },
    {
      id: '3',
      name: `${cityDisplayName} Creative Event Space`,
      location: `${cityDisplayName}, Maharashtra`,
      price: city === 'mumbai' ? 600 : city === 'delhi' ? 550 : 500,
      capacity: 75,
      amenities: ['Natural Light', 'Sound System', 'Bar', 'Decor'],
      rating: 4.6,
      reviews: Math.floor(Math.random() * 100) + 60,
      type: 'Event Space'
    },
    {
      id: '4',
      name: `${cityDisplayName} Premium Meeting Room`,
      location: `${cityDisplayName}, Maharashtra`,
      price: city === 'mumbai' ? 400 : city === 'delhi' ? 350 : 300,
      capacity: 20,
      amenities: ['WiFi', 'Projector', 'Whiteboard', 'Coffee'],
      rating: 4.4,
      reviews: Math.floor(Math.random() * 100) + 30,
      type: 'Meeting Room'
    }
  ];

  return baseSpaces;
}


