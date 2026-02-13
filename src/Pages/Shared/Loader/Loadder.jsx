import { TbFidgetSpinner } from "react-icons/tb";

const Loader = ({
  size = 32,              // icon size in px
  color = "text-orange-600",
  fullScreen = false,     // page loader or inline
  text = "Loading..."
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3
        ${fullScreen ? "min-h-screen w-full" : "py-10"}
      `}
    >
      <TbFidgetSpinner
        size={size}
        className={`animate-spin ${color}`}
      />

      {text && (
        <p className="text-sm text-gray-500 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
