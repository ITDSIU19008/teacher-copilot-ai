import {

  useState,
  useEffect

} from "react";

import MainLayout from
"../layouts/MainLayout";

import {

  useLesson

} from "../context/LessonContext";


export default function OutlineBuilder() {
    const {

        lesson,

        setLesson,

        hasUnsavedChanges,

        setHasUnsavedChanges

        } = useLesson();

  // =========================
  // STATES
  // =========================

//   const [

//     lesson,

//     setLesson

//   ] = useState(null);

  const [

    drafts,

    setDrafts

  ] = useState([]);

  const [

    showDrafts,

    setShowDrafts

  ] = useState(false);

  const [

  showSaveModal,

  setShowSaveModal

] = useState(false);

const [

  pendingFilename,

  setPendingFilename

] = useState("");

  const [

    formData,

    setFormData

  ] = useState({

    course_type: "IELTS",

    band: "5.5",

    skill: "Reading",

    topic: "Climate Change",

    duration: 60
  });

// const [

//   hasUnsavedChanges,

//   setHasUnsavedChanges

// ] = useState(false);


  // =========================
  // GENERATE LESSON
  // =========================

  async function generateLesson() {

    const response = await fetch(

      "http://127.0.0.1:8000/generate_lesson",

      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(formData)
      }
    );

    const data =
      await response.json();

    setLesson(
      data.lesson
    );
  }


  // =========================
  // LOAD DRAFT LIST
  // =========================

  async function loadDrafts() {

    const response = await fetch(

      "http://127.0.0.1:8000/lessons"
    );

    const data =
      await response.json();

    setDrafts(
      data.lessons
    );
  }


  // =========================
  // LOAD SINGLE LESSON
  // =========================

  async function loadLesson(
    filename
  ) {

    const response = await fetch(

      `http://127.0.0.1:8000/lesson/${filename}`
    );

    const data =
      await response.json();

    setLesson(data);

    setShowDrafts(false);
  }


  // =========================
  // SAVE LESSON
  // =========================

async function saveLesson() {

    const response = await fetch(

        "http://127.0.0.1:8000/save_lesson",

        {

        method: "POST",

        headers: {

            "Content-Type":
            "application/json"
        },

        body:
            JSON.stringify(lesson)
        }
    );

    const data =
        await response.json();
    
    setHasUnsavedChanges(
        false
    );    

    // FILE EXISTS

    if (
        data.status ===
        "file_exists"
    ) {

        setPendingFilename(
        data.filename
        );

        setShowSaveModal(true);

        return;
    }

    alert(data.status);
    }

async function processSaveAction(
    action
    ) {

    const response = await fetch(

        "http://127.0.0.1:8000/confirm_save",

        {

        method: "POST",

        headers: {

            "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

            lesson: lesson,

            action: action,

            filename:
            pendingFilename
        })
        }
    );

    const data =
        await response.json();

    alert(data.status);

    setShowSaveModal(false);
    }

  // =========================
  // UPDATE SECTION
  // =========================

  function updateSection(
    index,
    field,
    value
    ) {

    const updatedLesson = {

        ...lesson
    };

    updatedLesson.sections[index][field] =
        value;

    setLesson(updatedLesson);
    console.log("changed");

    setHasUnsavedChanges(
        true
    );
    }

