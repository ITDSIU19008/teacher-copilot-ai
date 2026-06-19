import MainLayout from "../layouts/MainLayout";

import {
  Link
} from "react-router-dom";

import {
  FileText,
  BookOpen,
  Presentation,
  Brain,
  TrendingUp,
  Users
} from "lucide-react";

export default function Dashboard() {

  return (

    <MainLayout>

      {/* HEADER */}

      <div className="mb-10">

        <h1
          className="
            text-5xl
            font-black

            bg-gradient-to-r
            from-violet-600
            via-fuchsia-500
            to-pink-400

            bg-clip-text
            text-transparent
          "
        >
          AI Teaching Assistant
        </h1>

        <p
          className="
            text-zinc-600
            text

            mt-2
          "
        >
          For lesson planning,
          content creation, and classroom insights.
        </p>

      </div>

      {/* KPI */}

      <div
        className="
          grid
          grid-cols-3
          gap-6

          mb-10
        "
      >

        <div
          className="
            bg-white/80
            backdrop-blur-xl

            rounded-3xl

            p-6

            border
            border-white/20

            shadow-xl
          "
        >

          <p
            className="
              text-zinc-500
              text-sm
            "
          >
            Lessons Created
          </p>

          <h2
            className="
              text-4xl
              font-black

              mt-2
            "
          >
            24
          </h2>

        </div>

        <div
          className="
            bg-white/80
            backdrop-blur-xl

            rounded-3xl

            p-6

            border
            border-white/20

            shadow-xl
          "
        >

          <p
            className="
              text-zinc-500
              text-sm
            "
          >
            Active Classes
          </p>

          <h2
            className="
              text-4xl
              font-black

              mt-2
            "
          >
            12
          </h2>

        </div>

        <div
          className="
            bg-white/80
            backdrop-blur-xl

            rounded-3xl

            p-6

            border
            border-white/20

            shadow-xl
          "
        >

          <p
            className="
              text-zinc-500
              text-sm
            "
          >
            Student Satisfaction
          </p>

          <h2
            className="
              text-4xl
              font-black

              mt-2
            "
          >
            94%
          </h2>

        </div>

      </div>

      {/* MAIN MODULES */}

      <div
        className="
          grid
          grid-cols-3
          gap-6
        "
      >

        <Link
          to="/outline"
          className="
            group

            bg-white/80
            backdrop-blur-xl

            rounded-3xl

            p-8

            border
            border-white/20

            shadow-xl

            hover:scale-[1.02]

            transition-all
          "
        >

          <FileText
            size={32}
            className="
              text-violet-500
              mb-4
            "
          />

          <h2
            className="
              text-2xl
              font-bold
              mb-2
            "
          >
            Outline Builder
          </h2>

          <p
            className="
              text-zinc-500
            "
          >
            Create and edit lesson outlines.
          </p>

        </Link>

        <Link
          to="/content"
          className="
            group

            bg-white/80
            backdrop-blur-xl

            rounded-3xl

            p-8

            border
            border-white/20

            shadow-xl

            hover:scale-[1.02]

            transition-all
          "
        >

          <BookOpen
            size={32}
            className="
              text-violet-500
              mb-4
            "
          />

          <h2
            className="
              text-2xl
              font-bold
              mb-2
            "
          >
            Content Builder
          </h2>

          <p
            className="
              text-zinc-500
            "
          >
            Generate teaching materials.
          </p>

        </Link>

        <Link
          to="/slides"
          className="
            group

            bg-white/80
            backdrop-blur-xl

            rounded-3xl

            p-8

            border
            border-white/20

            shadow-xl

            hover:scale-[1.02]

            transition-all
          "
        >

          <Presentation
            size={32}
            className="
              text-violet-500
              mb-4
            "
          />

          <h2
            className="
              text-2xl
              font-bold
              mb-2
            "
          >
            Slide Builder
          </h2>

          <p
            className="
              text-zinc-500
            "
          >
            Create presentation slides.
          </p>

        </Link>

      </div>

      {/* COMING SOON */}

      <div
        className="
          mt-10

          bg-gradient-to-r
          from-violet-600
          to-pink-500

          rounded-[32px]

          p-8

          text-white

          shadow-2xl
        "
      >

        <div
          className="
            flex
            items-center
            gap-3

            mb-5
          "
        >

          <span
            className="
              px-3
              py-1

              rounded-full

              bg-white/20

              text-xs
              font-bold
            "
          >
            COMING SOON
          </span>

        </div>

        <div
          className="
            flex
            items-center
            gap-4

            mb-4
          "
        >

          <Brain size={34} />

          <h2
            className="
              text-3xl
              font-black
            "
          >
            Student Pattern Intelligence
          </h2>

        </div>

        <p
          className="
            text-white/80

            max-w-[900px]
          "
        >
          AI Agents continuously analyze student
          engagement, participation trends, learning
          behavior, and class performance patterns
          to help teachers personalize teaching
          strategies and improve learning outcomes.
        </p>

        <div
          className="
            grid
            grid-cols-3
            gap-4

            mt-8
          "
        >

          <div
            className="
              bg-white/10

              rounded-2xl

              p-5
            "
          >

            <p className="text-sm text-white/70">
              Class A
            </p>

            <h3 className="font-bold mt-2">
              Engagement ↓ 12%
            </h3>

          </div>

          <div
            className="
              bg-white/10

              rounded-2xl

              p-5
            "
          >

            <p className="text-sm text-white/70">
              Class B
            </p>

            <h3 className="font-bold mt-2">
              Retention ↑ 18%
            </h3>

          </div>

          <div
            className="
              bg-white/10

              rounded-2xl

              p-5
            "
          >

            <p className="text-sm text-white/70">
              Class C
            </p>

            <h3 className="font-bold mt-2">
              Speaking ↑ 24%
            </h3>

          </div>

        </div>

      </div>

      {/* TEACHER PROFILE */}

      <div
        className="
          mt-10

          bg-white/80
          backdrop-blur-xl

          rounded-[32px]

          p-8

          border
          border-white/20

          shadow-xl
        "
      >

        <div
          className="
            flex
            items-center
            gap-3

            mb-8
          "
        >

          <Users
            size={28}
            className="
              text-violet-500
            "
          />

          <h2
            className="
              text-3xl
              font-bold
            "
          >
            Teacher Profile
          </h2>

        </div>

        <div
          className="
            grid
            grid-cols-2
            gap-10
          "
        >

          {/* CHART */}

          <div>

            <h3
              className="
                font-semibold
                mb-6
              "
            >
              Teaching Improvement Trend
            </h3>

            <div
              className="
                flex
                items-end

                gap-4

                h-[220px]
              "
            >

              {[70, 100, 140, 180, 210].map(
                (height, index) => (

                  <div
                    key={index}
                    className="
                      flex-1
                    "
                  >

                    <div
                      style={{
                        height:
                          `${height}px`
                      }}
                      className="
                        rounded-t-2xl

                        bg-gradient-to-t
                        from-violet-600
                        to-pink-400
                      "
                    />

                    <p
                      className="
                        mt-2

                        text-center
                        text-sm
                      "
                    >
                      {
                        ["Jan", "Feb", "Mar", "Apr", "May"][index]
                      }
                    </p>

                  </div>

                )
              )}

            </div>

          </div>

          {/* METRICS */}

          <div
            className="
              flex
              flex-col

              gap-5
            "
          >

            <div
              className="
                bg-violet-50

                rounded-2xl

                p-5
              "
            >
              <p className="text-zinc-500 text-sm">
                Teaching Effectiveness
              </p>

              <h3
                className="
                  text-3xl
                  font-black

                  mt-2
                "
              >
                91%
              </h3>
            </div>

            <div
              className="
                bg-pink-50

                rounded-2xl

                p-5
              "
            >
              <p className="text-zinc-500 text-sm">
                Student Engagement
              </p>

              <h3
                className="
                  text-3xl
                  font-black

                  mt-2
                "
              >
                88%
              </h3>
            </div>

            <div
              className="
                bg-indigo-50

                rounded-2xl

                p-5
              "
            >
              <p className="text-zinc-500 text-sm">
                Lesson Completion Rate
              </p>

              <h3
                className="
                  text-3xl
                  font-black

                  mt-2
                "
              >
                95%
              </h3>
            </div>

          </div>

        </div>

      </div>

    </MainLayout>

  );
}