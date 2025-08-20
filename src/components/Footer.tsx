import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, Mail, Instagram, Twitter, Facebook, FileText, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Footer = () => {
  const { language, isRTL } = useLanguage();
  const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);

  const content = {
    en: {
      tagline: "Heritage Gems of Arabia",
      phone: "0573600158",
      email: "atharruby@outlook.com",
      copyright: "© 2024 Athar Ruby. All rights reserved.",
      developed: "Crafted with passion for Arabian heritage"
    },
    ar: {
      tagline: "جواهر التراث العربي",
      phone: "0573600158",
      email: "atharruby@outlook.com",
      copyright: "© 2024 أثر روبي. جميع الحقوق محفوظة.",
      developed: `صُنع بشغف للتراث العربي.

ومحبته العميقة.`
    }
  };

  return (
    <footer className="bg-gradient-primary text-primary-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          {/* Logo and Tagline */}
          <div className={`text-center lg:text-left ${isRTL ? 'lg:text-right' : ''}`}>
            <img 
              src="/lovable-uploads/c7c366f7-aedb-4844-ae65-e0744224b58a.png" 
              alt="Athar Ruby Logo" 
              className="h-16 w-auto mx-auto lg:mx-0 mb-4"
            />
            <p className={`text-lg font-medium ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {content[language].tagline}
            </p>
          </div>

          {/* Contact Information */}
          <div className="text-center">
            <div className="space-y-4">
              <div className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Phone className="h-5 w-5 text-secondary" />
                <a 
                  href={`tel:${content[language].phone}`}
                  className="hover:text-secondary transition-colors"
                  dir="ltr"
                >
                  {content[language].phone}
                </a>
              </div>
              
              <div className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Mail className="h-5 w-5 text-secondary" />
                <a 
                  href={`mailto:${content[language].email}`}
                  className="hover:text-secondary transition-colors"
                  dir="ltr"
                >
                  {content[language].email}
                </a>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className={`text-center lg:text-right ${isRTL ? 'lg:text-left' : ''}`}>
            <div className="flex items-center justify-center lg:justify-end gap-4 mb-4">
              <a href="#" className="p-2 bg-primary-foreground/10 hover:bg-secondary/20 rounded-full transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-primary-foreground/10 hover:bg-secondary/20 rounded-full transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-primary-foreground/10 hover:bg-secondary/20 rounded-full transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 my-8"></div>

        {/* Policies Button */}
        <div className="text-center mb-6">
          <Button
            onClick={() => setIsPoliciesOpen(true)}
            variant="outline"
            className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-secondary/20 hover:border-secondary/30"
          >
            <FileText className="h-4 w-4 mr-2" />
            {language === 'en' ? 'View Policies' : 'عرض السياسات'}
          </Button>
        </div>

        {/* Copyright */}
        <div className="text-center space-y-2">
          <p className={`text-sm ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {content[language].copyright}
          </p>
          <p className={`text-xs text-primary-foreground/70 ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {content[language].developed}
          </p>
        </div>
      </div>

      {/* Policies Modal */}
      <Dialog open={isPoliciesOpen} onOpenChange={setIsPoliciesOpen}>
        <DialogContent className={`max-w-[95vw] md:max-w-5xl max-h-[90vh] overflow-y-auto [&>button]:hidden mx-2 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4 md:pb-6 border-b border-border">
            <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="flex-1">
                <DialogTitle className={`text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-2 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {language === 'en' ? 'Athar Ruby Policies' : 'سياسات أثر روبي'}
                </DialogTitle>
                <p className={`text-sm md:text-base text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {language === 'en' ? 'Important information about our terms, cancellation policy, and safety guidelines' : 'معلومات مهمة حول شروطنا وسياسة الإلغاء وإرشادات السلامة'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPoliciesOpen(false)}
                className="h-8 w-8 md:h-10 md:w-10 p-0 rounded-full hover:bg-accent flex-shrink-0"
                aria-label={language === 'en' ? 'Close' : 'إغلاق'}
              >
                <X className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </DialogHeader>

          <div className="py-4 md:py-6">
            <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3 lg:gap-8">
              {/* General Terms */}
              <Card className="card-premium hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3 md:pb-4">
                  <div className={`flex items-center gap-2 md:gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <CardTitle className={`text-base md:text-lg font-bold text-primary ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {language === 'en' ? 'General Terms' : 'الشروط العامة'}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  <div className={`flex items-start gap-2 md:gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className={`text-xs md:text-sm text-muted-foreground leading-relaxed ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {language === 'en' ? 'Guests must arrive on time' : 'الالتزام بالحضور في الوقت المحدد'}
                    </p>
                  </div>
                  <div className={`flex items-start gap-2 md:gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className={`text-xs md:text-sm text-muted-foreground leading-relaxed ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {language === 'en' ? 'The company may modify or cancel the tour in case of unforeseen circumstances, with a full refund' : 'للشركة الحق في تعديل أو إلغاء الجولة عند حدوث ظروف طارئة، مع استرجاع المبلغ كاملًا'}
                    </p>
                  </div>
                  <div className={`flex items-start gap-2 md:gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className={`text-xs md:text-sm text-muted-foreground leading-relaxed ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {language === 'en' ? 'Prices include only what is mentioned in the experience description' : 'الأسعار تشمل ما هو مذكور فقط في وصف التجربة'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Cancellation Policy */}
              <Card className="card-premium hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3 md:pb-4">
                  <div className={`flex items-center gap-2 md:gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <CardTitle className={`text-base md:text-lg font-bold text-primary ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {language === 'en' ? 'Cancellation Policy' : 'سياسة الإلغاء'}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  <div className={`flex items-start gap-2 md:gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className={`text-xs md:text-sm text-muted-foreground leading-relaxed ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {language === 'en' ? 'Cancellation 48+ hours before = Full refund' : 'إلغاء قبل 48 ساعة = استرجاع كامل'}
                    </p>
                  </div>
                  <div className={`flex items-start gap-2 md:gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className={`text-xs md:text-sm text-muted-foreground leading-relaxed ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {language === 'en' ? 'Cancellation within 48 hours = 50% refund' : 'إلغاء أقل من 48 ساعة = خصم 50%'}
                    </p>
                  </div>
                  <div className={`flex items-start gap-2 md:gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className={`text-xs md:text-sm text-muted-foreground leading-relaxed ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {language === 'en' ? 'No-show = Non-refundable' : 'في حال عدم الحضور (No-show) لا يوجد استرجاع'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <Card className="card-premium hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3 md:pb-4">
                  <div className={`flex items-center gap-2 md:gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <CardTitle className={`text-base md:text-lg font-bold text-primary ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {language === 'en' ? 'Disclaimer' : 'إخلاء المسؤولية'}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`text-xs md:text-sm text-muted-foreground leading-relaxed ${isRTL ? 'font-arabic' : 'font-english'}`}>
                    {language === 'en' 
                      ? 'Athar Ruby is not responsible for loss of personal belongings or any personal injuries. Guests are advised to take care during the tour.'
                      : 'أثر روبي غير مسؤولة عن فقدان المقتنيات الشخصية أو أي إصابات فردية. ننصح عملاءنا بالحذر أثناء الجولة.'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;