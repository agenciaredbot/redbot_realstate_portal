'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface InquiryType {
  value: string;
  label: string;
}

interface ContactFormProps {
  inquiryTypes?: InquiryType[];
  onSubmit?: (data: ContactFormData) => Promise<void>;
  className?: string;
  showInquiryType?: boolean;
  submitLabel?: string;
  defaultMessage?: string;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  inquiryType?: string;
  message: string;
}

const defaultInquiryTypes: InquiryType[] = [
  { value: 'comprar', label: 'Quiero comprar una propiedad' },
  { value: 'vender', label: 'Quiero vender mi propiedad' },
  { value: 'arrendar', label: 'Busco arriendo' },
  { value: 'inversion', label: 'Asesoria de inversion' },
  { value: 'otro', label: 'Otro' },
];

export function ContactForm({
  inquiryTypes = defaultInquiryTypes,
  onSubmit,
  className,
  showInquiryType = true,
  submitLabel = 'Enviar Mensaje',
  defaultMessage = '',
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: defaultMessage,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default behavior: POST to API endpoint
        const response = await fetch('/api/contact/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al enviar el formulario');
        }
      }

      // Reset form on success
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        inquiryType: '',
        message: '',
      });
      setIsSubmitted(true);

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      // TODO: Show error toast/message
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={cn('text-center py-12', className)}>
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-luxus-dark mb-2">
          ¡Mensaje Enviado!
        </h3>
        <p className="text-luxus-gray">
          Gracias por contactarnos. Te responderemos pronto.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-5', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-luxus-dark mb-1">
            Nombre *
          </label>
          <Input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Tu nombre"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-luxus-dark mb-1">
            Apellido *
          </label>
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Tu apellido"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-luxus-dark mb-1">
            Email *
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-luxus-dark mb-1">
            Telefono *
          </label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+57 300 000 0000"
            required
          />
        </div>
      </div>

      {showInquiryType && (
        <div>
          <label className="block text-sm font-medium text-luxus-dark mb-1">
            Tipo de Consulta *
          </label>
          <Select
            value={formData.inquiryType}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, inquiryType: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una opcion" />
            </SelectTrigger>
            <SelectContent>
              {inquiryTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-luxus-dark mb-1">
          Mensaje *
        </label>
        <Textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Cuentanos como podemos ayudarte..."
          rows={5}
          className="resize-none"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-luxus-gold hover:bg-luxus-gold-dark text-white"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            {submitLabel}
          </>
        )}
      </Button>

      <p className="text-xs text-luxus-gray text-center">
        Al enviar este formulario, aceptas nuestra{' '}
        <a href="#" className="text-luxus-gold hover:underline">
          Politica de Privacidad
        </a>
      </p>
    </form>
  );
}

export default ContactForm;
