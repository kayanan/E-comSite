import { clearToken } from "../auth/auth";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        clearToken();
        navigate("/login", { replace: true });
      }}
    >
      Logout
    </button>
  );
}