import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="bg-[#EDE6DA] min-h-screen text-[#2B2B2B] font-sans">
      {/* Navbar */}
      <header className="flex flex-col sm:flex-row justify-between items-center p-4 sm:py-6 sm:px-8 bg-[#F6F1E6] shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-0">Timetable Generator</h1>
        <div className="flex gap-2">
          <Link to="/login">
            <button className="rounded-full bg-black text-white px-4 sm:px-6 py-2 text-sm hover:bg-gray-800">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="rounded-full bg-black text-white px-4 sm:px-6 py-2 text-sm hover:bg-gray-800">
              Register
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col lg:flex-row justify-center items-center py-8 px-4 lg:py-12 lg:px-16 gap-8">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Welcome to Timetable Generator!
          </h2>
          <h4 className="text-base sm:text-lg leading-relaxed mb-6">
            Your go-to platform for effortlessly creating and managing
            schedules. "We take the burden of scheduling off your shoulders."
          </h4>
          <Link>
            <button className="bg-black text-white px-6 sm:px-8 py-3 rounded-full hover:bg-gray-800 w-full sm:w-auto">
              CREATE NOW
            </button>
          </Link>
        </div>

        {/* Right Content */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 w-full lg:w-1/2">
          {/* Phone Mockup */}
          <div className="w-32 sm:w-40 h-[400px] sm:h-[500px] bg-gray-300 rounded-lg shadow-lg overflow-hidden">
            <img
              src="/api/placeholder/150/500"
              alt="Phone Mockup"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Tablet Mockup */}
          <div className="w-56 sm:w-72 h-[350px] sm:h-[450px] bg-gray-300 rounded-lg shadow-lg overflow-hidden">
            <img
              src="/api/placeholder/200/450"
              alt="Tablet Mockup"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </main>

      {/* About Section */}
      <section className="text-center py-8 sm:py-12 px-4 sm:px-8 bg-[#F6F1E6]">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4">About Us</h3>
        <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto text-sm sm:text-base">
          Welcome to Timetable Generator! A platform to generate Time Table.
          where we take the burden of scheduling from you. Our team{" "}
          <b>Sai Teja, Shanwaz, Gayatri</b>, and <b>Musthq</b> has
          developed an easy-to-use Timetable Generator to simplify the process
          of creating and managing your schedules efficiently.
        </p>
        <div className="mt-6">
          <p className="font-bold mb-3">Contact Us</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://www.linkedin.com/in/saitejapatsa/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Sai Teja
            </a>
            <a href="https://www.linkedin.com/in/shaikshanwaz/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Shanwaz
            </a>
            {/* <a href="https://www.linkedin.com/in/knv-manideep-81664926a/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Manideep
            </a> */}
            <a href="https://www.linkedin.com/in/panidepu-gayathri-56814326a/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Gayatri
            </a>
            <a href="https://www.linkedin.com/in/mohammad-mushtaq-ahamad-436305256/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Musthq
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-600 py-4 sm:py-6 text-xs sm:text-sm">
        Copyright © <span className="underline">{new Date().getFullYear()}</span>. All rights
        reserved.
      </footer>
    </div>
  );
};

export default LandingPage;