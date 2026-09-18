import React, { useState } from 'react';
import { Star, CheckCircle2, RotateCcw, Send, MessageSquareHeart } from 'lucide-react';
import type { ICsatRating } from '../../../../types/chatSession.types';
import './RatingFeedbackBox.scss';

const CSAT_TAGS = [
  'Nhiệt tình & Thân thiện',
  'Xử lý nhanh',
  'Giải thích rõ ràng',
  'Hài lòng',
  'Giải quyết triệt để'
];

const SCORE_LABELS: Record<number, string> = {
  1: 'Rất không hài lòng',
  2: 'Chưa hài lòng',
  3: 'Bình thường',
  4: 'Hài lòng',
  5: 'Rất hài lòng & Xuất sắc'
};

interface RatingFeedbackBoxProps {
  onRatingSubmit: (rating: ICsatRating) => void;
  onRestartSession: () => void;
  isSubmitted: boolean;
  agentName: string;
}

export const RatingFeedbackBox: React.FC<RatingFeedbackBoxProps> = ({
  onRatingSubmit,
  onRestartSession,
  isSubmitted,
  agentName
}) => {
  const [score, setScore] = useState<number>(5);
  const [hoverScore, setHoverScore] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Nhiệt tình & Thân thiện', 'Xử lý nhanh']);
  const [comment, setComment] = useState<string>('');

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRatingSubmit({
      score,
      tags: selectedTags,
      feedback: comment.trim() || undefined,
      submittedAt: new Date().toISOString()
    });
  };

  const currentDisplayScore = hoverScore || score;

  if (isSubmitted) {
    return (
      <div className="support-rating-box support-rating-box--submitted">
        <div className="support-rating-box__submitted-card">
          <div className="support-rating-box__check-icon">
            <CheckCircle2 size={32} color="#10b981" />
          </div>
          <h4 className="support-rating-box__submitted-title">Cảm ơn Quý khách đã đánh giá!</h4>
          <p className="support-rating-box__submitted-desc">
            Ý kiến của Quý khách giúp OmniTravel và chuyên viên {agentName} không ngừng nâng cao chất lượng dịch vụ.
          </p>

          <button
            type="button"
            className="support-rating-box__restart-btn"
            onClick={onRestartSession}
          >
            <RotateCcw size={14} /> Bắt đầu cuộc trò chuyện mới
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="support-rating-box" role="region" aria-label="Khảo sát chất lượng hỗ trợ">
      <div className="support-rating-box__header">
        <div className="support-rating-box__header-icon">
          <MessageSquareHeart size={18} color="var(--color-primary, #0066cc)" />
        </div>
        <div className="support-rating-box__header-text">
          <h4 className="support-rating-box__title">Đánh giá chất lượng hỗ trợ</h4>
          <span className="support-rating-box__subtitle">
            Chuyên viên {agentName} đã hỗ trợ Quý khách như thế nào?
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="support-rating-box__form">
        {/* Star Rating Bar */}
        <div className="support-rating-box__stars-wrap">
          <div className="support-rating-box__stars">
            {[1, 2, 3, 4, 5].map((starVal) => (
              <button
                key={starVal}
                type="button"
                className={`support-rating-box__star-btn ${
                  starVal <= currentDisplayScore ? 'support-rating-box__star-btn--active' : ''
                }`}
                onMouseEnter={() => setHoverScore(starVal)}
                onMouseLeave={() => setHoverScore(0)}
                onClick={() => setScore(starVal)}
                aria-label={`${starVal} sao`}
              >
                <Star
                  size={24}
                  fill={starVal <= currentDisplayScore ? '#f59e0b' : 'none'}
                  color={starVal <= currentDisplayScore ? '#f59e0b' : '#cbd5e1'}
                />
              </button>
            ))}
          </div>
          <span className="support-rating-box__score-label">
            {SCORE_LABELS[currentDisplayScore] || 'Hài lòng'}
          </span>
        </div>

        {/* Quick Tag Pills */}
        <div className="support-rating-box__tags-grid">
          {CSAT_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                className={`support-rating-box__tag-pill ${
                  isSelected ? 'support-rating-box__tag-pill--selected' : ''
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Optional Comment */}
        <input
          type="text"
          className="support-rating-box__comment-input"
          placeholder="Góp ý thêm cho nhân viên (không bắt buộc)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* Action Buttons */}
        <div className="support-rating-box__actions">
          <button type="submit" className="support-rating-box__submit-btn">
            <Send size={13} /> Gửi đánh giá
          </button>

          <button
            type="button"
            className="support-rating-box__restart-btn support-rating-box__restart-btn--outline"
            onClick={onRestartSession}
          >
            <RotateCcw size={13} /> Bắt đầu cuộc trò chuyện mới
          </button>
        </div>
      </form>
    </div>
  );
};
