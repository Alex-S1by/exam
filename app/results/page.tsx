'use client'

import { useState, useEffect } from 'react'

import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'

import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from 'next/navigation'

type Message = {
  text: string
  sender: 'user' | 'bot'
}

export default function Component() {
  const [analysisData, setAnalysisData] = useState< string>()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  
  const router = useRouter()

  useEffect(() => {
    const fetchDataFromCookies = () => {
      const cookidata = sessionStorage.getItem('analysisResults')
      if (cookidata) {
        const cookieData = JSON.parse(cookidata)
        setAnalysisData(cookieData.jsonResponse)

        if (!cookieData || cookieData.jsonResponse.length === 0) {
          router.push('/upload')
        }
      } else {
        router.push('/upload')
      }
    }

    fetchDataFromCookies()
  }, [router])

  const renderContent = (data:string) => {
    return Object.entries(data).flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((text, index) => {
          if (typeof text !== 'string') return null

          const formattedText = text
          .replace(/##\s*(.*)/gm, '<span class="text-xl font-semibold text-primary">$1</span>') 
          .replace(/\*\*(.*?)\*\*/g, '<strong  className="text-primary">$1</strong>') // Convert **text** to <strong>text</strong>
          .replace(/\*(.*?)\*/g, '<li className="text-sm text-slate-400">$1</li>') // Convert *text* to <em>text</em>.replace(/\n/g, '<br/>') // Replace line breaks with <br>
        
          return (
            <li key={`${key}-${index}`} className="mb-4">
              <div dangerouslySetInnerHTML={{ __html: formattedText }} />
            </li>
          )
        })
      }

      return null
    })
  }

  const handleNewAnalysis = () => {
    router.push('/upload')
  }

  const handleSend = async() => {
    if (!input.trim()) return

    const userMessage: Message = { text: input, sender: 'user' }
    setMessages(prev => [...prev, userMessage])

    setTimeout(async() => {

try{

  


  const cookieqn = sessionStorage.getItem('extractedtext');
  console.log(cookieqn);
  
  const qn =  " qusetions :" + cookieqn+" \n\n\n  "+"\n\n\n user input: "+ input
console.log(qn);

      const response = await fetch("/api/analyse", {
        method: "POST",
        body: JSON.stringify(qn),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        const result = await response.json();
       const res=result.res;
       const botMessage: Message = {
        text: `${res}`,
        sender: 'bot'
      }
      setMessages(prev => [...prev, botMessage])
        console.log(result);
        
    } else {
      const botMessage: Message = {
        text: 'Failed to fetch results',
        sender: 'bot'
      }
      setMessages(prev => [...prev, botMessage])
    }
} catch (error) {
  console.log(error)
    
     
    
    }
  }, 1000)

    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  if (!analysisData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="bg-primary min-h-screen">
      <div className="container mx-auto p-4 pb-40 space-y-8">
        <div className="flex justify-between items-center mb-6 bg-primary p-4 rounded-lg shadow-md">
          <h1 className="text-2xl md:text-3xl font-bold text-white" onClick={handleNewAnalysis}>ExamEssentials</h1>
          <Button onClick={handleNewAnalysis} className="bg-primary text-white text-xl md:text-2xl border hover:bg-primary/90">
            <PlusCircle className="mr-2 text-xl md:text-2xl" /> New
          </Button>
        </div>

        <Card className="w-full border-none bg-primary">
          <CardContent className="p-10">
            <ul className="space-y-4 text-white text-xl">
              {renderContent(analysisData)}
            </ul>
          </CardContent>
        </Card>

        <Card className="w-full bg-primary text-white border-none ">
          <CardContent className="p-6 space-y-4 flex flex-col">
          {messages.map((msg, index) => (
  <div
    key={index}
    className={`max-w-[80%] px-4 py-2 rounded-xl text-xl ${
      msg.sender === 'user'
        ? 'bg-gray-200 text-black  self-end ml-auto'
        : 'self-start'
    }`}
  >
    {/* If user, show plain text */}
    {msg.sender === 'user' && msg.text}

    {/* If bot, show parsed content */}
    {msg.sender === 'bot' && (
      <ul className="space-y-4 text-white text-xl">
        {msg.text}
      </ul>
    )}
  </div>
))}

          </CardContent>
        </Card>
      </div>

      {/* Input box at bottom */}
      <div className="fixed bottom-0 left-0 bg-primary right-0 p-4">
        <div className="container mx-auto">
          <div className="flex items-center border rounded-full px-4 py-2 shadow-sm">
            <input
              type="text"
              placeholder="Ask a question or search..."
              className="flex-1 outline-none bg-primary text-white text-sm md:text-base px-2 py-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              onClick={handleSend}
              className="ml-2 bg-primary text-white hover:bg-primary/90"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
