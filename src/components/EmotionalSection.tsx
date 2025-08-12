import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Layers, Heart, Shield, Sparkles, Map, Scroll, Flame, Flag } from 'lucide-react';

const EmotionalSection = () => {
  const { language, isRTL } = useLanguage();

  const content = {
    en: {
      title: "The Impact of Your Journey",
      metrics: [
        { label: 'Cultural Insight', value: 'Deeper', icon: 'Layers' },
        { label: 'Personal Reflection', value: 'Stronger', icon: 'Heart' },
        { label: 'Respect for Heritage', value: 'Higher', icon: 'Shield' },
        { label: 'Inspiration', value: 'Lasting', icon: 'Sparkles' },
      ],
      timeline: [
        { title: 'Arrival', desc: 'Curiosity meets place', icon: 'Map' },
        { title: 'Immersion', desc: 'Stories come alive', icon: 'Scroll' },
        { title: 'Reflection', desc: 'Meaning takes root', icon: 'Flame' },
        { title: 'Advocacy', desc: 'You carry the story', icon: 'Flag' },
      ]
    },
    ar: {
      title: "أثر رحلتك",
      metrics: [
        { label: 'فهم ثقافي', value: 'أعمق', icon: 'Layers' },
        { label: 'تأمل شخصي', value: 'أقوى', icon: 'Heart' },
        { label: 'احترام للتراث', value: 'أعلى', icon: 'Shield' },
        { label: 'إلهام', value: 'مستمر', icon: 'Sparkles' },
      ],
      timeline: [
        { title: 'الوصول', desc: 'الفضول يلتقي بالمكان', icon: 'Map' },
        { title: 'الانغماس', desc: 'القصص تحيا', icon: 'Scroll' },
        { title: 'التأمل', desc: 'المعنى يتجذر', icon: 'Flame' },
        { title: 'الدفاع', desc: 'أنت تحمل القصة', icon: 'Flag' },
      ]
    }
  };

  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zM10 10c11.046 0 20 8.954 20 20s-8.954 20-20 20-20-8.954-20-20 8.954-20 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-section font-bold text-primary-foreground mb-12 ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {content[language].title}
          </h2>
        </div>

        {/* Metrics Row */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {content[language].metrics?.map((m: any, idx: number) => (
              <Card key={idx} className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/15 transition-all duration-300 animate-scale-in">
                <CardContent className={`p-6 text-center ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  <div className="mx-auto mb-3 inline-flex p-4 rounded-full bg-gradient-gold shadow-gold w-16 h-16 items-center justify-center">
                    {m.icon === 'Layers' && <Layers className="h-8 w-8 text-secondary-foreground" />}
                    {m.icon === 'Heart' && <Heart className="h-8 w-8 text-secondary-foreground" />}
                    {m.icon === 'Shield' && <Shield className="h-8 w-8 text-secondary-foreground" />}
                    {m.icon === 'Sparkles' && <Sparkles className="h-8 w-8 text-secondary-foreground" />}
                  </div>
                  <div className="text-primary-foreground/95 text-xl font-semibold">{m.value}</div>
                  <div className="text-primary-foreground/80 text-sm">{m.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline Row */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content[language].timeline?.map((step: any, i: number) => (
              <Card key={i} className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/15 transition-all duration-300 animate-slide-up">
                <CardContent className={`p-6 text-center ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  <div className="mx-auto mb-3 inline-flex p-4 rounded-full bg-gradient-primary shadow-glow w-16 h-16 items-center justify-center">
                    {step.icon === 'Map' && <Map className="h-8 w-8 text-primary-foreground" />}
                    {step.icon === 'Scroll' && <Scroll className="h-8 w-8 text-primary-foreground" />}
                    {step.icon === 'Flame' && <Flame className="h-8 w-8 text-primary-foreground" />}
                    {step.icon === 'Flag' && <Flag className="h-8 w-8 text-primary-foreground" />}
                  </div>
                  <div className="text-primary-foreground/95 font-semibold mb-1">{step.title}</div>
                  <div className="text-primary-foreground/80 text-sm">{step.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmotionalSection;