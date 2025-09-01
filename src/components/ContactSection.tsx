import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';
import ContactForm from './ContactForm';

const ContactSection = () => {
  const { language, isRTL } = useLanguage();

  const content = {
    en: {
      title: "Begin Your Cultural Journey",
      subtitle: "Contact us to discover the hidden treasures of Arabian heritage",
      contact: {
        phone: "Call Us",
        whatsapp: "WhatsApp",
        email: "Email Us",
        location: "Saudi Arabia"
      },
      success: "Thank you! We'll contact you soon to plan your cultural journey."
    },
    ar: {
      title: "ابدأ تجربتك",
      subtitle: "",
      contact: {
        phone: "اتصل بنا",
        whatsapp: "واتساب",
        email: "راسلنا",
        location: "المملكة العربية السعودية"
      },
      success: `شكراً لك! سنتواصل معك قريباً.

لتخطيط رحلتك الثقافية.`
    }
  };

  const phoneNumber = '+966573600158';
  const email = 'atharruby@outlook.com';

  return (
    <section className="py-20 bg-gradient-contact">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className={`text-section font-bold text-primary mb-4 ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {content[language].title}
          </h2>
          <p className={`text-large text-muted-foreground max-w-2xl mx-auto ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {content[language].subtitle}
          </p>
        </div>

        {/* Contact Form */}
        <div className="mb-16">
          <ContactForm />
        </div>

        {/* Quick Contact Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Phone */}
          <Card className="card-premium">
            <CardContent className="p-6">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 bg-gradient-primary rounded-lg flex-shrink-0 mt-1">
                  <Phone className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className={`${isRTL ? 'text-right' : 'text-left'} flex-1`}>
                  <h3 className={`font-semibold text-primary mb-1 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                    {content[language].contact.phone}
                  </h3>
                  <a 
                    href={`tel:${phoneNumber}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    dir="ltr"
                  >
                    +966 57 360 0158
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp */}
          <Card className="card-premium">
            <CardContent className="p-6">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 bg-gradient-gold rounded-lg flex-shrink-0 mt-1">
                  <MessageCircle className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div className={`${isRTL ? 'text-right' : 'text-left'} flex-1`}>
                  <h3 className={`font-semibold text-primary mb-1 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                    {content[language].contact.whatsapp}
                  </h3>
                  <a 
                    href={`https://wa.me/${phoneNumber.replace(/[+\s]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    dir="ltr"
                  >
                    +966 57 360 0158
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email */}
          <Card className="card-premium">
            <CardContent className="p-6">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 bg-gradient-primary rounded-lg flex-shrink-0 mt-1">
                  <Mail className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className={`${isRTL ? 'text-right' : 'text-left'} flex-1`}>
                  <h3 className={`font-semibold text-primary mb-1 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                    {content[language].contact.email}
                  </h3>
                  <a 
                    href={`mailto:${email}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    dir="ltr"
                  >
                    {email}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* X (Twitter) */}
          <Card className="card-premium">
            <CardContent className="p-6">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 bg-gradient-primary rounded-lg flex-shrink-0 mt-1">
                  <svg className="h-6 w-6 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <div className={`${isRTL ? 'text-right' : 'text-left'} flex-1`}>
                  <h3 className={`font-semibold text-primary mb-1 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                    {language === 'en' ? 'Follow Us' : 'تابعنا'}
                  </h3>
                  <a 
                    href="https://x.com/atharruby?s=11"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    dir="ltr"
                  >
                    @atharruby
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;