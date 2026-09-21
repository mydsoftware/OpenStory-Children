import { describe, expect, it } from "vitest";
import { mutateComfyUIWorkflow } from "./comfyui-workflow.js";
import { generateStoryBook, generateBookImages, type ImageProvider } from "./index.js";

const workflow={"1":{class_type:"CheckpointLoaderSimple",inputs:{ckpt_name:"base.safetensors"}},"2":{class_type:"CLIPTextEncode",inputs:{text:"{{PROMPT}}"}},"3":{class_type:"CLIPTextEncode",inputs:{text:"{{NEGATIVE_PROMPT}}"}},"4":{class_type:"EmptyLatentImage",inputs:{width:512,height:512,batch_size:1}},"5":{class_type:"LoadImage",inputs:{image:"old.png"}},"6":{class_type:"IPAdapterApply",inputs:{model:["1",0],weight:.75}},"7":{class_type:"KSampler",inputs:{model:["6",0],seed:1,steps:20,cfg:7,sampler_name:"euler",scheduler:"normal"}}};

describe("ComfyUI visual workflow",()=>{
 it("mutates prompt, generation controls and reference image",()=>{
  const result=mutateComfyUIWorkflow(workflow,{prompt:"hello",negativePrompt:"bad",seed:42,width:512,height:512,steps:22,cfg:6.5,sampler:"dpmpp_2m",scheduler:"karras",referenceImage:"ref.png",ipAdapterWeight:.8}) as any;
  expect(result["2"].inputs.text).toBe("hello");expect(result["3"].inputs.text).toBe("bad");expect(result["5"].inputs.image).toBe("ref.png");expect(result["7"].inputs.seed).toBe(42);expect(result["7"].inputs.sampler_name).toBe("dpmpp_2m");expect(result["6"].inputs.weight).toBe(.8);
 });
 it("bypasses IPAdapter for initial character-reference generation",()=>{const result=mutateComfyUIWorkflow(workflow,{prompt:"ref",negativePrompt:"bad",seed:1,width:512,height:512,steps:22,cfg:6.5,sampler:"dpmpp_2m",scheduler:"karras"} ) as any;expect(result["7"].inputs.model).toEqual(["1",0]);});
 it("maps generated character references into page requests",async()=>{
  const calls:{prompt:string;references?:string[];seed?:number}[]=[];
  const provider:ImageProvider={metadata:{id:"mock-comfy",name:"Mock ComfyUI",local:true},async generate(input){calls.push(input);return{assetId:"asset-"+calls.length,url:"http://localhost:8188/view?filename="+calls.length+".png"};}};
  const book=generateStoryBook({idea:"دینو در باغ",ageBand:"4-5",language:"fa",pageCount:2});
  const result=await generateBookImages(book,provider);
  expect(result.failures).toEqual([]);expect(result.book.characters[0]?.referenceAssetIds).toHaveLength(1);
  expect(calls[0]?.references).toBeUndefined();expect(calls[1]?.references?.length).toBeGreaterThan(0);expect(result.book.pages.every(p=>p.generationStatus==="completed")).toBe(true);
 });
});
