import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Gem, BookOpen, Compass, Landmark, Users, Globe2 } from 'lucide-react';

const AboutSection = () => {
  const { language, isRTL } = useLanguage();

  const content = {
    en: {
      title: "About Athar Ruby",
      introduction: {
        title: "Our Story",
        sections: [
          {
            text: `Athar Ruby is not just a tourism company; it's a living gateway connecting people to the deep history of the Arabian Peninsula. Through its forgotten stories, mysterious legends, and inspiring figures across time.`,
            design: 'primary'
          },
          {
            text: `We believe Saudi Arabia holds treasures far deeper than sand and mountains. And that its heritage rivals civilizations like Babylon, the Pharaohs, and the Greeks.`,
            design: 'secondary'
          },
          {
            text: `Our goal is to introduce the world to this richness through cultural experiences and live storytelling that let visitors live the story — not just read it.`,
            design: 'accent'
          }
        ]
      },
      symbolism: {
        title: "The Name & Symbolism",
        text: `The name "Athar Ruby" carries double symbolism that reflects our deep mission. "Athar" means "traces" or "heritage" in Arabic — the marks left by those who came before us, the stories carved into stone and memory, the legacy that shapes who we are today.

"Ruby," the precious gemstone, represents the rare and valuable treasures we uncover — not gold or silver, but something far more precious: the stories, wisdom, and cultural heritage that have been polished by time into brilliant gems of human experience.

Together, "Athar Ruby" means "Heritage Gems" — the precious traces of our ancestors that we discover, polish, and present as living treasures for the world to experience and cherish.`
      },
      featuresTitle: 'What Makes Us Different',
      features: [
        { title: 'Heritage Gems', desc: 'Rare stories curated like precious rubies.', icon: 'Gem' },
        { title: 'Live Storytelling', desc: 'Immersive narratives you can feel and remember.', icon: 'BookOpen' },
        { title: 'Guided Discovery', desc: 'Thoughtful routes across authentic cultural sites.', icon: 'Compass' },
        { title: 'Historic Depth', desc: 'From petroglyphs to trade routes and beyond.', icon: 'Landmark' },
        { title: 'Human Connection', desc: 'Local experts, artists, and storytellers.', icon: 'Users' },
        { title: 'Global Welcome', desc: 'Crafted for both local and international guests.', icon: 'Globe2' },
      ],
      stats: [
        { label: 'Years of Passion', value: '10+' },
        { label: 'Experiences Crafted', value: '120+' },
        { label: 'Historic Sites', value: '60+' },
        { label: 'Languages', value: '2' },
      ]
    },
    ar: {
      title: "عن أثر روبي",
      introduction: {
        title: "القصة",
        sections: [
          {
            text: `"أثر روبي" ليست مجرد شركة سياحية، بل هي بوابة حيّة تربط الناس بتاريخ شبه الجزيرة العربية العميق. من خلال قصصها المنسية، وأساطيرها الغامضة، وشخصياتها الملهمة عبر الزمن.`,
            design: 'primary'
          },
          {
            text: `نحن نؤمن أن المملكة العربية السعودية غنية بما هو أعمق من الرمال والجبال. وأن تراثها يضاهي في قوته ما نعرفه عن حضارات بابل، والفراعنة، والإغريق.`,
            design: 'secondary'
          },
          {
            text: `هدفنا هو أن نُعرّف العالم على هذا العمق من خلال تجارب ثقافية وسرد حيّ يجعل الزائر يعيش القصة، لا يقرأها فقط.`,
            design: 'accent'
          }
        ]
      },
      symbolism: {
        title: "لماذا أثر روبي",
        text: `"أثر" يشير إلى التاريخ، البصمة، والامتداد العميق الذي نُحييه عبر القصص، والأماكن، والشخصيات.

"روبي" حجر كريم أحمر يرمز إلى القيمة والندرة والجمال الدفين.

تمامًا كحكايات تراثنا التي لم تُكتشف بعد.

الاسم يعكس أن التراث العربي السعودي ليس شيئًا باهتًا أو عابرًا.

بل كنز ثمين يجب أن يُكشف ويُقدَّم للعالم كتحفة ثقافية.`
      },
      featuresTitle: 'لماذا نحن مختلفون',
      features: [
        { title: 'جواهر التراث', desc: `قصص نادرة نصونها كالأحجار الكريمة.

ونحافظ عليها للأجيال القادمة.`, icon: 'Gem' },
        { title: 'سرد حي', desc: `حكايات غامرة تعيشها وتبقى في الذاكرة.

تجربة لا تُنسى.`, icon: 'BookOpen' },
        { title: 'اكتشاف موجه', desc: `مسارات مدروسة عبر مواقع ثقافية أصيلة.

مع خبراء متخصصين.`, icon: 'Compass' },
        { title: 'عمق تاريخي', desc: `من النقوش الصخرية إلى طرق التجارة وما بعدها.

تاريخ يمتد لآلاف السنين.`, icon: 'Landmark' },
        { title: 'صلة إنسانية', desc: `خبراء محليون وفنانون ورواة.

يربطونك بالتراث الحي.`, icon: 'Users' },
        { title: 'ترحيب عالمي', desc: `مصمم للزوار المحليين والدوليين معًا.

تجربة تناسب الجميع.`, icon: 'Globe2' },
      ],
      stats: [
        { label: 'سنوات من الشغف', value: '10+' },
        { label: 'تجارب مُعدّة', value: '120+' },
        { label: 'مواقع تاريخية', value: '60+' },
        { label: 'لغات', value: '2+' },
      ]
    }
  };

  return (
    <section className="py-20 bg-gradient-elegant">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className={`text-section font-bold text-primary mb-8 ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {content[language].title}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Introduction */}
          <div className="space-y-6">
            <h3 className={`text-large font-semibold text-primary mb-6 ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {content[language].introduction.title}
            </h3>
            
            {language === 'ar' ? (
              // Arabic sections with different designs
              <div className="space-y-8">
                {content[language].introduction.sections.map((section, idx) => (
                  <div 
                    key={idx} 
                    className={`p-8 rounded-2xl transition-all duration-500 hover:scale-105 ${
                      section.design === 'primary' ? 'bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-600 shadow-lg' :
                      section.design === 'secondary' ? 'bg-gradient-to-r from-slate-50 to-slate-100 border-l-4 border-slate-600 shadow-lg' :
                      section.design === 'accent' ? 'bg-gradient-to-r from-rose-50 to-rose-100 border-l-4 border-rose-600 shadow-lg' :
                      'bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-600 shadow-lg'
                    }`}
                  >
                    <p className={`text-body text-gray-800 leading-relaxed font-arabic text-right`}>
                      {section.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              // English sections with different designs
              <div className="space-y-8">
                {content[language].introduction.sections.map((section, idx) => (
                  <div 
                    key={idx} 
                    className={`p-8 rounded-2xl transition-all duration-500 hover:scale-105 ${
                      section.design === 'primary' ? 'bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-600 shadow-lg' :
                      section.design === 'secondary' ? 'bg-gradient-to-r from-slate-50 to-slate-100 border-l-4 border-slate-600 shadow-lg' :
                      section.design === 'accent' ? 'bg-gradient-to-r from-rose-50 to-rose-100 border-l-4 border-rose-600 shadow-lg' :
                      'bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-600 shadow-lg'
                    }`}
                  >
                    <p className={`text-body text-gray-800 leading-relaxed font-english`}>
                      {section.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Symbolism */}
          <div className="card-premium animate-fade-in">
            <h3 className={`text-large font-semibold text-primary mb-6 ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {content[language].symbolism.title}
            </h3>
            <p className={`text-body text-muted-foreground leading-relaxed ${isRTL ? 'font-arabic text-right' : 'font-english'}`}>
              {content[language].symbolism.text}
            </p>
          </div>
        </div>

        {/* Feature Icons */}
        <div className="max-w-6xl mx-auto mt-16">
          <h3 className={`text-large font-semibold text-primary mb-8 text-center ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {content[language].featuresTitle}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {content[language].features.map((feature, idx) => (
              <Card key={idx} className="card-premium animate-scale-in">
                <CardContent className={`p-6 flex items-start gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="p-3 rounded-lg bg-gradient-gold shadow-gold">
                    {feature.icon === 'Gem' && <Gem className="h-6 w-6 text-secondary-foreground" />}
                    {feature.icon === 'BookOpen' && <BookOpen className="h-6 w-6 text-secondary-foreground" />}
                    {feature.icon === 'Compass' && <Compass className="h-6 w-6 text-secondary-foreground" />}
                    {feature.icon === 'Landmark' && <Landmark className="h-6 w-6 text-secondary-foreground" />}
                    {feature.icon === 'Users' && <Users className="h-6 w-6 text-secondary-foreground" />}
                    {feature.icon === 'Globe2' && <Globe2 className="h-6 w-6 text-secondary-foreground" />}
                  </div>
                  <div>
                    <h4 className={`font-semibold text-primary mb-1 ${isRTL ? 'font-arabic' : 'font-english'}`}>{feature.title}</h4>
                    <p className={`text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>{feature.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Strip */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {content[language].stats.map((stat, i) => (
              <div key={i} className="rounded-xl bg-card border border-border p-6 text-center shadow-elegant hover:shadow-glow transition-all duration-300 animate-slide-up">
                <div className={`text-2xl font-bold text-primary mb-1 ${isRTL ? 'font-arabic' : 'font-english'}`}>{stat.value}</div>
                <div className={`text-sm text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
          {language === 'ar' && (
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground font-arabic">
                * الأرقام مبنية على خبرتنا المتراكمة والتقييمات المستمرة
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;