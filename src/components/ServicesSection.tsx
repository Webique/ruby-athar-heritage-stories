import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, BookOpen, Mountain } from 'lucide-react';
import fieldTripsImage from '@/assets/field-trips.jpg';
import storytellingImage from '@/assets/storytelling.jpg';
import culturalAdventureImage from '@/assets/cultural-adventure.jpg';

const ServicesSection = () => {
  const { language, isRTL } = useLanguage();

  const content = {
    en: {
      title: "Our Cultural Experiences",
      services: [
        {
          icon: MapPin,
          title: "Cultural Field Trips",
          description: "Guided explorations of historical sites, archaeological wonders, and cultural landmarks that bring Saudi heritage to life through expert storytelling.",
          image: fieldTripsImage
        },
        {
          icon: BookOpen,
          title: "Live Storytelling Experiences",
          description: "Immersive narrative sessions where ancient tales, legends, and historical events are brought to life by master storytellers.",
          image: storytellingImage
        },
        {
          icon: Mountain,
          title: "Cultural Adventure Programs",
          description: "Multi-day expeditions combining outdoor adventure with deep cultural immersion, featuring traditional practices and authentic experiences.",
          image: culturalAdventureImage
        }
      ]
    },
    ar: {
      title: "تجاربنا الثقافية",
      services: [
        {
          icon: MapPin,
          title: "رحلات ثقافية ميدانية",
          description: "استكشاف مُرشد للمواقع التاريخية والعجائب الأثرية والمعالم الثقافية التي تحيي التراث السعودي من خلال السرد المتخصص.",
          image: fieldTripsImage
        },
        {
          icon: BookOpen,
          title: "تجارب سردية حية",
          description: "جلسات سردية غامرة حيث تُحيا الحكايات القديمة والأساطير والأحداث التاريخية من خلال أساتذة الحكواتي.",
          image: storytellingImage
        },
        {
          icon: Mountain,
          title: "برامج مغامرة ذات طابع ثقافي",
          description: "رحلات استكشافية متعددة الأيام تجمع بين المغامرة الخارجية والانغماس الثقافي العميق، تتضمن الممارسات التقليدية والتجارب الأصيلة.",
          image: culturalAdventureImage
        }
      ]
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className={`text-section font-bold text-primary mb-8 ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {content[language].title}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {content[language].services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index} 
                className="group card-premium overflow-hidden"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <CardContent className="p-6">
                  <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="p-3 bg-gradient-gold rounded-lg shadow-gold">
                      <Icon className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <h3 className={`text-xl font-semibold text-primary ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {service.title}
                    </h3>
                  </div>
                  
                  <p className={`text-body text-muted-foreground leading-relaxed ${isRTL ? 'font-arabic text-right' : 'font-english'}`}>
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;