import type { Book } from "./schemas.js";
export interface QAResult{ok:boolean;errors:string[];warnings:string[];score:number;}
const unsafePatterns=[/خودکشی/i,/مواد مخدر/i,/پورنو/i,/porn/i];
export function validateBook(book:Book):QAResult{
 const errors:string[]=[],warnings:string[]=[];if(!book.title.trim())errors.push("عنوان کتاب خالی است.");if(!book.pages.length)errors.push("کتاب باید حداقل یک صفحه داشته باشد.");
 const characterIds=new Set(book.characters.map(c=>c.id)),assetIds=new Set(book.assets.map(a=>a.id)),characterById=new Map(book.characters.map(c=>[c.id,c]));\n const warnedReferenceCharacters=new Set<string>();
 for(const asset of book.assets){if(asset.characterId&&!characterIds.has(asset.characterId))errors.push(`شخصیت ${asset.characterId} برای دارایی ${asset.id} تعریف نشده است.`);}
 for(const character of book.characters)for(const assetId of character.referenceAssetIds){const asset=book.assets.find(a=>a.id===assetId);if(!asset)errors.push(`دارایی مرجع ${assetId} برای شخصیت ${character.id} پیدا نشد.`);else if(asset.characterId&&asset.characterId!==character.id)errors.push(`دارایی مرجع ${assetId} به شخصیت دیگری متصل است.`);else if(asset.type!=="character-reference")warnings.push(`دارایی ${assetId} برای ${character.name} نوع character-reference ندارد.`);}
 for(const page of book.pages){if(page.pageNumber<1)errors.push(`شماره صفحه ${page.id} نامعتبر است.`);const pageChars=new Set(page.characterIds);for(const panel of page.panels){
   for(const id of panel.characterIds){if(!characterIds.has(id))errors.push(`شخصیت ${id} در ${panel.id} تعریف نشده است.`);if(!pageChars.has(id))errors.push(`شخصیت ${id} در متادیتای صفحه ${page.pageNumber} ثبت نشده است.`);}
   for(const assetId of panel.assetIds)if(!assetIds.has(assetId))errors.push(`دارایی ${assetId} در ${panel.id} تعریف نشده است.`);
   if(panel.generationStatus==="completed"&&(!panel.generatedImage||panel.assetIds.length===0))errors.push(`تصویر خروجی پنل ${panel.id} ثبت نشده است.`);
   if(panel.characterIds.length&&!panel.references.length)for(const characterId of panel.characterIds)if(!warnedReferenceCharacters.has(characterId)){warnings.push(`شخصیت ${characterById.get(characterId)?.name??characterId} هیچ مرجع تصویری ندارد.`);warnedReferenceCharacters.add(characterId);}
 }
 if(page.generationStatus==="completed"&&(!page.generatedImage||!page.imagePrompt))errors.push(`تصویر یا prompt صفحه ${page.pageNumber} ناقص است.`);
 for(const id of page.characterIds)if(!characterIds.has(id))errors.push(`شخصیت ${id} در صفحه ${page.pageNumber} تعریف نشده است.`);
 const text=[page.title,...page.panels.flatMap(p=>[p.narration,...p.dialogue])].join(" ");if(unsafePatterns.some(p=>p.test(text)))errors.push(`محتوای نامناسب کودک در صفحه ${page.pageNumber} شناسایی شد.`);if(text.length>1200)warnings.push(`متن صفحه ${page.pageNumber} برای کتاب کودک طولانی است.`);
 }
 const duplicatePages=new Set(book.pages.map(p=>p.pageNumber)).size!==book.pages.length;if(duplicatePages)errors.push("شماره صفحات تکراری است.");
 const score=Math.max(0,Math.round(100-errors.length*20-warnings.length*5));return{ok:errors.length===0,errors,warnings,score};
}
export function repairBook(book:Book):Book{return{...book,pages:book.pages.map((page,i)=>({...page,pageNumber:i+1}))};}
