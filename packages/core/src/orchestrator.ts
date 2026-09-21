import type { Book, StoryInput } from "./schemas.js";
import { generateWithFallback } from "./ai-story-engine.js";
import { generateBookImages, repairFailedBookImages } from "./image-generation.js";
import { validateBook, repairBook, type QAResult } from "./qa.js";
import type { BookStore } from "./book-store.js";
import type { ImageProvider, LLMProvider } from "./providers.js";
export type JobStatus="queued"|"running"|"completed"|"failed"; export type JobStage="generation"|"image"|"qa"|"persistence"|"unknown";
export type JobErrorCode="GENERATION_FAILED"|"IMAGE_FAILED"|"QA_FAILED"|"PERSISTENCE_FAILED"|"PROVIDER_FAILED"|"UNKNOWN";
export interface JobError{code:JobErrorCode;message:string;stage:JobStage;retryable:boolean;providerId?:string;cause?:string;}
export interface GenerationJob{id:string;status:JobStatus;stage:JobStage;input:StoryInput;bookId?:string;qa?:QAResult;error?:JobError;usedFallback?:boolean;}
export interface BookCreationProviders{llm?:LLMProvider;image?:ImageProvider;}
function toJobError(error:unknown,stage:JobStage,providerId?:string):JobError{const message=error instanceof Error?error.message:String(error);const providerFailure=/provider|ollama|comfyui|lmstudio|openai-compatible|HTTP \d|fetch|timeout|network|connection/i.test(message);const retryable=providerFailure||stage==="persistence"||/temporar|abort|429|502|503/i.test(message);const code:JobErrorCode=stage==="image"?"IMAGE_FAILED":stage==="persistence"?"PERSISTENCE_FAILED":stage==="qa"?"QA_FAILED":providerFailure?"PROVIDER_FAILED":stage==="generation"?"GENERATION_FAILED":"UNKNOWN";return{code,message,stage,retryable,providerId,cause:error instanceof Error?error.name:undefined};}
export class BookOrchestrator{
 constructor(private readonly store:BookStore){}
 async create(input:StoryInput,providers:BookCreationProviders={}):Promise<{book:Book;job:GenerationJob}>{
  const job:GenerationJob={id:"job-"+Date.now()+"-"+Math.random().toString(36).slice(2,8),status:"running",stage:"generation",input};
  try{const result=await generateWithFallback(input,providers.llm);job.usedFallback=result.usedFallback;let book=result.book;
   if(providers.image){job.stage="image";let generated=await generateBookImages(book,providers.image);book=generated.book;
    if(generated.failures.length){const repaired=await repairFailedBookImages(book,providers.image,book.pages.length);book=repaired.book;generated={...generated,failures:repaired.failures,book};}
    if(generated.failures.length){job.status="failed";job.error=toJobError(new Error(generated.failures.join("; ")),"image",providers.image.metadata.id);throw new Error(job.error.message);}
   }
   job.stage="qa";let qa=validateBook(book);if(!qa.ok){book=repairBook(book);qa=validateBook(book);}job.qa=qa;
   if(!qa.ok){job.status="failed";job.error=toJobError(new Error("Book failed quality validation after repair."),"qa");throw new Error(job.error.message);}
   job.stage="persistence";try{book=await this.store.save(book);}catch(error){job.status="failed";job.error=toJobError(error,"persistence");throw error;}
   job.stage="generation";job.status="completed";job.bookId=book.id;if(result.providerError)job.error=toJobError(new Error(result.providerError),"generation",providers.llm?.metadata.id);return{book,job};
  }catch(error){if(!job.error)job.error=toJobError(error,job.stage,providers.llm?.metadata.id);job.status="failed";throw error;}
 }
}