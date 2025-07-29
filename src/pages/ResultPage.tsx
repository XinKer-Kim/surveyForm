import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import StarDisplay from "@/components/ui/starDisplay";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const ResultPage = () => {
  const { formId } = useParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const { data: qData } = await supabase
        .from("questions")
        .select(
          `id, text, type, order_number, min, max, unit, left_label, right_label, options(id, label)`
        )
        .eq("form_id", formId)
        .order("order_number", { ascending: true });

      setQuestions(qData || []);

      const { data: aData } = await supabase
        .from("answers")
        .select("*")
        .in(
          "question_id",
          (qData || []).map((q) => q.id)
        );

      setAnswers(aData || []);
    };

    if (formId) loadData();
  }, [formId]);

  const renderQuestionResult = (q: any) => {
    const relatedAnswers = answers.filter((a) => a.question_id === q.id);

    // 객관식: 막대그래프
    if (["radio", "dropdown"].includes(q.type)) {
      const data = q.options.map((opt) => ({
        name: opt.label,
        count: relatedAnswers.filter((a) => a.option_id === opt.id).length,
      }));

      return (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    // 점수형: 평균 표시
    if (["score"].includes(q.type)) {
      const scores = answers
        .filter((a) => a.question_id === q.id && a.text_answer !== null)
        .map((a) => parseFloat(a.text_answer))
        .filter((v) => !isNaN(v));

      const avg =
        scores.length > 0
          ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
          : "0.00";

      const unit = q.unit ?? 1;
      const min = q.min ?? 0;
      const max = q.max ?? 5;

      const bins = Array.from(
        { length: Math.floor((max - min) / unit) + 1 },
        (_, i) => Number((min + unit * i).toFixed(2))
      );

      const counts = bins.map((val) => ({
        name: val.toString(),
        count: scores.filter((s) => s === val).length,
      }));

      return (
        <div className="space-y-2">
          <p className="text-lg text-yellow-600 font-semibold">
            평균 점수: ⭐ {avg} / {max}
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={counts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#facc15" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }
    if (q.type === "star") {
      const scores = answers
        .filter((a) => a.question_id === q.id && a.text_answer !== null)
        .map((a) => parseFloat(a.text_answer))
        .filter((v) => !isNaN(v));

      const avg =
        scores.length > 0
          ? scores.reduce((a, b) => a + b, 0) / scores.length
          : 0;

      const unit = q.unit ?? 1;
      const min = q.min ?? 0;
      const max = q.max ?? 5;

      const bins = Array.from(
        { length: Math.floor((max - min) / unit) + 1 },
        (_, i) => Number((min + unit * i).toFixed(2))
      );

      const counts = bins.map((val) => ({
        name: val.toString(),
        count: scores.filter((s) => s === val).length,
      }));

      return (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <StarDisplay score={avg} unit={unit} maxStars={max} />
            <p className="text-yellow-600 font-medium text-base">
              {avg.toFixed(2)} / {max}
            </p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={counts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#facc15" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    // 주관식: 텍스트 나열
    return (
      <div className="flex flex-col gap-2">
        {relatedAnswers.length > 0 ? (
          relatedAnswers.map((a, i) => (
            <div
              key={a.id}
              className="border p-2 rounded text-sm text-gray-800 bg-gray-50"
            >
              응답 {i + 1}: {a.text_answer}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 italic">아직 응답 없음</p>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">설문 결과</h1>

      {questions.map((q) => (
        <div
          key={q.id}
          className="mb-8 p-4 border rounded-md bg-white shadow-sm"
        >
          <h2 className="font-semibold text-base mb-3">
            {q.order_number}. {q.text}
          </h2>
          {renderQuestionResult(q)}
        </div>
      ))}
    </div>
  );
};

export default ResultPage;
