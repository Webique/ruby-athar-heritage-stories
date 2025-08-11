import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutSection = () => {
  const { language, isRTL } = useLanguage();

  const content = {
    en: {
      title: "About Athar Ruby",
      introduction: {
        title: "Our Story",
        text: `Athar Ruby is not just a tourism company; it's a living gateway connecting people to the deep history of the Arabian Peninsula — through its forgotten stories, mysterious legends, and inspiring figures across time.

We believe Saudi Arabia holds treasures far deeper than sand and mountains, and that its heritage rivals civilizations like Babylon, the Pharaohs, and the Greeks. Our goal is to introduce the world to this richness through cultural experiences and live storytelling that let visitors live the story — not just read it.`
      },
      symbolism: {
        title: "The Name & Symbolism",
        text: `The name "Athar Ruby" carries double symbolism that reflects our deep mission. "Athar" means "traces" or "heritage" in Arabic — the marks left by those who came before us, the stories carved into stone and memory, the legacy that shapes who we are today.

"Ruby," the precious gemstone, represents the rare and valuable treasures we uncover — not gold or silver, but something far more precious: the stories, wisdom, and cultural heritage that have been polished by time into brilliant gems of human experience.

Together, "Athar Ruby" means "Heritage Gems" — the precious traces of our ancestors that we discover, polish, and present as living treasures for the world to experience and cherish.`
      }
    },
    ar: {
      title: "عن أثر روبي",
      introduction: {
        title: "قصتنا",
        text: `"أثر روبي" ليست مجرد شركة سياحية، بل هي بوابة حيّة تربط الناس بتاريخ شبه الجزيرة العربية العميق، من خلال قصصها المنسية، وأساطيرها الغامضة، وشخصياتها الملهمة عبر الزمن.

نحن نؤمن أن المملكة العربية السعودية غنية بما هو أعمق من الرمال والجبال، وأن تراثها يضاهي في قوته ما نعرفه عن حضارات بابل، والفراعنة، والإغريق. هدفنا هو أن نُعرّف العالم على هذا العمق من خلال تجارب ثقافية وسرد حيّ يجعل الزائر يعيش القصة، لا يقرأها فقط.`
      },
      symbolism: {
        title: "الاسم والرمزية",
        text: `اخترتُ اسم "أثر روبي" لأنه يحمل رمزية مزدوجة تعكس مهمتنا العميقة. "أثر" يعني البصمات التي تركها من سبقونا، القصص المحفورة في الحجر والذاكرة، الإرث الذي يشكل هويتنا اليوم.

"روبي" الحجر الكريم، يمثل الكنوز النادرة والثمينة التي نكتشفها — ليس ذهباً أو فضة، بل شيئاً أثمن بكثير: القصص والحكمة والتراث الثقافي الذي صقله الزمن ليصبح جواهر متألقة من التجربة الإنسانية.

معاً، "أثر روبي" يعني "جواهر التراث" — الآثار الثمينة لأجدادنا التي نكتشفها، ونصقلها، ونقدمها ككنوز حية ليختبرها العالم ويعتز بها.`
      }
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
          <div className="card-premium">
            <h3 className={`text-large font-semibold text-primary mb-6 ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {content[language].introduction.title}
            </h3>
            <p className={`text-body text-muted-foreground leading-relaxed ${isRTL ? 'font-arabic text-right' : 'font-english'}`}>
              {content[language].introduction.text}
            </p>
          </div>

          {/* Symbolism */}
          <div className="card-premium">
            <h3 className={`text-large font-semibold text-primary mb-6 ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {content[language].symbolism.title}
            </h3>
            <p className={`text-body text-muted-foreground leading-relaxed ${isRTL ? 'font-arabic text-right' : 'font-english'}`}>
              {content[language].symbolism.text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;