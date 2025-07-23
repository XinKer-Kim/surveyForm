import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import CustomInput from '@/components/form/Input';

const FormBuilderPage = () => {
  const { formId } = useParams(); // formId 파라미터 가져오기
  const navigate = useNavigate();
  const [formElements, setFormElements] = useState<any[]>([]); // 폼 요소 상태 관리

  useEffect(() => {
    if (formId && formId !== 'new') {
      // 기존 설문 데이터를 불러오는 로직 (Supabase 연동 필요)
      console.log(`Editing form with ID: ${formId}`);
      // 예시로 폼 요소 데이터를 설정
      setFormElements([{ type: 'text', label: '기존 질문 1' }]);
    } else {
      // 새로운 폼 생성
      console.log('Creating a new form');
      setFormElements([]); // 초기화
    }
  }, [formId]);

  const handleAddInput = () => {
    setFormElements([
      ...formElements,
<<<<<<< HEAD
      { type: 'text', label: `질문 ${formElements.length + 1}` },
=======
      { type: "text_short", text: "", order_number: formElements.length + 1 },
>>>>>>> origin/main
    ]);
  };

  const handleSaveForm = () => {
    // 폼 데이터를 저장하는 로직 (Supabase 연동 필요)
    console.log('Saving form:', formElements);
    // 저장이 완료되면 사용자를 홈페이지로 리다이렉트하거나 다른 페이지로 이동
    navigate('/');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {formId === 'new' ? '새 설문 만들기' : '설문 수정'}
      </h1>
      <div className="mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={handleAddInput}
        >
          질문 추가
        </button>
        {/* 다른 폼 요소 추가 버튼들을 만들 수 있습니다. */}
      </div>
      <div>
        {formElements.map((element, index) => (
<<<<<<< HEAD
          <div key={index} className="mb-4">
            {element.type === 'text' && (
              <CustomInput
                label={element.label}
                placeholder="여기에 질문을 입력하세요"
              />
            )}
            {/* 다른 폼 요소에 대한 처리 */}
          </div>
=======
          <Question
            key={index}
            question={{ ...element, order_number: index + 1 }}
            onQuestionChange={(updatedQuestion) => {
              const newElements = [...formElements];
              newElements[index] = updatedQuestion;
              setFormElements(newElements);
            }}
            onDuplicate={() => {
              const newElements = [...formElements];
              newElements.splice(index + 1, 0, { ...element });
              setFormElements(newElements);
            }}
            onDelete={() => {
              const newElements = formElements.filter((_, i) => i !== index);
              setFormElements(newElements);
            }}
          />
>>>>>>> origin/main
        ))}
      </div>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleSaveForm}
      >
        폼 저장
      </button>
      <Link to="/" className="inline-block ml-2 text-gray-500 hover:underline">
        취소
      </Link>
    </div>
  );
};

export default FormBuilderPage;
