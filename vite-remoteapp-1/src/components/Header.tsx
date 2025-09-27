import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="w-full h-full flex items-center gap-x-2 p-2">
      <Link to="/" className="px-4 p-button">
        Home
      </Link>
      <Link to="/sub-page-1" className="px-4 p-button">
        Sub Page 1
      </Link>
      <Link to="/sub-page-2" className="px-4 p-button">
        Sub Page 2
      </Link>
    </div>
  );
};

export default Header;
