import MainLayout from
"../layouts/MainLayout";


export default function SlideBuilder() {

  return (

    <MainLayout>

      <div
        className="
          flex
          items-center
          justify-between
          mb-8
        "
      >

        <div>

          <h1
            className="
              text-4xl
              font-bold
            "
          >

            Slide Builder

          </h1>

          <p
            className="
              text-zinc-500
              mt-2
            "
          >

            Create presentation slides
            from completed lessons.

          </p>

        </div>

      </div>

      <div
        className="
          bg-white
          p-8
          rounded-2xl
          shadow-sm
        "
      >

        <p
          className="
            text-zinc-500
          "
        >

          Slide generation workspace.

        </p>

      </div>

    </MainLayout>
  );
}