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
  const [totalRespondents, setTotalRespondents] = useState<number>(0);

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
      console.log(aData);
      setAnswers(aData || []);

      // 전체 응답자 수 계산 (실제로 답변을 제출한 고유한 respondent_id 수)
      const uniqueRespondents = new Set(
        (aData || [])
          .filter((a) => a.option_id !== null || a.text_answer !== null)
          .map((a) => a.respondent_id)
      );

      setTotalRespondents(uniqueRespondents.size);
    };

    if (formId) loadData();
  }, [formId]);

  const renderQuestionResult = (q: any, index: number) => {
    const relatedAnswers = answers.filter((a) => a.question_id === q.id);
    // 해당 질문에 실제로 답변한 응답자 수
    const questionRespondents = relatedAnswers.filter(
      (a) => a.option_id !== null || a.text_answer !== null
    ).length;
    // 해당 질문의 미응답자 수
    const unanswered = totalRespondents - questionRespondents;
    // 해당 질문의 응답률
    const responseRate =
      totalRespondents > 0
        ? ((questionRespondents / totalRespondents) * 100).toFixed(1)
        : "0.0";

    const typeLabelMap: Record<string, string> = {
      radio: "객관식",
      dropdown: "드롭다운",
      score: "점수형",
      star: "별점형",
      text_short: "단답형",
      text_long: "서술형",
    };

    const chart = (() => {
      if (["radio", "dropdown"].includes(q.type)) {
        const data = q.options.map((opt: any) => ({
          name: opt.label,
          count: relatedAnswers.filter((a) => a.option_id === opt.id).length,
        }));

        return (
          <div className="flex flex-col md:flex-row gap-6 items-start mt-4">
            <div className="w-full md:w-1/2 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {data.map((d) => (
                <div key={d.name} className="flex justify-between">
                  <span>{d.name}</span>
                  <span>
                    {d.count}명 (
                    {questionRespondents > 0
                      ? ((d.count / questionRespondents) * 100).toFixed(0)
                      : 0}
                    %)
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      if (["score", "star"].includes(q.type)) {
        const scores = relatedAnswers
          .filter((a) => a.text_answer !== null)
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
          <div className="space-y-2 mt-4">
            {q.type === "star" ? (
              <div className="flex items-center gap-3">
                <StarDisplay score={avg} unit={unit} maxStars={max} />
                <p className="text-yellow-600 font-medium text-base">
                  {avg.toFixed(2)} / {max}
                </p>
              </div>
            ) : (
              <p className="text-yellow-600 font-medium text-base">
                평균 점수: {avg.toFixed(2)} / {max}
              </p>
            )}
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

      return null;
    })();

    const textAnswers = ["text_short", "text_long"].includes(q.type)
      ? relatedAnswers.map((a, i) => (
          <div
            key={a.id}
            className="border p-2 rounded text-sm text-gray-800 bg-gray-50"
          >
            응답 {i + 1}: {a.text_answer}
          </div>
        ))
      : null;

    return (
      <div
        key={q.id}
        className="rounded-xl border bg-white p-5 shadow-sm dark:bg-zinc-900"
      >
        <div className="mb-3">
          <div className="text-xs text-green-500 font-semibold mb-1">
            📋 {typeLabelMap[q.type] || "질문"}
          </div>
          <div className="text-base font-semibold text-gray-900 dark:text-white">
            Q{index + 1}. {q.text}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            응답 {questionRespondents} · 미응답 {unanswered} · 응답률{" "}
            {responseRate}%
          </div>
        </div>
        {chart}
        {textAnswers && textAnswers.length > 0 && (
          <div className="mt-4 space-y-2">{textAnswers}</div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📊 설문 통계 대시보드</h1>
      <section className="space-y-6">
        {questions.map((q, index) => renderQuestionResult(q, index))}
      </section>
    </div>
  );
};

export default ResultPage;
