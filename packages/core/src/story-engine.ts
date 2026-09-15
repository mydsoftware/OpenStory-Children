import type { AgeBand, Book, Character, Page, StoryInput } from "./schemas.js";
import { BookSchema, StoryInputSchema } from "./schemas.js";

export interface StoryPlan { title: string; premise: string; moral: string; beats: string[]; }

function ageText(age: AgeBand) {
  return age === "2-3" ? "خیلی ساده و کوتاه" : age === "4-5" ? "ساده، شاد و قابل فهم" : age === "6-8" ? "ماجراجویانه و تصویری" : "داستانی، خلاقانه و کمی پیچیده‌تر";
}

export function planStory(raw: StoryInput): StoryPlan {
  const input = StoryInputSchema.parse(raw);
  const premise = input.idea.trim();
  const beats = [
    "معرفی قهرمان و خواسته او",
    "پیدا شدن یک مشکل کوچک",
    "تلاش قهرمان برای حل مشکل",
    "کمک گرفتن از یک دوست یا نشانه",
    "یک چالش هیجان‌انگیز اما امن",
    "پیدا کردن راه‌حل",
    "بازگشت شادی و آرامش",
    "پایان گرم و امیدبخش"
  ];
  return { title: "ماجراجویی کوچولوی رنگین‌کمان", premise, moral: "با مهربانی و کمک گرفتن از دوستان، حل کردن مشکل‌ها آسان‌تر می‌شود.", beats: beats.slice(0, Math.max(4, Math.min(8, input.pageCount))) };
}

function characterFromIdea(idea: string): Character {
  const dinosaur = /داین|دینو|dino|dinosaur/i.test(idea);
  const name = dinosaur ? "دینو" : "کوچولوی ما";
  return {
    id: dinosaur ? "character-dino" : "character-hero",
    name,
    description: dinosaur ? "یک داینوسور کوچولوی مهربان و کنجکاو" : "یک قهرمان کوچولوی مهربان و کنجکاو",
    visualTraits: dinosaur ? ["سبز", "کوچک", "چشم‌های بزرگ", "لبخند مهربان"] : ["رنگارنگ", "کوچک", "چشم‌های درشت", "لبخند مهربان"],
    version: 1
  };
}

export function generateStoryBook(rawInput: StoryInput): Book {
  const input = StoryInputSchema.parse(rawInput);
  const plan = planStory(input);
  const character = characterFromIdea(input.idea);
  const pages: Page[] = Array.from({ length: input.pageCount }, (_, i) => {
    const beat = plan.beats[i % plan.beats.length];
    const last = i === input.pageCount - 1;
    return {
      id: `page-${i + 1}`,
      pageNumber: i + 1,
      title: last ? "پایان شیرین" : beat,
      panels: [{
        id: `panel-${i + 1}-1`,
        narration: i === 0 ? `${plan.premise} ${ageText(input.ageBand)} روایت می‌شود.` : `${character.name} با آرامش به مرحله بعدی ماجرا می‌رسد: ${beat}.`,
        dialogue: i === 0 ? [`سلام! من ${character.name} هستم. بریم ماجراجویی!`] : last ? ["چه خوب که با هم کمک کردیم! 🌈"] : ["من می‌تونم از پسش بربیام!"],
        characterIds: [character.id]
      }]
    };
  });
  return BookSchema.parse({ id: `book-${Date.now()}`, title: plan.title, language: input.language, ageBand: input.ageBand, characters: [character], pages, sourceIdea: input.idea, schemaVersion: 1 });
}
