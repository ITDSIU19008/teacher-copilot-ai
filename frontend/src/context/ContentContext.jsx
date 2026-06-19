import {

  createContext,
  useContext,
  useState

} from "react";

const ContentContext =
  createContext();

export function ContentProvider({

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

    selectedSection,

    setSelectedSection

  ] = useState(0);

  const [

    hasUnsavedChanges,

    setHasUnsavedChanges

  ] = useState(false);

  return (

    <ContentContext.Provider

      value={{

        lesson,
        setLesson,

        content,
        setContent,

        selectedSection,
        setSelectedSection,

        hasUnsavedChanges,
        setHasUnsavedChanges

      }}
    >

      {children}

    </ContentContext.Provider>
  );
}

export function useContent() {

  return useContext(
    ContentContext
  );
}