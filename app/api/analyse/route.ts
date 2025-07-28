
import {  NextRequest, NextResponse } from 'next/server';

import { GoogleGenerativeAI } from "@google/generative-ai";

export const POST = async (req: NextRequest) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
    try{
      const body = await req.json();

        if (typeof body === 'string') {
          const prompt = `here is the user query and questions. answer the user query accordingly ${body}`
        
           
const result = await model.generateContent(prompt);
const responseText = result.response.text();






const lines = responseText.split('\n');
let res="";
lines.forEach(line => {
  
    const message = line.replace('*','').trim();
    
      res =res+""+message
   
       
    
     
   
  })

console.log("string");
return NextResponse.json({res}); 
        
        }
        const extractedTexts: { [key: string]: string } = {};
        body.forEach((item: { text: string }, index: number) => {
          extractedTexts[`set${index + 1}`] = item.text;
        });
        
        
        
        const combinedTexts = Object.values(extractedTexts).join('\n');
        
      
        
        


const prompt = `Here are the previous years' question papers:\n${combinedTexts}\n\nPlease find repeated questions [detailed questions with year and number],repeated topics from the above question paper sets.`;



const result = await model.generateContent(prompt);
const responseText = result.response.text();



const jsonResponse = {
  res: [''],

 
};


const lines = responseText.split('\n');

lines.forEach(line => {
  
    const questionOrTopic = line.replace('*','').trim();
    
        jsonResponse.res.push(questionOrTopic);
   
       
    
     
   
  })





  return NextResponse.json({jsonResponse}); 
}
  catch (error) {
    console.error("Error parsing JSON:", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }};



















