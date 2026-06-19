import {
  Link,
  useLocation
} from "react-router-dom";

import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Presentation,
  Menu,
  Bot
} from "lucide-react";

import {
  motion,
  AnimatePresence
} from "framer-motion";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen
}) {

  const location = useLocation();

  const menu = [
    {
      label: "Dashboard",
      path: "/",
      icon: LayoutDashboard
    },
    {
      label: "Outline Builder",
      path: "/outline",
      icon: FileText
    },
    {
      label: "Content Builder",
      path: "/content",
      icon: BookOpen
    },
    {
      label: "Slide Builder",
      path: "/slides",
      icon: Presentation
    }
  ];

  return (

    <aside
        className={`
            fixed
            left-0
            top-0

            h-screen

            transition-all
            duration-500
            ease-in-out

            border-r
            border-white/10

            bg-[#1b1b22]

            backdrop-blur-xl

            shadow-xl

            z-50

            ${
            sidebarOpen
                ? "w-[260px]"
                : "w-[90px]"
            }
        `}
        >

        {/* WRAPPER */}

        <div className="h-full flex flex-col">

            {/* HEADER */}

            <div className="p-5">

            <button
                onClick={() =>
                setSidebarOpen(
                    !sidebarOpen
                )
                }
                className="
                p-3

                rounded-2xl

                bg-white/5
                text-white

                hover:bg-white/10

                hover:scale-[1.02]

                active:scale-[0.98]

                transition-all
                "
            >
                <Menu size={20} />
            </button>

            </div>

            {/* LOGO */}

            <div
            className="
                px-5
                mb-8
            "
            >

            <AnimatePresence mode="wait">

                {sidebarOpen ? (

                <motion.div
                    key="expanded"
                    initial={{
                    opacity: 0,
                    x: -10
                    }}
                    animate={{
                    opacity: 1,
                    x: 0
                    }}
                    exit={{
                    opacity: 0,
                    x: -10
                    }}
                    transition={{
                    duration: 0.2
                    }}
                >

                    <h1
                    className="
                        text-3xl
                        font-black

                        tracking-tight

                        bg-gradient-to-br
                        from-violet-600
                        via-fuchsia-500
                        to-pink-400

                        bg-clip-text
                        text-transparent
                    "
                    >
                    Teaching
                    </h1>

                    <p
                    className="
                        text-sm

                        text-zinc-300

                        font-medium

                        tracking-wide

                        mt-1
                    "
                    >
                    AI Operating System
                    </p>

                </motion.div>

                ) : (

                <motion.div
                    key="collapsed"
                    initial={{
                    opacity: 0,
                    scale: 0.8
                    }}
                    animate={{
                    opacity: 1,
                    scale: 1
                    }}
                    exit={{
                    opacity: 0,
                    scale: 0.8
                    }}
                    transition={{
                    duration: 0.15
                    }}
                    className="
                    flex
                    justify-center
                    "
                >

                    <div
                    className="
                        text-3xl
                        font-black

                        bg-gradient-to-br
                        from-violet-500
                        to-pink-400

                        bg-clip-text
                        text-transparent
                    "
                    >
                    TA
                    </div>

                </motion.div>

                )}

            </AnimatePresence>

            </div>

            {/* DIVIDER */}

            <div
            className="
                mx-5
                mb-5

                border-b
                border-white/10
            "
            />

            {/* SCROLLABLE MENU */}

            <nav
            className="
                flex-1

                px-4

                flex
                flex-col

                gap-3

                overflow-y-auto

                pb-6
            "
            >

            {menu.map((item) => {

                const Icon = item.icon;

                const active =
                location.pathname ===
                item.path;

                return (

                <Link
                    key={item.path}
                    to={item.path}
                    className={`
                    relative

                    flex
                    items-center

                    gap-3

                    px-4
                    py-4

                    rounded-2xl

                    overflow-hidden

                    transition-all
                    duration-300

                    ${
                        active
                        ? `
                            bg-gradient-to-r
                            from-violet-600
                            to-pink-500

                            text-white

                            shadow-lg
                        `
                        : `
                            text-zinc-400

                            hover:bg-white/10

                            hover:text-white
                        `
                    }
                    `}
                >

                    <Icon size={20} />

                    <AnimatePresence>

                    {sidebarOpen && (

                        <motion.span
                        initial={{
                            opacity: 0,
                            x: -10
                        }}
                        animate={{
                            opacity: 1,
                            x: 0
                        }}
                        exit={{
                            opacity: 0,
                            x: -10
                        }}
                        transition={{
                            duration: 0.15
                        }}
                        className="
                            font-medium
                        "
                        >
                        {item.label}
                        </motion.span>

                    )}

                    </AnimatePresence>

                </Link>

                );
            })}

            </nav>

            {/* FOOTER */}

            {sidebarOpen && (

            <div
                className="
                p-4

                border-t
                border-white/10
                "
            >

                <div

                className="
                    p-2.5

                    rounded-2xl

                    bg-white/5

                    backdrop-blur

                    text-white

                    shadow-lg
                    border
                    border-white/10
                "
                >

                <p

                    className="
                    text-sm
                    font-medium
                    bg-gradient-to-br
                        from-violet-600
                        via-fuchsia-500
                        to-pink-400

                        bg-clip-text
                        text-transparent
                    "
                >

                    My love language

                </p>

                <p

                    className="
                    text-xs

                    mt-1

                    opacity-80
                    "
                >

                    To Kit, 
                    build lessons faster so you can have more time for yourself, Bunni.

                </p>

                </div>

            </div>

            )}

            </div>

            </aside>
  );
}