import React from 'react'

const Home = () => {
  return (
    <div className="flex h-full bg-gray-100">
    <div className="m-auto text-center flex flex-col justify-center">
      <h1 className="text-4xl font-bold mb-4">Bienvenue sur mon application web</h1>
      <p className="text-lg text-gray-600">Veuillez vous connecter pour profiter entièrement de votre expérience.</p>
      <div className="mt-6">
        <a
          href="/login"
          className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
        >
          Connexion
        </a>
      </div>
    </div>
  </div>
  )
}

export default Home