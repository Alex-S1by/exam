import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ScrollText, TrendingUp, BookOpen,ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-amber-50 to-white text-gray-800">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-4 sm:mb-6">Exam Essentials</h1>
        <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 font-light">
         Use the previous question papers to crack the exam.
        </p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
            <ScrollText className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 text-amber-600" />
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Question Analysis</h2>
            <p className="text-sm sm:text-base">Identify frequently repeated questions and patterns</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
            <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 text-amber-600" />
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Topic Insights</h2>
            <p className="text-sm sm:text-base">Discover key topics and their importance in your exams</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm sm:col-span-2 lg:col-span-1">
            <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 text-amber-600" />
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Study Guidance</h2>
            <p className="text-sm sm:text-base">Receive personalized study recommendations</p>
          </div>
        </div>
        
        <p className="text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
          {`There is a higher probability of getting previously repeated questions in your next exam.
          By analyzing past question papers, you can identify these frequently repeated questions.
          This site helps you review your previous years' question papers.`}
        </p>
        <Link href="/upload" className="inline-block">
          <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 text-lg shadow-lg hover:shadow-xl">
            Get started<ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
   
      
      <footer className="w-full text-center border-t border-gray-200 py-4 text-xs sm:text-sm text-gray-600">
        © {new Date().getFullYear()} Exam Essentials. All rights reserved.
      </footer>
    </div>
  )
}
