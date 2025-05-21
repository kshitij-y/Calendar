"use client";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center z-50 animate-fadeOut delay-1500 duration-700 ease-out">
      <h1 className="text-6xl font-extrabold text-cyan-400 select-none mb-2 font-sans">
        Claneder
      </h1>
      <p className="text-cyan-300 font-light text-lg select-none tracking-wide">
        - by kshitij
      </p>
    </div>
  );
}
