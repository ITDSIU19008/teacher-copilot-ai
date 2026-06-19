import {

  useState,
  useEffect

} from "react";

import {

  ArrowUp,
  ArrowDown,
  Trash2,
  Plus

} from "lucide-react";

import MainLayout from
"../layouts/MainLayout";

import {
  useContent
} from "../context/ContentContext";

const API_URL =
  import.meta.env.VITE_API_URL;

export default function ContentBuilder() {

//   const [

//     lesson,

//     setLesson

//   ] = useState(null);

//   const [

//     content,

//     setContent

//   ] = useState({});

//   const [

//     selectedSection,

//     setSelectedSection

//   ] = useState(0);
const {

    lesson,
    setLesson,

    content,
    setContent,

    selectedSection,
    setSelectedSection,

    hasUnsavedChanges,
    setHasUnsavedChanges

  } = useContent();


  const [

    generating,

    setGenerating

  ] = useState(false);

  const [

  history,

  setHistory

] = useState([]);

  // =====================
  // LOAD OUTLINE
  // =====================

  async function loadOutline(
    event
  ) {

    try {

      const file =

        event.target.files[0];

      if (!file)
        return;

      const text =

        await file.text();

      const lessonData =

        JSON.parse(text);

      setLesson(
        lessonData
      );

      setContent({});

      setSelectedSection(
        0
      );

    } catch (error) {

      console.error(error);

      alert(
        "Invalid outline file."
      );
    }
  }


  async function loadDraft(
    event
  ) {

    try {

      const file =
        event.target.files[0];

      if (!file)
        return;

      const text =
        await file.text();

      const data =
        JSON.parse(text);

      setLesson(
        data.lesson
      );

      setContent(
        data.content || {}
      );

      setSelectedSection(
        0
      );

      setHasUnsavedChanges(
        false
      );

    } catch (error) {

      console.error(error);

      alert(
        "Invalid draft file."
      );

    }
  }

  

  // =====================
  // GENERATE CONTENT
  // =====================

  async function generateContent() {

    if (!lesson)
      return;

    try {

      setGenerating(true);

      const response =

        await fetch(

          // "http://127.0.0.1:8000/generate_section",
          `${API_URL}/generate_section`,
          
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              outline:
                lesson,

              section_index:
                selectedSection
            })
          }
        );

      const data =
        await response.json();

      setContent({

        ...content,

        [selectedSection]:
          data
      });

    } catch (error) {

      console.error(error);

      alert(
        "Generate failed."
      );

    } finally {

      setGenerating(false);
    }
  }

  function formatFieldName(
    field
  ) {

    const labels = {

      section_title:
        "Section Title",

      teaching_steps:
        "Teaching Steps",

      teacher_script:
        "Teacher Script",

      student_activities:
        "Student Activities",

      materials:
        "Materials",

      expected_answers:
        "Expected Answers",

      hint_answers:
        "Hint Answers",

      scaffolding:
        "Scaffolding Support",

      teacher_notes:
        "Teacher Notes"
    };

    return (
      labels[field]
      || field
    );
  }


  // =====================
  // SAVE CONTENT
  // =====================

  function saveContentDraft() {

    const payload = {

      lesson,

      content
    };

    const json =
      JSON.stringify(

        payload,

        null,

        2
      );

    const blob =
      new Blob(

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

      `${lesson.topic}_content.json`;

    a.click();

    URL.revokeObjectURL(
      url
    );
  }

  function clearContent() {

    const confirmed =

      window.confirm(

        "Create a new content workspace?"
      );

    if (!confirmed)
      return;

    setLesson(
      null
    );

    setContent(
      {}
    );

    setSelectedSection(
      0
    );

    setHistory(
      []
    );

    setHasUnsavedChanges(
      false
    );
  }


  function updateContentField(
    key,
    value
    ) {

    setHistory(

      prev => [

        ...prev,

        JSON.parse(
          JSON.stringify(content)
        )
      ]
    );  

    setContent({

        ...content,

        [selectedSection]: {

        ...content[selectedSection],

        [key]: value
        }
    });

    setHasUnsavedChanges(
        true
    );
    }


  function updateArrayField(fieldName,index,value
    ) {

    setHistory(

      prev => [

        ...prev,

        JSON.parse(
          JSON.stringify(content)
        )
      ]
    );

    const updated = [

        ...content[
        selectedSection
        ][fieldName]
    ];

    updated[index] =
        value;

    setContent({

        ...content,

        [selectedSection]: {

        ...content[
            selectedSection
        ],

        [fieldName]:
            updated
        }
    });

    setHasUnsavedChanges(
        true
    );
    }

  function updateObjectField(

    fieldName,

    itemIndex,

    objectKey,

    value

  ) {

    setHistory(

      prev => [

        ...prev,

        JSON.parse(
          JSON.stringify(content)
        )
      ]
    );



    const updated = [

      ...content[
        selectedSection
      ][fieldName]
    ];

    updated[itemIndex] = {

      ...updated[
        itemIndex
      ],

      [objectKey]:
        value
    };

    setContent({

      ...content,

      [selectedSection]: {

        ...content[
          selectedSection
        ],

        [fieldName]:
          updated
      }
    });

    setHasUnsavedChanges(
      true
    );
  }


    function addArrayItem(
    fieldName
  ) {

    setHistory(

      prev => [

        ...prev,

        JSON.parse(
          JSON.stringify(content)
        )
      ]
    );

    const updated = [

      ...content[
        selectedSection
      ][fieldName],

      ""
    ];

    setContent({

      ...content,

      [selectedSection]: {

        ...content[
          selectedSection
        ],

        [fieldName]:
          updated
      }
    });

    setHasUnsavedChanges(
      true
    );
  }

  function removeArrayItem(
    fieldName,
    index
  ) {

    setHistory(

      prev => [

        ...prev,

        JSON.parse(
          JSON.stringify(content)
        )
      ]
    );

    const updated =

      content[
        selectedSection
      ][fieldName]
        .filter(

          (_ , i) =>

          i !== index
        );

    setContent({

      ...content,

      [selectedSection]: {

        ...content[
          selectedSection
        ],

        [fieldName]:
          updated
      }
    });

    setHasUnsavedChanges(
      true
    );
  }

  function undoChange() {

    if (
      history.length === 0
    )
      return;

    const previous =

      history[
        history.length - 1
      ];

    setContent(
      previous
    );

    setHistory(

      history.slice(
        0,
        -1
      )
    );
  }

  useEffect(() => {

    const handleKeyDown = (

      event

    ) => {

      const isUndo =

        (event.ctrlKey ||
        event.metaKey)

        &&

        event.key === "z";

      if (

        isUndo

        &&

        history.length > 0

      ) {

        event.preventDefault();

        undoChange();
      }
    };

    window.addEventListener(

      "keydown",

      handleKeyDown
    );

    return () =>

      window.removeEventListener(

        "keydown",

        handleKeyDown
      );

  }, [history]);

  function moveArrayItemUp(
    fieldName,
    index
  ) {

    if (index === 0)
      return;

    const updated = [

      ...content[
        selectedSection
      ][fieldName]
    ];

    [

      updated[index],

      updated[index - 1]

    ] = [

      updated[index - 1],

      updated[index]

    ];

    setContent({

      ...content,

      [selectedSection]: {

        ...content[
          selectedSection
        ],

        [fieldName]:
          updated
      }
    });
  }

  function moveArrayItemDown(
    fieldName,
    index
  ) {

    const updated = [

      ...content[
        selectedSection
      ][fieldName]
    ];

    if (

      index ===

      updated.length - 1

    )
      return;

    [

      updated[index],

      updated[index + 1]

    ] = [

      updated[index + 1],

      updated[index]

    ];

    setContent({

      ...content,

      [selectedSection]: {

        ...content[
          selectedSection
        ],

        [fieldName]:
          updated
      }
    });
  }

  function renderContentField(
    key,
    value
    ) {

    // STRING

    if (
        typeof value === "string"
    ) {

        return (

        <textarea

            value={value}

            onChange={(e) =>

            updateContentField(

                key,

                e.target.value
            )
            }

            className="

            w-full

            border
            border-[#ebe5ff]

            rounded-2xl

            p-4

            min-h-[120px]
            "
        />

        );
    }

    // ARRAY

    if (

        Array.isArray(value)

        &&

        value.length === 0

        ) {

        return (

            <div

            className="
                text-zinc-400
            "
            >

            No items

            </div>
        );
        }

    // ARRAY

if (
  Array.isArray(value)
) {

  return (

    <div
      className="
        flex
        flex-col
        gap-4
      "
    >

      {

        value.map(

          (item, index) => (

            <div

              key={index}

              className="

                border
                border-[#ebe5ff]

                rounded-2xl

                p-4
              "
            >

              {/* ACTIONS */}

              <div

                className="
                  flex
                  justify-end
                  gap-2
                  mb-3
                "
              >

                <button

                  onClick={() =>

                    moveArrayItemUp(

                      key,
                      index
                    )
                  }

                  className="
                    text-zinc-500
                  "
                >

                  ↑

                </button>

                <button

                  onClick={() =>

                    moveArrayItemDown(

                      key,
                      index
                    )
                  }

                  className="
                    text-zinc-500
                  "
                >

                  ↓

                </button>

                <button

                  onClick={() =>

                    removeArrayItem(

                      key,
                      index
                    )
                  }

                  className="
                    text-red-500
                  "
                >

                  ✕

                </button>

              </div>

              {

                typeof item === "object"

                ?

                Object.entries(item).map(

                  ([k, v]) => (

                    <div

                      key={k}

                      className="mb-3"
                    >

                      <label

                        className="
                          block
                          text-xs
                          text-zinc-500
                          mb-1
                        "
                      >

                        {k}

                      </label>

                      <textarea

                        value={v}

                        onChange={(e) =>

                          updateObjectField(

                            key,

                            index,

                            k,

                            e.target.value
                          )
                        }

                        rows={3}

                        className="
                          w-full

                          border
                          border-[#ebe5ff]

                          rounded-xl

                          p-3

                          resize-y

                          outline-none

                          focus:border-violet-500
                        "
                      />

                    </div>
                  )
                )

                :

                <textarea

                  value={item}

                  onChange={(e) =>

                    updateArrayField(

                      key,

                      index,

                      e.target.value
                    )
                  }

                  rows={3}

                  className="

                    w-full

                    border
                    border-[#ebe5ff]

                    rounded-xl

                    p-3

                    resize-y

                    outline-none

                    focus:border-violet-500
                  "
                />

              }

            </div>
          )
        )
      }

      <button

        onClick={() =>

          addArrayItem(
            key
          )
        }

        className="

          self-start

          px-4
          py-2

          rounded-xl

          border
          border-[#ddd6fe]

          text-violet-600
        "
      >

        + Add Item

      </button>

    </div>
  );
}

    return (

        <textarea

            value={

            JSON.stringify(

                value,

                null,

                2
            )
            }

            rows={8}

            readOnly

            className="

            w-full

            bg-[#faf8ff]

            border
            border-[#ebe5ff]

            rounded-2xl

            p-4

            font-mono

            text-sm
            "
        />
        );
    }


  const currentSection =

    lesson
      ? lesson.sections[
          selectedSection
        ]
      : null;

  const currentContent =

    content[
      selectedSection
    ];

  return (

    <MainLayout>

      {/* HEADER */}

      <div className="mb-8">

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

          Content Builder

        </h1>

        <p

          className="
            text-zinc-500
            mt-2
          "
        >

          Generate detailed teaching content
          from lesson outlines.

        </p>

      </div>

      {/* ACTIONS */}

      <div
        className="
          flex
          gap-4
          mb-8
        "
      >

        <button
          onClick={() =>
            document
              .getElementById(
                "outline-file"
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
          "
        >
          Load Outline
        </button>

        <button
          onClick={() =>
            document
              .getElementById(
                "draft-file"
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
          "
        >
          Load Draft
        </button>

      </div>

      {

        !lesson && (

          <div

            className="
              bg-white

              rounded-3xl

              p-16

              text-center
            "
          >

            <div
              className="
                text-5xl
                mb-4
              "
            >
              📚
            </div>

            <h3
              className="
                text-xl
                font-semibold
              "
            >

              Load an outline first

            </h3>

          </div>
        )
      }

      {

        lesson && (

          <>

            {/* LESSON INFO */}

            <div

              className="
                bg-white

                rounded-3xl

                p-6

                mb-6
              "
            >

              <h2

                className="
                  text-2xl
                  font-bold
                "
              >

                {lesson.topic}

              </h2>

              <p>

                {lesson.course_type}
                {" · "}
                {lesson.band}
                {" · "}
                {lesson.skill}

              </p>

            </div>

            <div

              className="
                grid
                grid-cols-12
                gap-6
              "
            >

              {/* LEFT */}

              <div

                className="
                  col-span-3

                  bg-white

                  rounded-3xl

                  p-4
                "
              >

                {
                lesson.sections.map(

                    (section, index) => (

                    <button

                        key={index}

                        onClick={() =>

                        setSelectedSection(
                            index
                        )
                        }

                        className={`

                        w-full

                        text-left

                        p-4

                        rounded-2xl

                        mb-2

                        flex
                        items-center
                        justify-between

                        transition

                        ${
                            selectedSection === index
                            ? "bg-violet-100 border border-violet-300"
                            : "hover:bg-violet-50"
                        }
                        `}
                    >

                        {/* LEFT */}

                        <div>

                        <div>

                            {section.type}

                        </div>

                        <div

                            className="
                            text-xs
                            text-zinc-500
                            "
                        >

                            {section.timing}
                            min

                        </div>

                        

                        </div>

                        {/* STATUS */}

                        <div>

                        {content?.[index] ? (
                            <div className="
                            w-5
                            h-5
                            rounded-full
                            bg-green-100
                            text-green-600
                            flex
                            items-center
                            justify-center
                            text-xs
                            ">
                            ✓
                            </div>
                        ) : (
                            <div className="
                            w-3
                            h-3
                            rounded-full
                            bg-zinc-300
                            " />
                        )}

                        </div>
                        

                    
                    </button>
                    )
                    
                )
                
                }
                <div

  className="
    mt-6
    pt-6

    border-t
    border-zinc-100

    flex
    flex-col

    gap-3
  "
>

  <button

    onClick={
      saveContentDraft
    }

    className="

      w-full

      bg-[#8b5cf6]

      text-white

      py-3

      rounded-2xl
    "
  >

    Save Draft

      </button>

      <button

        onClick={
          clearContent
        }

        className="

          w-full

          border
          border-red-200

          text-red-500

          py-3

          rounded-2xl

          hover:bg-red-50
        "
      >

        New Content

      </button>

    </div>

              </div>

              

              {/* RIGHT */}

              <div

                className="
                  col-span-9
                "
              >

                <div

                  className="
                    bg-white

                    rounded-3xl

                    p-6

                    mb-6
                  "
                >

                  <h3

                    className="
                      font-bold
                      mb-3
                    "
                  >

                    Selected Section

                  </h3>

                  <p>

                    <b>Type:</b>
                    {" "}
                    {currentSection.type}

                  </p>

                  <p>

                    <b>Objective:</b>
                    {" "}
                    {currentSection.objective}

                  </p>

                  <p>

                    <b>Activity:</b>
                    {" "}
                    {currentSection.activity}

                  </p>

                </div>

                <div

                  className="
                    flex
                    items-center
                    gap-7
                    mb-5
                  "
                >

                <button

                  onClick={
                    generateContent
                  }

                  disabled={
                    generating
                  }

                  className="

                    bg-[#8b5cf6]

                    text-white

                    px-6
                    py-4

                    rounded-2xl

                    mb-6
                  "
                >

                  {

                    generating

                      ? "Generating..."

                      : "Generate Content"

                  }

                </button>
                
                <button

                  onClick={
                    undoChange
                  }

                  disabled={
                    history.length === 0
                  }

                  className="

                    px-4
                    py-4

                    rounded-2xl

                    border
                    border-[#ddd6fe]

                    bg-white

                    disabled:opacity-60
                    mb-6
                    
                  "
                >

                  ↶ Undo

                </button> </div>

                {
                    currentContent && (

                        <div

                        className="

                            bg-white

                            rounded-3xl

                            p-6

                            flex
                            flex-col

                            gap-6
                        "
                        >

                        {

                            Object.entries(

                            currentContent

                            ).map(

                            ([key, value]) => (

                                <div
                                key={key}
                                >

                                <div

                                    className="
                                    text-sm

                                    font-semibold

                                    text-zinc-500

                                    mb-2
                                    "
                                >

                                    {formatFieldName(key)}

                                </div>

                                {

                                    renderContentField(

                                    key,

                                    value
                                    )
                                }

                                </div>
                            )
                            )
                        }

                        </div>
                    )
                    }

              </div>

            </div>

          </>
        )
      }

      <input

        type="file"

        id="outline-file"

        accept=".json"

        style={{
          display:
            "none"
        }}

        onChange={
          loadOutline
        }
      />

      <input

        type="file"

        id="draft-file"

        accept=".json"

        style={{
          display: "none"
        }}

        onChange={
          loadDraft
        }
      />

    </MainLayout>
  );
}