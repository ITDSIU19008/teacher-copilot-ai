import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {

  const [
    sidebarOpen,
    setSidebarOpen
  ] = useState(true);

  return (

    <div

      className="
        relative

        min-h-screen

        overflow-hidden

        bg-gradient-to-br
        from-[#faf7ff]
        via-[#f7f4ff]
        to-[#eef2ff]
      "
    >

      {/* BACKGROUND */}

      <div

        className="
          fixed
          inset-0

          pointer-events-none

          -z-10
        "
      >

        {/* TOP RIGHT GLOW */}

        <div

          className="
            absolute

            top-[-200px]
            right-[-150px]

            w-[650px]
            h-[650px]

            rounded-full

            bg-fuchsia-500/20

            blur-[140px]
          "
        />

        {/* BOTTOM LEFT GLOW */}

        <div

          className="
            absolute

            bottom-[-250px]
            left-[-150px]

            w-[650px]
            h-[650px]

            rounded-full

            bg-violet-300/20

            blur-[140px]
          "
        />

        {/* CENTER LIGHT */}

        <div

          className="
            absolute

            left-1/2
            top-1/2

            -translate-x-1/2
            -translate-y-1/2

            w-[700px]
            h-[700px]

            rounded-full

            bg-white/20

            blur-[180px]
          "
        />

      </div>

      {/* LAYOUT */}

      <div className="flex min-h-screen">

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main

          className={`
            flex-1

            overflow-y-auto

            transition-all
            duration-500

            ${
              sidebarOpen
                ? "ml-[260px]"
                : "ml-[90px]"
            }
          `}
        >

          <div

            className="
              max-w-[1500px]

              mx-auto

              px-10
              py-10
            "
          >

            {children}

          </div>

        </main>

      </div>

    </div>

  );
}