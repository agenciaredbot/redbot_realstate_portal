import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/ghl/client';
import {
  mapContactFormToGHL,
  mapPropertyFormToGHL,
  normalizeColombianPhone,
  validateContactForm,
  validatePropertyForm,
} from '@/lib/ghl/mappers';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * API Route para crear leads de contacto
 *
 * Maneja dos tipos de formularios:
 * 1. Formulario de contacto general (/contacto)
 * 2. Formulario de propiedad (/propiedades/[slug])
 *
 * Flujo:
 * 1. Validar datos del formulario
 * 2. Crear/encontrar contacto en GoHighLevel
 * 3. Crear oportunidad en pipeline de GHL
 * 4. Guardar registro en Supabase para historial
 * 5. Retornar respuesta exitosa
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sourceUrl = request.headers.get('referer') || undefined;

    // Detectar tipo de formulario basado en los campos
    const isPropertyForm = 'fullName' in body && 'propertyId' in body;

    let firstName: string;
    let lastName: string;
    let email: string;
    let phone: string | undefined;
    let message: string;
    let tags: string[] = [];
    let opportunityName: string;
    let propertyId: string | null = null;
    let propertyTitle: string | null = null;
    let inquiryType: string | null = null;

    if (isPropertyForm) {
      // Formulario de propiedad
      const validation = validatePropertyForm(body);
      if (!validation.isValid) {
        return NextResponse.json(
          { success: false, error: validation.errors.join(', ') },
          { status: 400 }
        );
      }

      const mapped = mapPropertyFormToGHL({
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        message: body.message,
        propertyId: body.propertyId,
        propertyTitle: body.propertyTitle,
        agentId: body.agentId,
        agentName: body.agentName,
      });

      firstName = mapped.firstName;
      lastName = mapped.lastName;
      email = body.email;
      phone = normalizeColombianPhone(body.phone);
      message = body.message;
      tags = mapped.tags;
      opportunityName = mapped.opportunityName;
      propertyId = body.propertyId || null;
      propertyTitle = body.propertyTitle || null;
      inquiryType = 'propiedad';
    } else {
      // Formulario de contacto general
      const validation = validateContactForm(body);
      if (!validation.isValid) {
        return NextResponse.json(
          { success: false, error: validation.errors.join(', ') },
          { status: 400 }
        );
      }

      const mapped = mapContactFormToGHL({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        inquiryType: body.inquiryType,
        message: body.message,
      });

      firstName = body.firstName;
      lastName = body.lastName;
      email = body.email;
      phone = normalizeColombianPhone(body.phone);
      message = body.message;
      tags = mapped.tags;
      opportunityName = mapped.opportunityName;
      inquiryType = body.inquiryType || 'contacto';
    }

    let ghlContactId: string | null = null;
    let ghlOpportunityId: string | null = null;

    // Intentar crear lead en GoHighLevel
    try {
      const { contact, opportunity } = await createLead({
        firstName,
        lastName,
        email,
        phone,
        message,
        tags,
        opportunityName,
        source: 'Redbot Portal',
      });

      ghlContactId = contact.id || null;
      ghlOpportunityId = opportunity.id || null;

      console.log('Lead created in GHL:', {
        contactId: ghlContactId,
        opportunityId: ghlOpportunityId,
      });
    } catch (ghlError) {
      // Log el error pero no fallar - guardaremos en Supabase de todos modos
      console.error('Error creating lead in GHL:', ghlError);
      // Continuamos para guardar en Supabase aunque GHL falle
    }

    // Guardar en Supabase para historial
    try {
      const supabase = createAdminClient();

      // Mapear inquiryType a enum válido de la DB
      const validInquiryTypes = ['comprar', 'vender', 'arrendar', 'inversion', 'otro', 'property_inquiry'];
      const dbInquiryType = inquiryType && validInquiryTypes.includes(inquiryType)
        ? inquiryType
        : isPropertyForm ? 'property_inquiry' : 'otro';

      const { error: dbError } = await supabase.from('contact_submissions').insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || '',
        message,
        inquiry_type: dbInquiryType,
        property_id: propertyId,
        ghl_contact_id: ghlContactId,
        ghl_synced_at: ghlContactId ? new Date().toISOString() : null,
        source: 'website',
        status: ghlContactId ? 'sincronizado' : 'nuevo',
      });

      if (dbError) {
        console.error('Error saving to Supabase:', dbError);
        // No fallamos si Supabase tiene error, el lead ya está en GHL
      }
    } catch (dbError) {
      console.error('Error connecting to Supabase:', dbError);
      // Continuamos - el lead puede estar en GHL
    }

    // Respuesta exitosa
    return NextResponse.json({
      success: true,
      message: 'Formulario enviado correctamente. Nos pondremos en contacto pronto.',
      data: {
        contactId: ghlContactId,
        opportunityId: ghlOpportunityId,
      },
    });
  } catch (error) {
    console.error('Error processing contact form:', error);

    // Error genérico
    return NextResponse.json(
      {
        success: false,
        error: 'Error al procesar el formulario. Por favor intenta de nuevo.',
      },
      { status: 500 }
    );
  }
}
