import type { Asset, Book, Character, Page, Panel } from "./schemas.js";
import type { ImageProvider } from "./providers.js";
import { BookSchema } from "./schemas.js";
import { DEFAULT_NEGATIVE_PROMPT, defaultImagePrompt } from "./comfyui-workflow.js";
export interface ImageGenerationResult{book:Book;generatedAssetIds:string[];failures:string[];}
function seedFor(value:string){let h=2166136261;for(const c of value)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
function characterPrompt(character:Character,style:string){return [style,"character reference sheet, single child-safe character, centered full body",character.name,character.description,character.appearance,character.personality,character.clothing,"colors: "+character.colors.join(", "),character.consistencyNotes].filter(Boolean).join(". ");}
export async function generateCharacterReferences(book:Book,provider:ImageProvider):Promise<{book:Book;failures:string[]}>{
 const assets=[...book.assets],failures:string[]=[];const chars=book.characters.map(c=>({...c,referenceAssetIds:[...c.referenceAssetIds]}));
 for(let i=0;i<chars.length;i++){const character=chars[i]!;if(character.referenceAssetIds.length)continue;try{
  const result=await provider.generate({prompt:characterPrompt(character,book.visualStyle),negativePrompt:DEFAULT_NEGATIVE_PROMPT,seed:seedFor(book.id+"|character|"+character.id),width:512,height:512,steps:22,cfg:6.5,sampler:"dpmpp_2m",scheduler:"karras"});
  const asset:Asset={id:result.assetId,type:"character-reference",url:result.url,prompt:characterPrompt(character,book.visualStyle),characterId:character.id,providerId:provider.metadata.id,createdAt:new Date().toISOString()};
  assets.push(asset);character.referenceAssetIds=[asset.id];character.referenceImage=result.url;character.referenceImages=[result.url];
 }catch(error){failures.push("character "+character.id+": "+(error instanceof Error?error.message:String(error)));}}
 return {book:BookSchema.parse({...book,characters:chars,assets}),failures};
}
function panelCharacters(book:Book,panel:Panel){return panel.characterIds.map(id=>book.characters.find(c=>c.id===id)).filter((c):c is Character=>Boolean(c));}
async function generatePanel(book:Book,page:Page,panel:Panel,provider:ImageProvider,assets:Asset[],generated:string[]):Promise<void>{
 const characters=panelCharacters(book,panel);const references=characters.flatMap(c=>c.referenceAssetIds.map(id=>assets.find(a=>a.id===id)?.url).filter((x):x is string=>Boolean(x)));
 const prompt=panel.imagePrompt||defaultImagePrompt(page,characters,book.visualStyle);const negative=panel.negativePrompt||page.negativePrompt||DEFAULT_NEGATIVE_PROMPT;
 const seed=panel.seed??seedFor(book.id+"|page|"+page.id+"|panel|"+panel.id);panel.seed=seed;panel.imagePrompt=prompt;panel.negativePrompt=negative;panel.references=references;panel.generationStatus="generating";panel.generationError=undefined;panel.qaStatus="pending";
 try{const result=await provider.generate({prompt,references,negativePrompt:negative,seed,width:512,height:512,steps:22,cfg:6.5,sampler:"dpmpp_2m",scheduler:"karras",ipAdapterWeight:.75});assets.push({id:result.assetId,type:"page-art",url:result.url,prompt,providerId:provider.metadata.id,createdAt:new Date().toISOString()});panel.assetIds=[result.assetId];panel.generatedImage=result.url;panel.generationStatus="completed";panel.qaStatus="ready";generated.push(result.assetId);}
 catch(error){panel.generationStatus="failed";panel.generationError=error instanceof Error?error.message:String(error);throw error;}
}
export async function generateBookImages(book:Book,provider:ImageProvider):Promise<ImageGenerationResult>{
 const ref=await generateCharacterReferences(book,provider);if(ref.failures.length)return{book:ref.book,generatedAssetIds:[],failures:ref.failures};
 const assets=[...ref.book.assets],generatedAssetIds:string[]=[],failures:string[]=[];
 for(const page of ref.book.pages){page.characterIds=[...new Set(page.panels.flatMap(p=>p.characterIds))];page.references=page.characterIds.flatMap(id=>ref.book.characters.find(c=>c.id===id)?.referenceAssetIds??[]).map(id=>assets.find(a=>a.id===id)?.url).filter((x):x is string=>Boolean(x));page.imagePrompt=defaultImagePrompt(page,panelCharacters(ref.book,page.panels[0]!),ref.book.visualStyle);page.negativePrompt=DEFAULT_NEGATIVE_PROMPT;page.seed=seedFor(ref.book.id+"|page|"+page.id);page.generationStatus="generating";try{for(const panel of page.panels)await generatePanel(ref.book,page,panel,provider,assets,generatedAssetIds);page.generatedImage=page.panels[0]?.generatedImage;page.generationStatus="completed";page.qaStatus="ready";}catch(error){page.generationStatus="failed";page.generationError=error instanceof Error?error.message:String(error);failures.push("page "+page.pageNumber+": "+page.generationError);}}
 return{book:BookSchema.parse({...ref.book,assets}),generatedAssetIds,failures};
}
export async function repairFailedBookImages(book:Book,provider:ImageProvider,maxPages=1):Promise<ImageGenerationResult>{
 const assets=[...book.assets],generatedAssetIds:string[]=[],failures:string[]=[];let repaired=0;
 for(const page of book.pages){if(repaired>=maxPages)break;if(page.generationStatus!=="failed")continue;page.generationStatus="repairing";try{for(const panel of page.panels)if(panel.generationStatus==="failed"||panel.assetIds.length===0)await generatePanel(book,page,panel,provider,assets,generatedAssetIds);page.generatedImage=page.panels[0]?.generatedImage;page.generationStatus="completed";page.qaStatus="ready";repaired++;}catch(error){page.generationStatus="failed";page.generationError=error instanceof Error?error.message:String(error);failures.push("repair page "+page.pageNumber+": "+page.generationError);}}
 return{book:BookSchema.parse({...book,assets}),generatedAssetIds,failures};
}
