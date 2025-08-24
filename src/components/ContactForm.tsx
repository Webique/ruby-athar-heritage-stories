import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiClient, ContactFormData } from '@/lib/api';
import { Send } from 'lucide-react';

const ContactForm = () => {
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    language: language
  });

  const content = {
    en: {
      title: "Get in Touch",
      subtitle: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number (Optional)",
      message: "Your Message",
      submit: "Send Message",
      submitting: "Sending...",
      success: "Message sent successfully!",
      error: "Failed to send message. Please try again.",
      required: "This field is required"
    },
    ar: {
      title: "تواصل معنا",
      subtitle: "نود أن نسمع منك. أرسل لنا رسالة وسنرد عليك في أقرب وقت ممكن.",
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف (اختياري)",
      message: "رسالتك",
      submit: "إرسال الرسالة",
      submitting: "جاري الإرسال...",
      success: "تم إرسال الرسالة بنجاح!",
      error: "فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.",
      required: "هذا الحقل مطلوب"
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: content[language].error,
        description: content[language].required,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient.submitContact({
        ...formData,
        language
      });

      if (response.success) {
        toast({
          title: content[language].success,
          description: "We'll get back to you soon!",
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          language
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      toast({
        title: content[language].error,
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className={`text-2xl font-bold text-primary mb-2 ${isRTL ? 'font-arabic' : 'font-english'}`}>
          {content[language].title}
        </h3>
        <p className={`text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>
          {content[language].subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className={`text-sm ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {content[language].name} *
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              className={`${isRTL ? 'text-right' : 'text-left'}`}
              dir={isRTL ? 'rtl' : 'ltr'}
              placeholder={isRTL ? 'أدخل اسمك الكامل' : 'Enter your full name'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className={`text-sm ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {content[language].email} *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className={`${isRTL ? 'text-right' : 'text-left'}`}
              dir={isRTL ? 'rtl' : 'ltr'}
              placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email address'}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className={`text-sm ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {content[language].phone}
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            className={`${isRTL ? 'text-right' : 'text-left'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
            placeholder={isRTL ? 'أدخل رقم هاتفك' : 'Enter your phone number'}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className={`text-sm ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {content[language].message} *
          </Label>
          <Textarea
            id="message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleInputChange}
            className={`${isRTL ? 'text-right' : 'font-english'} resize-none`}
            dir={isRTL ? 'rtl' : 'ltr'}
            placeholder={isRTL ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full btn-primary text-lg py-3"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {content[language].submitting}
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              {content[language].submit}
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
