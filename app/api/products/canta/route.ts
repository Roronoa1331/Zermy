import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // For now, return mock data since Product model doesn't exist
    const products = [
      { id: '1', name: 'Çanta 1', price: 50, category: 'canta' },
      { id: '2', name: 'Çanta 2', price: 75, category: 'canta' }
    ];
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching canta products:', error);
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const productData = await request.json();
    
    // For now, return the product data as created
    const product = { id: Date.now().toString(), ...productData, category: 'canta' };
    
    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error creating canta product:', error);
    return NextResponse.json({ error: 'Server xətası' }, { status: 500 });
  }
}