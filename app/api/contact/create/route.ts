import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    const { firstName, lastName, email, phone, message } = data;

    if (!firstName || !lastName || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // TODO: Save to Supabase database
    // TODO: Send email notification
    // TODO: Integrate with GoHighLevel CRM

    console.log('Contact form submission:', data);

    return NextResponse.json(
      { success: true, message: 'Formulario enviado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Error al procesar el formulario' },
      { status: 500 }
    );
  }
}