useEffect(() => {

  const handler = (e) => {

    if (
      hasUnsavedChanges
    ) {

      e.preventDefault();

      e.returnValue = "";
    }
  };

  window.addEventListener(

    "beforeunload",

    handler
  );

  return () =>

    window.removeEventListener(

      "beforeunload",

      handler
    );

}, [
  hasUnsavedChanges
]);    


  return (

    <MainLayout>

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div className="mb-10">

        <h1

          className="
            text-4xl
            font-bold
            tracking-tight
            mb-3
          "
        >

          Outline Builder

        </h1>

        <p

          className="
            text-zinc-500
            mt-2
          "
        >

          Plan and structure lessons.

        </p>
        {

            hasUnsavedChanges && (

            <div

                className="

                mt-3

                text-amber-600

                font-medium

                text-sm
                "
            >

                ⚠ Unsaved changes

            </div>
            )
        }

      </div>


      {/* ========================= */}
      {/* FORM */}
      {/* ========================= */}

      <div

        className="

          bg-white

          rounded-3xl

          p-8

          border
          border-[#ebe5ff]

          shadow-sm

          mb-8
        "
      >

        <div

          className="
            grid
            grid-cols-2
            gap-6
          "
        >

          {/* COURSE */}

          <div>

            <label

              className="
                block
                text-sm
                text-zinc-500
                mb-2
              "
            >

              Course Type

            </label>

            <select

              value={
                formData.course_type
              }

              onChange={(e) =>

                setFormData({

                  ...formData,

                  course_type:
                    e.target.value
                })
              }

              className="

                w-full

                border
                border-[#ebe5ff]

                rounded-2xl

                p-4

                outline-none

                focus:border-[#8b5cf6]
              "
            >

              <option>
                IELTS
              </option>

              <option>
                TOEIC
              </option>

              <option>
                TOEFL
              </option>

            </select>

          </div>


          {/* BAND */}

          <div>

            <label

              className="
                block
                text-sm
                text-zinc-500
                mb-2
              "
            >

              Band

            </label>

            <input

              value={formData.band}

              onChange={(e) =>

                setFormData({

                  ...formData,

                  band:
                    e.target.value
                })
              }

              className="

                w-full

                border
                border-[#ebe5ff]

                rounded-2xl

                p-4

                outline-none

                focus:border-[#8b5cf6]
              "
            />

          </div>


          {/* SKILL */}

          <div>

            <label

              className="
                block
                text-sm
                text-zinc-500
                mb-2
              "
            >

              Skill

            </label>

            <select

              value={
                formData.skill
              }

              onChange={(e) =>

                setFormData({

                  ...formData,

                  skill:
                    e.target.value
                })
              }

              className="

                w-full

                border
                border-[#ebe5ff]

                rounded-2xl

                p-4

                outline-none

                focus:border-[#8b5cf6]
              "
            >

              <option>
                Reading
              </option>

              <option>
                Writing
              </option>

              <option>
                Listening
              </option>

              <option>
                Speaking
              </option>

            </select>

          </div>


          {/* DURATION */}

          <div>

            <label

              className="
                block
                text-sm
                text-zinc-500
                mb-2
              "
            >

              Duration

            </label>

            <input

              type="number"

              value={
                formData.duration
              }

              onChange={(e) =>

                setFormData({

                  ...formData,

                  duration:
                    e.target.value
                })
              }

              className="

                w-full

                border
                border-[#ebe5ff]

                rounded-2xl

                p-4

                outline-none

                focus:border-[#8b5cf6]
              "
            />

          </div>

        </div>


        {/* TOPIC */}

        <div className="mt-6">

          <label

            className="
              block
              text-sm
              text-zinc-500
              mb-2
            "
          >

            Topic

          </label>

          <input

            value={formData.topic}

            onChange={(e) =>

              setFormData({

                ...formData,

                topic:
                  e.target.value
              })
            }

            className="

              w-full

              border
              border-[#ebe5ff]

              rounded-2xl

              p-4

              outline-none

              focus:border-[#8b5cf6]
            "
          />

        </div>

      </div>


      {/* ========================= */}
      {/* ACTION BUTTONS */}
      {/* ========================= */}

      <div

        className="
          flex
          gap-3
          mb-8
        "
      >

        {/* GENERATE */}

        <button

          onClick={generateLesson}

          className="

            bg-[#8b5cf6]
            hover:bg-[#7c3aed]

            text-white

            px-6
            py-3

            rounded-2xl

            shadow-lg
          "
        >

          Generate

        </button>

        {/* LOAD */}

        <button

          onClick={async () => {

            await loadDrafts();

            setShowDrafts(true);
          }}

          className="

            bg-white

            border
            border-[#ddd6fe]

            px-6
            py-3

            rounded-2xl
          "
        >

          Load Draft

        </button>

      </div>


      {/* ========================= */}
      {/* DRAFT MODAL */}
      {/* ========================= */}

      {

        showDrafts && (

          <div

            className="

              fixed
              inset-0

              bg-black/40

              flex
              items-center
              justify-center

              z-50
            "
          >

            <div

              className="

                bg-white

                w-[600px]

                rounded-3xl

                p-8

                shadow-2xl
              "
            >

              <div

                className="
                  flex
                  items-center
                  justify-between
                  mb-6
                "
              >

                <h2

                  className="
                    text-2xl
                    font-semibold
                  "
                >

                  Saved Drafts

                </h2>

                <button

                  onClick={() =>
                    setShowDrafts(false)
                  }

                  className="
                    text-zinc-400
                  "
                >

                  Close

                </button>

              </div>

              <div

                className="
                  flex
                  flex-col
                  gap-3
                "
              >

                {

                  drafts.map(

                    (draft) => (

                      <button

                        key={draft}

                        onClick={() =>
                          loadLesson(draft)
                        }

                        className="

                          text-left

                          p-4

                          rounded-2xl

                          border
                          border-[#ebe5ff]

                          hover:bg-[#f6f3ff]
                        "
                      >

                        {draft}

                      </button>
                    )
                  )
                }

              </div>

            </div>

          </div>
        )
      }


      {/* ========================= */}
      {/* EMPTY STATE */}
      {/* ========================= */}

      {

        !lesson && (

          <div

            className="

              bg-white
              rounded-3xl
              p-10

              border
              border-[#ebe5ff]

              shadow-sm
            "
          >

            <p

              className="
                text-zinc-500
              "
            >

              Generate a lesson outline
              to begin editing.

            </p>

          </div>
        )
      }


      {/* ========================= */}
      {/* LESSON */}
      {/* ========================= */}

      {

        lesson && (

          <div

            className="
              flex
              flex-col
              gap-6
            "
          >

            {

              lesson.sections.map(

                (section, index) => (

                  <div

                    key={index}

                    className="

                      bg-white

                      rounded-3xl

                      p-8

                      border
                      border-[#ebe5ff]

                      shadow-sm
                    "
                  >

                    <div

                      className="
                        flex
                        items-center
                        justify-between
                        mb-5
                      "
                    >

                      <h2

                        className="
                          text-2xl
                          font-semibold
                        "
                      >

                        {section.type}

                      </h2>


                      {/* TIMING */}

                      <div

                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >

                        <input

                          type="number"

                          min={1}

                          value={
                            section.timing
                          }

                          onChange={(e) =>

                            updateSection(

                              index,

                              "timing",

                              parseInt(
                                e.target.value
                              )
                            )
                          }

                          className="

                            w-[80px]

                            bg-[#f3edff]

                            border
                            border-[#ddd6fe]

                            text-[#7c3aed]

                            rounded-full

                            px-4
                            py-2

                            text-sm
                            font-medium

                            outline-none

                            text-center
                          "
                        />

                        <span

                          className="
                            text-sm
                            text-zinc-400
                          "
                        >

                          mins

                        </span>

                      </div>

                    </div>


                    {/* OBJECTIVE */}

                    <div className="mb-5">

                      <p

                        className="
                          text-sm
                          text-zinc-400
                          mb-2
                        "
                      >

                        Objective

                      </p>

                      <textarea

                        value={
                          section.objective
                        }

                        onChange={(e) =>

                          updateSection(

                            index,

                            "objective",

                            e.target.value
                          )
                        }

                        className="

                          w-full

                          border
                          border-[#ebe5ff]

                          rounded-2xl

                          p-4

                          min-h-[100px]

                          outline-none

                          focus:border-[#8b5cf6]
                        "
                      />

                    </div>


                    {/* ACTIVITY */}

                    <div>

                      <p

                        className="
                          text-sm
                          text-zinc-400
                          mb-2
                        "
                      >

                        Activity

                      </p>

                      <textarea

                        value={
                          section.activity
                        }

                        onChange={(e) =>

                          updateSection(

                            index,

                            "activity",

                            e.target.value
                          )
                        }

                        className="

                          w-full

                          border
                          border-[#ebe5ff]

                          rounded-2xl

                          p-4

                          min-h-[140px]

                          outline-none

                          focus:border-[#8b5cf6]
                        "
                      />

                    </div>

                  </div>
                )
              )
            }

            {/* SAVE */}

            <button

              onClick={saveLesson}

              className="

                bg-[#8b5cf6]
                hover:bg-[#7c3aed]

                text-white

                px-6
                py-4

                rounded-2xl

                shadow-lg

                self-start
              "
            >

              Save Draft

            </button>

          </div>
        )
      }
      {
        showSaveModal && (

            <div

            className="

                fixed
                inset-0

                bg-black/40

                flex
                items-center
                justify-center

                z-50
            "
            >

            <div

                className="

                bg-white

                w-[500px]

                rounded-3xl

                p-8

                shadow-2xl
                "
            >

                <h2

                className="
                    text-2xl
                    font-semibold
                    mb-4
                "
                >

                Draft Already Exists

                </h2>

                <p

                className="
                    text-zinc-500
                    mb-6
                "
                >

                Do you want to overwrite
                the current draft or
                create a new version?

                </p>

                <div

                className="
                    flex
                    gap-3
                "
                >

                {/* OVERWRITE */}

                <button

                    onClick={() =>

                    processSaveAction(
                        "overwrite"
                    )
                    }

                    className="

                    flex-1

                    bg-[#8b5cf6]
                    hover:bg-[#7c3aed]

                    text-white

                    py-3

                    rounded-2xl
                    "
                >

                    Overwrite

                </button>

                {/* VERSION */}

                <button

                    onClick={() =>

                    processSaveAction(
                        "new_version"
                    )
                    }

                    className="

                    flex-1

                    bg-white

                    border
                    border-[#ddd6fe]

                    py-3

                    rounded-2xl
                    "
                >

                    Create Version

                </button>

                </div>

            </div>

            </div>
        )
        }

    </MainLayout>
  );
}