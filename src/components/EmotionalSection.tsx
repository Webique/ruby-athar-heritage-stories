import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const EmotionalSection = () => {
  const { language, isRTL } = useLanguage();

  const content = {
    en: {
      title: "The Impact of Your Journey",
      message: `When you return from an Athar Ruby experience, you won't just carry photos and souvenirs. You'll carry something far more valuable: a deep connection to a land and culture that many have never truly understood.

You'll find yourself defending the richness of Arabian heritage in conversations, sharing stories that fascinate your friends, and perhaps most importantly, you'll have gained a new perspective on what civilization, wisdom, and human legacy truly mean.

Our goal isn't just to show you places — it's to change how you see the world. To help you understand that every stone, every tradition, every story in this land carries the weight of centuries of human experience, wisdom, and dreams.

When you leave, you'll take with you not just memories, but a part of Arabia's soul — and you'll leave behind a part of your own, forever connecting you to this timeless land.`
    },
    ar: {
      title: "أثر رحلتك",
      message: `عندما تعود من تجربة مع "أثر روبي"، لن تحمل فقط الصور والهدايا التذكارية. ستحمل شيئاً أثمن بكثير: ارتباطاً عميقاً بأرض وثقافة لم يفهمها الكثيرون حق الفهم.

ستجد نفسك تدافع عن ثراء التراث العربي في المحادثات، وتشارك قصصاً تبهر أصدقاءك، والأهم من ذلك، ستكتسب منظوراً جديداً لما تعنيه الحضارة والحكمة والإرث الإنساني حقاً.

هدفنا ليس فقط أن نُريك أماكن — بل أن نغير طريقة رؤيتك للعالم. أن نساعدك على فهم أن كل حجر، وكل تقليد، وكل قصة في هذه الأرض تحمل ثقل قرون من التجربة الإنسانية والحكمة والأحلام.

عندما ترحل، ستأخذ معك ليس فقط الذكريات، بل جزءاً من روح العربية — وستترك خلفك جزءاً من روحك، مما يربطك إلى الأبد بهذه الأرض الخالدة.`
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
          
          <div className="space-y-8">
            <p className={`text-large text-primary-foreground/90 leading-relaxed ${isRTL ? 'font-arabic text-right' : 'font-english'}`}>
              {content[language].message}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmotionalSection;