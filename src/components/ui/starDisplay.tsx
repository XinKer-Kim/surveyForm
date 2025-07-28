const StarDisplay = ({
                         score,
                         maxStars = 5,
                     }: {
    score: number;
    maxStars?: number;
}) => {
    const fillPercentage = (index: number) => {
        const s = Math.min(score, maxStars);
        if (index + 1 <= s) return 100;
        if (index >= s) return 0;
        return Math.round((s - index) * 100); // 0~100%
    };

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: maxStars }).map((_, i) => (
                <div key={i} className="relative w-6 h-6">
                    {/* 빈 별 */}
                    <span className="absolute inset-0 text-gray-300">★</span>

                    {/* 채워진 별 (clip via width %) */}
                    <span
                        className="absolute inset-0 text-yellow-400 overflow-hidden"
                        style={{ width: `${fillPercentage(i)}%` }}
                    >
            ★
          </span>
                </div>
            ))}
        </div>
    );
};
export default StarDisplay;