export function StarRating({
  rating,
  reviewCount,
  showCount = true,
  interactive = false,
  onChange,
}: {
  rating: number;
  reviewCount?: number;
  showCount?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="hnl-star-rating" aria-label={`Rating: ${rating} out of 5 stars`}>
      <div className="hnl-stars" role={interactive ? "radiogroup" : "img"}>
        {stars.map((star) => {
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;

          if (interactive && onChange) {
            return (
              <button
                key={star}
                type="button"
                className={`hnl-star-btn ${filled ? "is-filled" : ""}`}
                onClick={() => onChange(star)}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
              >
                ★
              </button>
            );
          }

          return (
            <span
              key={star}
              className={`hnl-star ${filled ? "is-filled" : half ? "is-half" : "is-empty"}`}
              aria-hidden="true"
            >
              ★
            </span>
          );
        })}
      </div>
      {showCount && (
        <span className="hnl-rating-number">
          {rating.toFixed(1)}
          {typeof reviewCount === "number" && (
            <span className="hnl-review-count"> ({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
}
