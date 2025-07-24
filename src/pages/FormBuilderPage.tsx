import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Question from '@/components/form/Question';
import { supabase } from '@/supabaseClient';
import QuestionTitle from '@/components/form/QuestionTitle';
import { v4 as uuidv4 } from 'uuid';

const FormBuilderPage = () => {
  const { formId } = useParams(); // formId 파라미터 가져오기
  const navigate = useNavigate();
  const [formElements, setFormElements] = useState<any[]>([]); // 폼 요소 상태 관리
  const [title, setTitle] = useState(''); // 폼 제목
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (formId && formId !== 'new') {
      const loadForm = async () => {
        const { data: form } = await supabase
          .from('forms')
          .select('*')
          .eq('id', formId)
          .single();

        const { data: questions } = await supabase
          .from('questions')
          .select('*')
          .eq('form_id', formId)
          .order('order_number', { ascending: true });

        setTitle(form.title);
        setDescription(form.description);
        setFormElements(questions || []);
      };

      loadForm();
    } else {
      setFormElements([]); // 새 설문
      setTitle('');
      setDescription('');
    }
  }, [formId]);

  const handleAddInput = () => {
    setFormElements([
      ...formElements,
      {
        id: uuidv4(), // ✅ 고유 ID 부여
        type: 'text_short',
        text: '',
        order_number: formElements.length + 1,
        is_required: false,
      },
    ]);
  };

  const handleAddPage = () => {
    console.log('페이지 추가');
  };

  const handleSaveForm = async () => {
    if (formId === 'new') {
      // 1. 폼 생성
      const { data: formData, error: formError } = await supabase
        .from('forms')
        .insert({
          user_id: '1dd927e3-2b9d-4d7a-a23d-578e1934bac3', // 하드코딩된 테스트 유저
          title,
          description,
        })
        .select()
        .single();

      if (formError || !formData) {
        alert('폼 저장 실패');
        return;
      }

      // 2. 질문 저장
      const questionsToInsert = formElements.map((q, i) => ({
        ...q,
        form_id: formData.id,
        order_number: i + 1,
      }));

      await supabase.from('questions').insert(questionsToInsert);
    } else {
      // 수정 모드 (questions는 재업로드 방식)
      await supabase
        .from('forms')
        .update({ title, description })
        .eq('id', formId);

      await supabase.from('questions').delete().eq('form_id', formId);

      const questionsToInsert = formElements.map((q, i) => ({
        ...q,
        form_id: formId,
        order_number: i + 1,
      }));

      const { error: insertError } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (insertError) {
        console.error('질문 저장 실패:', insertError);
        alert('질문 저장 중 오류가 발생했습니다.');
        return;
      }
    }

    alert('저장 완료!');
    navigate('/list');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {formId === 'new' ? '새 설문 만들기' : '설문 수정'}
      </h1>
      <div className="mb-4">
        <QuestionTitle
          handleAddInput={handleAddInput}
          handleAddPage={handleAddPage}
        />
      </div>
      <div>
        {formElements.map((element, index) => (
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
