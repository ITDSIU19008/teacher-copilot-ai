import {

  useState,
  useEffect

} from "react";

import MainLayout from
"../layouts/MainLayout";

import {

  useLesson

} from "../context/LessonContext";

import {
  ArrowUp,
  ArrowDown,
  Trash2
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL;

export default function OutlineBuilder() {
    const {

        lesson,

        setLesson,

        hasUnsavedChanges,

        setHasUnsavedChanges

        } = useLesson();
    
    const DEFAULT_FORM = {

      course_type: "IELTS",

      band: "B1",

      skill: "Reading",

      topic: "",

      duration: 60
    };

  // =========================
  // STATES
  // =========================

//   const [

//     lesson,

//     setLesson

//   ] = useState(null);

//   const [

//     drafts,

//     setDrafts

//   ] = useState([]);

//   const [

//     showDrafts,

//     setShowDrafts

//   ] = useState(false);

//   const [

//   showSaveModal,

//   setShowSaveModal

// ] = useState(false);

// const [

//   pendingFilename,

//   setPendingFilename

// ] = useState("");

    const [

    formData,

    setFormData

  ] = useState(
    DEFAULT_FORM
  );

  const [

  topicError,

  setTopicError

] = useState("");

  const [

    generating,

    setGenerating

  ] = useState(false);

// const [

//   hasUnsavedChanges,

//   setHasUnsavedChanges

// ] = useState(false);


  // =========================
  // GENERATE LESSON
  // =========================

  async function generateLesson() {

  if (!formData.topic.trim()) {

    setTopicError(
      "Please enter a topic."
    );

    return;
  }

  try {

    setGenerating(true);

    setTopicError("");


  const response = await fetch(

    // "http://127.0.0.1:8000/generate_lesson",
    `${API_URL}/generate_lesson`,

    {

      method: "POST",

      headers: {

        "Content-Type":
        "application/json"
      },

      body:
      JSON.stringify(
        formData
      )
    }
  );

  const data =

    await response.json();

  setLesson(
    data.lesson
  );
} 

catch (error) {

    console.error(error);

    alert(
      "Failed to generate lesson."
    );

  } finally {

    setGenerating(false);

  }
}

  // =========================
  // LOAD DRAFT LIST
  // =========================

  async function loadLocalDraft(
  event
) {

  try {

    const file =

      event.target.files[0];

    if (!file)
      return;

    const text =

      await file.text();
    // console.log(text);
    // alert(text);

    const lessonData =

      JSON.parse(text);

    console.log(
      lessonData
    );

    setLesson(
      lessonData
    );

    setHasUnsavedChanges(
      false
    );

    alert(
      "Draft loaded."
    );

  } catch (error) {

    console.error(error);

    alert(
      error.message
    );
  }
}


  // =========================
  // SAVE LESSON
  // =========================

  async function saveLocalDraft() {

  const json = JSON.stringify(
    lesson,
    null,
    2
  );

  const blob = new Blob(
    [json],
    {
      type:
        "application/json"
    }
  );

  const url =
    URL.createObjectURL(
      blob
    );

  const a =
    document.createElement(
      "a"
    );

  a.href = url;

  a.download =

    `${lesson.topic}_${lesson.skill}.json`;

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  URL.revokeObjectURL(
    url
  );

  setHasUnsavedChanges(
    false
  );

  alert(
    "Draft saved."
  );
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

function addSection() {

  const newSection = {

    type: "custom",

    objective: "",

    activity: "",

    timing: 5
  };

  const updatedLesson = {

    ...lesson,

    sections: [

      ...lesson.sections,

      newSection
    ]
  };

  setLesson(
    updatedLesson
  );

  setHasUnsavedChanges(
    true
  );
}

function deleteSection(
  index
) {

  const confirmed =

    window.confirm(

      "Delete this section?"
    );

  if (!confirmed)
    return;

  const updatedLesson = {

    ...lesson,

    sections:

      lesson.sections.filter(

        (_,
         i) =>

        i !== index
      )
  };

  setLesson(
    updatedLesson
  );

  setHasUnsavedChanges(
    true
  );
}

function moveSectionUp(
  index
) {

  if (index === 0)
    return;

  const sections = [

    ...lesson.sections
  ];

  [

    sections[index - 1],

    sections[index]

  ] = [

    sections[index],

    sections[index - 1]
  ];

  setLesson({

    ...lesson,

    sections
  });

  setHasUnsavedChanges(
    true
  );
}

function moveSectionDown(
  index
) {

  if (
    index ===
    lesson.sections.length - 1
  )
    return;

  const sections = [

    ...lesson.sections
  ];

  [

    sections[index],

    sections[index + 1]

  ] = [

    sections[index + 1],

    sections[index]
  ];

  setLesson({

    ...lesson,

    sections
  });

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




function clearLesson() {

  const confirmed =

    window.confirm(

      "Create new outline?"
    );

  if (!confirmed)
    return;

  setLesson(null);

  setHasUnsavedChanges(
    false
  );

  setFormData({

  ...DEFAULT_FORM
});
}

  return (

    <MainLayout>

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div className="mb-10">

        <h1

          className="
            text-5xl
            font-black

            tracking-tight

            bg-gradient-to-r  
            from-violet-600
            via-fuchsia-500
            to-pink-400

            bg-clip-text
            text-transparent
          "
          // className="
          //   text-5xl

          //   font-black

          //   tracking-tight

          //   bg-gradient-to-r

          //   from-violet-700
          //   to-indigo-600

          //   bg-clip-text

          //   text-transparent
          // "
        >

          Outline Builder

        </h1>

        <p

          className="
          text-zinc-500

          mt-2
        "
        >

          Design and structure AI-assisted lessons.

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

          bg-white/80

          backdrop-blur-xl

          rounded-[32px]

          p-10

          border
          border-[#ebe5ff]

          shadow-[0_8px_40px_rgba(139,92,246,0.08)]

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
                font-medium

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

              bg-[#fcfbff]

              border
              border-[#e8defd]

              rounded-2xl

              px-5
              py-4

              transition-all
              duration-200

              outline-none

              focus:border-violet-500

              focus:ring-4
              focus:ring-violet-100
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

            placeholder="Topic"

            value={formData.topic}

            onChange={(e) => {

              setFormData({

                ...formData,

                topic:
                e.target.value
              });

              if (

                e.target.value.trim()

              ) {

                setTopicError("");
              }
            }}

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

          {
            topicError && (

              <p

                className="

                  mt-2

                  text-sm

                  text-red-500
                "
              >

                {topicError}

              </p>
            )
          }

        </div>

      </div>


      {/* ========================= */}
      {/* ACTION BUTTONS */}
      {/* ========================= */}

      <div

        className="
          flex
          gap-4
          mb-8
        "
      >

        {/* GENERATE */}

        <button

          onClick={generateLesson}

          disabled={generating}

          className={`
            flex-1
            py-4
            rounded-2xl
            text-white
            shadow-lg
            transition

            ${
              generating
                ? "bg-violet-400 cursor-not-allowed"
                : "bg-[#8b5cf6] hover:bg-[#7c3aed]"
            }
          `}
        >
          {
            generating
              ? "Generating..."
              : "Generate Outline"
          }
        </button>

        {/* LOAD */}

        <button

          onClick={() =>

            document

              .getElementById(
                "lesson-file"
              )

              .click()
          }

          className="

            flex-1

            bg-white

            border
            border-[#ddd6fe]

            py-4

            rounded-2xl

            hover:bg-[#faf8ff]

            transition
          "
        >

          Load Draft

        </button>

      </div>



      {/* ========================= */}
      {/* EMPTY STATE */}
      {/* ========================= */}

      {

        !lesson && (

          <div
          className="
          bg-white/80

          backdrop-blur

          rounded-[32px]

          border
          border-white

          shadow-sm

          p-14

          text-center
          "
          >

          <div
          className="
          text-5xl
          mb-4
          "
          >
          🪄
          </div>

          <h3
          className="
          text-xl
          font-semibold
          mb-2
          "
          >
          Ready to create a lesson
          </h3>

          <p
          className="
          text-zinc-500
          "
          >
          Fill in lesson details and generate your first outline.
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

                      w-full

                      bg-white/90

                      backdrop-blur

                      rounded-[32px]

                      border
                      border-white

                      shadow-[0_8px_30px_rgba(139,92,246,0.08)]

                      p-8

                      overflow-visible
                    "
                  >

                    <div

                      className="
                        flex

                        justify-between

                        items-center

                        mb-6

                        gap-6
                      "
                    >

                      {/* LEFT SIDE */}

                      <div

                        className="
                          flex
                          items-center

                          gap-2

                          flex-1

                          min-w-[250px]
                        "
                      >

                        <input

                          value={section.type}

                          onChange={(e) =>

                            updateSection(

                              index,

                              "type",

                              e.target.value
                            )
                          }

                          className="

                            flex-1

                            min-w-[120px]

                            text-xl
                            font-semibold

                            text-zinc-800

                            border-none

                            outline-none

                            bg-transparent
                          "
                        />

                        <button

                          onClick={() =>

                            moveSectionUp(
                              index
                            )
                          }

                          className="
                            p-2

                            rounded-xl

                            hover:bg-violet-100

                            text-zinc-500
                          "
                        >

                          <ArrowUp size={16} />

                        </button>

                        <button

                          onClick={() =>

                            moveSectionDown(
                              index
                            )
                          }

                          className="
                            p-2

                            rounded-xl

                            hover:bg-violet-100

                            text-zinc-500
                          "
                        >

                          <ArrowDown size={16} />

                        </button>

                        <button

                          onClick={() =>

                            deleteSection(
                              index
                            )
                          }

                          className="
                            p-2

                            rounded-xl

                            hover:bg-red-100

                            text-red-500
                          "
                        >

                          <Trash2 size={16} />

                        </button>

                      </div>

                      {/* RIGHT SIDE */}

                      <div

                        className="
                          flex
                          items-center

                          gap-2

                          shrink-0
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

                            w-[70px]

                            bg-[#f3edff]

                            border
                            border-[#ddd6fe]

                            text-[#7c3aed]

                            rounded-full

                            px-3
                            py-2

                            text-center

                            text-sm

                            font-medium
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
            <button

              onClick={addSection}

              className="

                bg-white

                border
                border-[#ddd6fe]

                text-[#7c3aed]

                px-6
                py-4

                rounded-2xl

                self-start
              "
            >

              + Add Section

            </button>

            {/* SAVE */}

            <div

              className="
                flex
                gap-4
                mt-4
              "
            >

              <button

                onClick={clearLesson}

                className="

                  flex-1

                  bg-white

                  border
                  border-red-200

                  text-red-500

                  py-4

                  rounded-2xl

                  hover:bg-red-50

                  transition
                "
              >

                New Outline

              </button>

              <button

                onClick={saveLocalDraft}

                className="

                  flex-1

                  bg-[#8b5cf6]
                  hover:bg-[#7c3aed]

                  text-white

                  py-4

                  rounded-2xl

                  shadow-lg

                  transition
                "
              >

                Save Draft

              </button>

            </div>
            

          </div>
        )
      }
    <input

  type="file"

  accept=".json"

  id="lesson-file"

  style={{
    display: "none"
  }}

  onChange={
    loadLocalDraft
  }
/>
        

    </MainLayout>
  );
}