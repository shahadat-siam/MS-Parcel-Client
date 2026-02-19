import { Link } from "react-router-dom";
import { FaBan, FaHome } from "react-icons/fa";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <FaBan className="text-red-500 text-6xl mb-4" />

      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        403 - Forbidden
      </h1>

      <p className="text-gray-600 text-center max-w-md mb-6">
        You do not have permission to access this page.
        Please contact an administrator if you think this is a mistake.
      </p>

      <Link
        to="/"
        className="btn btn-primary text-black flex items-center gap-2"
      >
        <FaHome /> Go Back Home
      </Link>
    </div>
  );
};

export default Forbidden;
