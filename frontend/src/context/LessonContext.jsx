import {
  createContext,
  useContext,
  useState
} from "react";

const LessonContext =
  createContext();

export function LessonProvider({
  children
}) {

  const [

    lesson,

    setLesson

  ] = useState(null);

  const [

    content,

    setContent

  ] = useState({});

  const [

    hasUnsavedChanges,

    setHasUnsavedChanges

  ] = useState(false);

  return (

    <LessonContext.Provider

      value={{

        lesson,
        setLesson,

        content,
        setContent,

        hasUnsavedChanges,
        setHasUnsavedChanges

      }}
    >

      {children}

    </LessonContext.Provider>
  );
}

export function useLesson() {

  return useContext(
    LessonContext
  );
}