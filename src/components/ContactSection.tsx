import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';

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

  const phoneNumber = '0573600158';
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

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
                    {phoneNumber}
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
                    {phoneNumber}
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

          {/* Location */}
          <Card className="card-premium">
            <CardContent className="p-6">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 bg-gradient-gold rounded-lg flex-shrink-0 mt-1">
                  <MapPin className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div className={`${isRTL ? 'text-right' : 'text-left'} flex-1`}>
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
    </section>
  );
};

export default ContactSection;