import React from 'react'
import Link from 'next/link'
const page = () => (


  <div className='home-background'> 
    {/* <Link href="/fight">page</Link> */}
    <div className="fixed inset-0 flex items-center justify-center z-50 text-black">
      <div className="bg-amber-600 rounded-lg p-6 shadow-xl w-1/2 h-1/2 flex flex-col items-center">

        <h2 className="text-3xl font-bold">Welcome to Fight Type</h2>
        <p className="mb-4 font-bold">Choose Your Opponent</p>

        <div className="flex justify-between gap-2 w-1/2 h-5/6 mb-4">
      
              

          <Link href="/fight" className='w-1/2 h-4/6'> 
            <button className="w-full h-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg">
              Againts NPC
            </button>
          </Link>
          
          <Link href="/" className='w-1/2 h-4/6' > 
            <button className="w-full h-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg">
              Againts Player
            </button>
          </Link>

         
          
        </div>

      </div>
    </div>
  </div>
)

export default page