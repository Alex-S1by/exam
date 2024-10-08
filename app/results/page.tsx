'use client'

import { useState, useEffect } from 'react'

import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useRouter } from 'next/navigation'

interface AnalysisData {
  importantTopics: string[];
  repeatedQuestions: string[];
  repeatedTopics: string[];
  importantQuestions: string[];
}


const AnalysisSection = ({ title, items }: { title: string; items: string[] }) => (
  <Card className="w-full mb-4">
    <CardHeader>
      <CardTitle className="text-xl font-semibold text-primary">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-sm">
            {item.split('**').map((part, i) => 
              i % 2 === 0 ? part : <strong key={i} className="text-primary">{part}</strong>
            )}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
)




export default function Component() {
  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    importantTopics: [],
    repeatedQuestions: [],
    repeatedTopics: [],
    importantQuestions: [],
  })
  
  const router=useRouter()
  useEffect(() => {
    const fetchDataFromCookies = () => {
      const cookidata=sessionStorage.getItem('analysisResults');
      if(cookidata)
      {
      const cookieData =JSON.parse(cookidata)
       
      setAnalysisData(cookieData.jsonResponse);

     
      
      

         if (!cookieData||cookieData.jsonResponse.repeatedQuestions.length===0) {
           router.push('/upload'); 
         }
     
    }
    else{
      
      router.push('/upload')
    }
    }

    fetchDataFromCookies()
  }, [router])

  const handleNewAnalysis = () => {
    router.push('/upload')
      }
   
 
  if (!analysisData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 space-y-8">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-md">
          <h1 className="text-2xl md:text-3xl font-bold text-primary" onClick={handleNewAnalysis}>ExamEssentials</h1>
          <Button onClick={handleNewAnalysis} className="bg-primary text-white hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" /> New
          </Button>
        </div>
        
        <div className="flex flex-col gap-4">
          <AnalysisSection title="Repeated Questions" items={analysisData.repeatedQuestions} />
          <AnalysisSection title="Repeated Topics" items={analysisData.repeatedTopics} />
          <AnalysisSection title="Important Questions" items={analysisData.importantQuestions} />
          <AnalysisSection title="Important Topics" items={analysisData.importantTopics} />
        </div>
      </div>
    </div>
  )
}