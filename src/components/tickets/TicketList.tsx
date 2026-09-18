import React from 'react';
import { Empty, Button } from 'antd';
import { ArrowUpDown } from 'lucide-react';
import type { ITicketItem, ITicketFilter } from '@/types/ticket';
import { TicketCard } from './TicketCard';

interface TicketListProps {
  tickets: ITicketItem[];
  selectedTicketId?: string;
  onSelectTicket: (ticket: ITicketItem) => void;
  onViewDetails?: (ticket: ITicketItem) => void;
  sortBy: ITicketFilter['sortBy'];
  onSortByChange: (sort: ITicketFilter['sortBy']) => void;
  onResetFilters: () => void;
}

export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
  onViewDetails,
  sortBy,
  onSortByChange,
  onResetFilters,
}) => {
  return (
    <div className="ticket-list">
      {/* 1. List Header & Sorting Tabs */}
      <div className="ticket-list__header">
        <div className="ticket-list__count-summary">
          <span className="ticket-list__count-number">{tickets.length}</span>
          <span className="ticket-list__count-label">chuyến đi khả dụng</span>
        </div>

        <div className="ticket-list__sort-group">
          <span className="ticket-list__sort-label">
            <ArrowUpDown size={14} className="ticket-list__sort-icon" />
            Sắp xếp:
          </span>

          <div className="ticket-list__sort-tabs">
            <button
              type="button"
              onClick={() => onSortByChange('price_asc')}
              className={`ticket-list__sort-btn ${
                sortBy === 'price_asc' ? 'ticket-list__sort-btn--active' : ''
              }`}
            >
              Giá thấp nhất
            </button>
            <button
              type="button"
              onClick={() => onSortByChange('duration_asc')}
              className={`ticket-list__sort-btn ${
                sortBy === 'duration_asc' ? 'ticket-list__sort-btn--active' : ''
              }`}
            >
              Nhanh nhất
            </button>
            <button
              type="button"
              onClick={() => onSortByChange('departure_asc')}
              className={`ticket-list__sort-btn ${
                sortBy === 'departure_asc' ? 'ticket-list__sort-btn--active' : ''
              }`}
            >
              Giờ đi sớm nhất
            </button>
            <button
              type="button"
              onClick={() => onSortByChange('rating_desc')}
              className={`ticket-list__sort-btn ${
                sortBy === 'rating_desc' ? 'ticket-list__sort-btn--active' : ''
              }`}
            >
              Đánh giá cao
            </button>
          </div>
        </div>
      </div>

      {/* 2. Tickets Stack */}
      {tickets.length > 0 ? (
        <div className="ticket-list__cards">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              isSelected={selectedTicketId === ticket.id}
              onSelect={onSelectTicket}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="ticket-list__empty">
          <Empty
            description={
              <div className="ticket-list__empty-desc">
                <strong>Không tìm thấy chuyến nào phù hợp với bộ lọc</strong>
                <p>Hãy thử mở rộng khoảng giá hoặc bỏ bớt các tiêu chí lọc thời gian.</p>
              </div>
            }
          >
            <Button type="primary" onClick={onResetFilters} className="ticket-list__reset-empty-btn">
              Đặt lại toàn bộ bộ lọc
            </Button>
          </Empty>
        </div>
      )}
    </div>
  );
};
