import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="bg-[#EDE6DA] min-h-screen text-[#2B2B2B] font-sans">
      {/* Navbar */}
      <header className="flex justify-between items-center py-6 px-8 bg-[#F6F1E6] shadow-sm">
        <h1 className="text-2xl font-bold">Timetable Generator</h1>
        <div>
          <Link to="/login">
            <button className="rounded-full bg-black text-white px-6 py-2 text-sm hover:bg-gray-800 mx-1">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="rounded-full bg-black text-white px-6 py-2 text-sm hover:bg-gray-800 mx-1">
              Register
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col lg:flex-row justify-center items-center py-12 px-6 lg:px-16">
        {/* Left Content */}
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Welcome to Timetable Generator!
          </h2>
          <h4 className="text-lg lg:text-lg leading-tight mb-4">
            Your go-to platform for effortlessly creating and managing
            schedules. "We take the burden of scheduling off your shoulders."
          </h4>
          <Link>
            <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800">
              CREATE NOW
            </button>
          </Link>
        </div>

        {/* Right Content */}
        <div className="flex items-center justify-center space-x-8">
          {/* Phone Mockup */}
          <div className="w-40 h-[500px] bg-gray-300 rounded-lg shadow-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/150"
              alt="Phone Mockup"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Tablet Mockup */}
          <div className="w-72 h-[450px] bg-gray-300 rounded-lg shadow-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/200"
              alt="Tablet Mockup"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </main>

      {/* About Section */}
      <section className="text-center py-12 px-8 bg-[#F6F1E6]">
        <h3 className="text-2xl font-semibold mb-4">About Us</h3>
        <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto">
          Welcome to Timetable Generator! A platform to generatre Time Table.
          where we take the burnden scheduling from you.Our team{" "}
          <b>Sai Teja, Manideep, Shanwaz, Gayatri</b>, and <b>Musthq</b> has
          developed an easy-to-use Timetable Generator to simplify the process
          of creating and managing your schedules efficiently.
        </p>
        <div className="flex flex-col justify-center items-center">
          <p className="mt-2 font-bold">Contact Us</p>
          <div className="flex flex-row justify-center">
            <a href="https://www.linkedin.com/in/saitejapatsa/" target="_blank">
              <p className="m-2">Sai Teja</p>
            </a>
            <a href="https://www.linkedin.com/in/shaikshanwaz/" target="_blank">
              <p className="m-2">Shanwaz</p>
            </a>
            <a
              href="https://www.linkedin.com/in/knv-manideep-81664926a/"
              target="_blank"
            >
              <p className="m-2">Manideep</p>
            </a>
            <a
              href="https://www.linkedin.com/in/panidepu-gayathri-56814326a/"
              target="_blank"
            >
              <p className="m-2">Gayatri</p>
            </a>
            <a
              href="https://www.linkedin.com/in/mohammad-mushtaq-ahamad-436305256/"
              target="_blank"
            >
              <p className="m-2">Musthq</p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-600 py-6 text-sm">
        Copyright © <span className="underline"></span> 2024. All rights
        reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
