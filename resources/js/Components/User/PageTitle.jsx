export function PageTitle({ title }) {
    return (
      <div
        className="bg-gray-100 h-14 flex items-center px-6 border-b fixed top-16 z-10"
        style={{
          left: "6rem",
          width: "calc(100% - 6rem)",
        }}
      >
        <h1 className="text-gray-600 font-medium text-lg">{title}</h1>
      </div>
    )
  }
  
  