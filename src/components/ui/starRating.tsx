import React from "react";

interface StarRatingProps {
  score: number;
  unit: number;
  onChange: (value: number) => void;
  maxStars?: number; // 최대 별점 개수 (기본값 5)
}

const starRating: React.FC<StarRatingProps> = ({
  score,
  unit,
  onChange,
  maxStars = 5,
}) => {
  const handleClick = (index: number, e: React.MouseEvent) => {
    let newScore = 0;
    if (unit === 0.5) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const widthPerStar = rect.width; // 꽉 찬 별을 기준으로 삼음

      if (clickX <= widthPerStar / 2) {
        newScore = index + 0.5; // 반 별
      } else {
        newScore = index + 1; // 꽉 찬 별
      }
    } else {
      newScore = index + 1;
    }
    onChange(newScore);
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }, (_, i) => {
        const fullStarThreshold = i + 1;
        const halfStarThreshold = i + 0.5;

        let icon = "☆"; // 빈 별
        let textColor = "text-gray-300";

        if (score >= fullStarThreshold) {
          icon = "★"; // 꽉 찬 별
          textColor = "text-yellow-400";
        } else if (unit === 0.5 && score >= halfStarThreshold) {
          icon = "⯪"; // 반 별
          textColor = "text-yellow-300";
        }

        return (
          <span
            key={i}
            className="cursor-pointer text-2xl"
            onClick={(e) => handleClick(i, e)}
            onMouseMove={(e) => {
              // 마우스 오버 시 반 별/꽉 찬 별 미리보기 (선택 사항)
              if (unit === 0.5) {
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const widthPerStar = rect.width;
                if (clickX <= widthPerStar / 2) {
                  e.currentTarget.style.color = "gold"; // 임시 색상
                } else {
                  e.currentTarget.style.color = "goldenrod"; // 임시 색상
                }
              }
            }}
            onMouseLeave={(e) => {
              if (unit === 0.5) {
                e.currentTarget.style.color = ""; // 색상 초기화
              }
            }}
          >
            <span className={textColor}>{icon}</span>
          </span>
        );
      })}
    </div>
  );
};

export default starRating;
