import { useParams } from "react-router-dom";

const ResponsePage = () => {
  const { formId } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">폼 응답</h1>
      <p>폼 ID: {formId}</p>
      {/* 폼 응답 내용 표시 */}
    </div>
  );
};

export default ResponsePage;
