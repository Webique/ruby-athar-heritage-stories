import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, BookOpen, Mountain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import fieldTripsImage from '@/assets/field-trips.jpg';
import storytellingImage from '@/assets/storytelling.jpg';
import culturalAdventureImage from '@/assets/cultural-adventure.jpg';

const ServicesSection = () => {
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();

  const handleServiceClick = () => {
    navigate('/journey');
    // Scroll to top of the page after navigation with responsive behavior
    const isMobile = window.innerWidth < 768; // md breakpoint
    const scrollPosition = isMobile ? 50 : 150;
    window.scrollTo(0, scrollPosition);
  };

  const content = {
    en: {
      title: "Our Cultural Experiences",
      services: [
        {
          icon: MapPin,
          title: "Cultural Field Trips",
          description: "Explorations of historical sites, archaeological wonders, and cultural landmarks.",
          image: fieldTripsImage
        },
        {
          icon: BookOpen,
          title: "Live Storytelling Experiences",
          description: "Immersive narrative sessions where ancient tales, legends, and historical events are brought to life.",
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
      title: "تجاربنا",
      services: [
        {
          icon: MapPin,
          title: "على خطى التاريخ",
          description: `استكشاف للمواقع التاريخية والعجائب الأثرية والمعالم الثقافية.`,
          image: fieldTripsImage
        },
        {
          icon: BookOpen,
          title: "حكايات على الطريق",
          description: `جلسات سردية غامرة حيث تُحيا الحكايات القديمة والأساطير والأحداث التاريخية.`,
          image: storytellingImage
        },
        {
          icon: Mountain,
          title: "مغامرات بروح ثقافية",
          description: `رحلات استكشافية متعددة الأيام تجمع بين المغامرة الخارجية والانغماس الثقافي العميق.

تتضمن الممارسات التقليدية والتجارب الأصيلة.`,
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
                className="group card-premium overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 0.2}s` }}
                onClick={handleServiceClick}
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