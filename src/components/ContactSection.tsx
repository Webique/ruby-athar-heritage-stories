import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const content = {
    en: {
      title: "Begin Your Cultural Journey",
      subtitle: "Contact us to discover the hidden treasures of Arabian heritage",
      form: {
        name: "Your Name",
        email: "Your Email",
        message: "Tell us about your interests",
        submit: "Send Message"
      },
      contact: {
        phone: "Call Us",
        whatsapp: "WhatsApp",
        email: "Email Us",
        location: "Saudi Arabia"
      },
      success: "Thank you! We'll contact you soon to plan your cultural journey."
    },
    ar: {
      title: "ابدأ رحلتك الثقافية",
      subtitle: "تواصل معنا لاكتشاف كنوز التراث العربي المخفية",
      form: {
        name: "اسمك",
        email: "بريدك الإلكتروني",
        message: "أخبرنا عن اهتماماتك",
        submit: "إرسال الرسالة"
      },
      contact: {
        phone: "اتصل بنا",
        whatsapp: "واتساب",
        email: "راسلنا",
        location: "المملكة العربية السعودية"
      },
      success: "شكراً لك! سنتواصل معك قريباً لتخطيط رحلتك الثقافية."
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      return;
    }

    // Simulate form submission
    toast({
      title: content[language].success,
      duration: 5000,
    });

    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const phoneNumber = '+966504333581';
  const email = 'info@atharruby.com';

  return (
    <section className="py-20 bg-gradient-elegant">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className={`text-section font-bold text-primary mb-4 ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {content[language].title}
          </h2>
          <p className={`text-large text-muted-foreground max-w-2xl mx-auto ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {content[language].subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="card-premium">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium text-foreground mb-2 ${isRTL ? 'font-arabic text-right' : 'font-english'}`}>
                    {content[language].form.name}
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full ${isRTL ? 'text-right' : ''}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-foreground mb-2 ${isRTL ? 'font-arabic text-right' : 'font-english'}`}>
                    {content[language].form.email}
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full ${isRTL ? 'text-right' : ''}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-foreground mb-2 ${isRTL ? 'font-arabic text-right' : 'font-english'}`}>
                    {content[language].form.message}
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={5}
                    className={`w-full ${isRTL ? 'text-right' : ''}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    required
                  />
                </div>

                <Button type="submit" className="w-full btn-hero">
                  {content[language].form.submit}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Phone */}
            <Card className="card-premium">
              <CardContent className="p-6">
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="p-3 bg-gradient-primary rounded-lg">
                    <Phone className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h3 className={`font-semibold text-primary mb-1 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {content[language].contact.phone}
                    </h3>
                    <a 
                      href={`tel:${phoneNumber}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {phoneNumber}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp */}
            <Card className="card-premium">
              <CardContent className="p-6">
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="p-3 bg-gradient-gold rounded-lg">
                    <MessageCircle className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h3 className={`font-semibold text-primary mb-1 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {content[language].contact.whatsapp}
                    </h3>
                    <a 
                      href={`https://wa.me/${phoneNumber.replace(/[+\s]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {phoneNumber}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email */}
            <Card className="card-premium">
              <CardContent className="p-6">
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="p-3 bg-gradient-primary rounded-lg">
                    <Mail className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h3 className={`font-semibold text-primary mb-1 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {content[language].contact.email}
                    </h3>
                    <a 
                      href={`mailto:${email}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="card-premium">
              <CardContent className="p-6">
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="p-3 bg-gradient-gold rounded-lg">
                    <MapPin className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h3 className={`font-semibold text-primary mb-1 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {content[language].contact.location}
                    </h3>
                    <p className={`text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {content[language].contact.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;