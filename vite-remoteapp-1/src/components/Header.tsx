import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="w-full h-full flex items-center gap-x-2 p-2">
      <Link to="/" className="px-4 p-button">
        Home
      </Link>
      <Link to="/all-questions" className="px-4 p-button">
        All Questions
      </Link>
      <Link to="/categories" className="px-4 p-button">
        Categories
      </Link>
    </div>
  );
};

export default Header;
