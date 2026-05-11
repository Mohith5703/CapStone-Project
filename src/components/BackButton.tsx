import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="back-bar">
      <button type="button" className="back-btn" onClick={goBack}>
        Back
      </button>
    </div>
  );
}
