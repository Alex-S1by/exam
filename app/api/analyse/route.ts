
import {  NextRequest, NextResponse } from 'next/server';

import { GoogleGenerativeAI } from "@google/generative-ai";

export const POST = async (req: NextRequest) => {
    try{

        const body = await req.json();
       


  const extractedTexts: { [key: string]: string } = {};
  body.forEach((item: { text: string }, index: number) => {
    extractedTexts[`set${index + 1}`] = item.text;
  });

  

  const combinedTexts = Object.values(extractedTexts).join('\n');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });





const prompt = `Here are the previous years' question papers:\n${combinedTexts}\n\nPlease find repeated questioins ,repeated topics,important questions and important topics from the above text.`;


const result = await model.generateContent(prompt);
const responseText = result.response.text();


const jsonResponse = {
  repeatedQuestions: [''],
  repeatedTopics: [''],
  importantTopics: [''],
  importantQuestions:[''],
 
};


const lines = responseText.split('\n');
let currentSection = '';
lines.forEach(line => {
  if (line.includes('**Repeated Questions:**') || line.includes('**Common Questions:**')){
    currentSection = 'repeatedQuestions';
  } else if (line.includes('**Repeated Topics:**')||line.includes("**Common Topics:**")) {
    currentSection = 'repeatedTopics';
  }
  else if (line.includes('**Important Questions:**')||line.includes('## Important Questions:')) {
    currentSection = 'importantQuestions';
  }
  else if (line.includes('**Important Topics:**')||line.includes('## Important Topics:')||line.includes('**Other observations:**')||line.includes('**General Tips:**')) {
    currentSection = 'importantTopics';
  }
  else {
    const questionOrTopic = line.replace('*','').trim();
    if (currentSection === 'repeatedQuestions') {
      jsonResponse.repeatedQuestions.push(questionOrTopic);
    }
    else if(currentSection === 'repeatedTopics'){
      jsonResponse.repeatedTopics.push(questionOrTopic);
      }
      else if(currentSection === 'importantQuestions'){
        jsonResponse.importantQuestions.push(questionOrTopic);
        }
       
      else if(currentSection === 'importantTopics'){
      jsonResponse.importantTopics.push(questionOrTopic);
      }
     
   
  }
});





  return NextResponse.json({jsonResponse}); 
}
  catch (error) {
    console.error("Error parsing JSON:", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }};









