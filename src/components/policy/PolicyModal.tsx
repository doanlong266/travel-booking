import React, { useState, useMemo, useEffect } from 'react';
import { Modal, Input, message } from 'antd';
import {
  FileText,
  ShieldCheck,
  BookOpen,
  RefreshCw,
  AlertCircle,
  Luggage,
  ShieldAlert,
  Printer,
  Search,
  Clock,
  CheckCircle2,
  PhoneCall,
  Mail,
  Info,
} from 'lucide-react';
import type { PolicyId } from '@/types/policy';
import { POLICIES_DATA } from '@/data/policiesData';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPolicyId?: PolicyId;
}

const ICON_MAP = {
  FileText,
  ShieldCheck,
  BookOpen,
  RefreshCw,
  AlertCircle,
  Luggage,
  ShieldAlert,
};

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  initialPolicyId = 'terms',
}) => {
  const [selectedId, setSelectedId] = useState<PolicyId>(initialPolicyId);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync initial policy when prop changes or modal opens
  useEffect(() => {
    if (isOpen && initialPolicyId) {
      setSelectedId(initialPolicyId);
      setSearchQuery('');
    }
  }, [isOpen, initialPolicyId]);

  // Selected policy object
  const currentPolicy = useMemo(() => {
    return POLICIES_DATA.find((p) => p.id === selectedId) || POLICIES_DATA[0];
  }, [selectedId]);

  // Filtered list of policies if user searches
  const filteredPolicies = useMemo(() => {
    if (!searchQuery.trim()) return POLICIES_DATA;
    const q = searchQuery.toLowerCase();
    return POLICIES_DATA.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(q) || p.shortTitle.toLowerCase().includes(q);
      const matchSummary = p.summary.toLowerCase().includes(q);
      const matchContent = p.sections.some(
        (s) => s.title.toLowerCase().includes(q) || s.content.some((c) => c.toLowerCase().includes(q))
      );
      return matchTitle || matchSummary || matchContent;
    });
  }, [searchQuery]);

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle copy text
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '#' + currentPolicy.id);
    message.success('Đã sao chép liên kết điều khoản vào bộ nhớ tạm!');
  };

  const CurrentIcon = ICON_MAP[currentPolicy.iconName] || FileText;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1080}
      centered
      className="policy-modal"
      destroyOnClose
    >
      <div className="policy-modal__wrapper">
        {/* Sidebar Navigation */}
        <aside className="policy-modal__sidebar">
          <div className="policy-modal__sidebar-header">
            <h3 className="policy-modal__sidebar-title">Chính Sách & Quy Định</h3>
            <span className="policy-modal__sidebar-subtitle">OMNITRAVEL Platform 2026</span>
          </div>

          <div className="policy-modal__search-box">
            <Input
              prefix={<Search size={14} className="policy-modal__search-icon" />}
              placeholder="Tìm kiếm điều khoản..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              className="policy-modal__search-input"
            />
          </div>

          <div className="policy-modal__nav-groups">
            {/* Core Policies */}
            <div className="policy-modal__nav-group">
              <span className="policy-modal__nav-group-title">Pháp lý & Hoạt động</span>
              <ul className="policy-modal__nav-list">
                {filteredPolicies
                  .filter((p) => p.category === 'core')
                  .map((policy) => {
                    const Icon = ICON_MAP[policy.iconName] || FileText;
                    const isActive = policy.id === selectedId;
                    return (
                      <li key={policy.id}>
                        <button
                          type="button"
                          className={`policy-modal__nav-item ${
                            isActive ? 'policy-modal__nav-item--active' : ''
                          }`}
                          onClick={() => setSelectedId(policy.id)}
                        >
                          <Icon size={16} className="policy-modal__nav-icon" />
                          <div className="policy-modal__nav-text">
                            <span className="policy-modal__nav-name">{policy.shortTitle}</span>
                            <span className="policy-modal__nav-badge">{policy.badge}</span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </div>

            {/* Operational Policies */}
            <div className="policy-modal__nav-group">
              <span className="policy-modal__nav-group-title">Nghiệp vụ & Quyền lợi Khách hàng</span>
              <ul className="policy-modal__nav-list">
                {filteredPolicies
                  .filter((p) => p.category === 'operation')
                  .map((policy) => {
                    const Icon = ICON_MAP[policy.iconName] || FileText;
                    const isActive = policy.id === selectedId;
                    return (
                      <li key={policy.id}>
                        <button
                          type="button"
                          className={`policy-modal__nav-item ${
                            isActive ? 'policy-modal__nav-item--active' : ''
                          }`}
                          onClick={() => setSelectedId(policy.id)}
                        >
                          <Icon size={16} className="policy-modal__nav-icon" />
                          <div className="policy-modal__nav-text">
                            <span className="policy-modal__nav-name">{policy.shortTitle}</span>
                            <span className="policy-modal__nav-badge">{policy.badge}</span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>

          <div className="policy-modal__sidebar-footer">
            <div className="policy-modal__contact-box">
              <span className="policy-modal__contact-label">Hỗ trợ pháp lý & CSKH:</span>
              <div className="policy-modal__contact-item">
                <PhoneCall size={13} />
                <strong>1900 6868</strong> (24/7)
              </div>
              <div className="policy-modal__contact-item">
                <Mail size={13} />
                <span>hotro@omnitravel.vn</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="policy-modal__content">
          {/* Header Banner */}
          <div className="policy-modal__header">
            <div className="policy-modal__header-info">
              <div className="policy-modal__badge-row">
                <span className="policy-modal__pill">{currentPolicy.badge}</span>
                <span className="policy-modal__date">
                  <Clock size={12} /> Cập nhật lần cuối: {currentPolicy.lastUpdated}
                </span>
              </div>
              <h2 className="policy-modal__title">
                <CurrentIcon size={24} className="policy-modal__title-icon" />
                {currentPolicy.title}
              </h2>
            </div>

            <div className="policy-modal__actions">
              <button
                type="button"
                className="policy-modal__btn-action"
                onClick={handlePrint}
                title="In văn bản này"
              >
                <Printer size={15} />
                <span>In</span>
              </button>
              <button
                type="button"
                className="policy-modal__btn-action"
                onClick={handleCopyLink}
                title="Sao chép liên kết"
              >
                <CheckCircle2 size={15} />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>

          {/* Summary Box */}
          <div className="policy-modal__summary">
            <Info size={18} className="policy-modal__summary-icon" />
            <p className="policy-modal__summary-text">{currentPolicy.summary}</p>
          </div>

          {/* Detailed Sections */}
          <div className="policy-modal__body">
            {currentPolicy.sections.map((section, idx) => (
              <section key={idx} className="policy-modal__section">
                <h4 className="policy-modal__section-heading">{section.title}</h4>
                
                <div className="policy-modal__section-paragraphs">
                  {section.content.map((p, pIdx) => (
                    <p key={pIdx} className="policy-modal__section-p">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Optional Table */}
                {section.table && (
                  <div className="policy-modal__table-wrapper">
                    <table className="policy-modal__table">
                      <thead>
                        <tr>
                          {section.table.headers.map((h, hIdx) => (
                            <th key={hIdx}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Optional Note / Callout */}
                {section.note && (
                  <div className="policy-modal__note">
                    <AlertCircle size={15} className="policy-modal__note-icon" />
                    <span>{section.note}</span>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Bottom Security Guarantee */}
          <div className="policy-modal__footer-guarantee">
            <div className="policy-modal__guarantee-item">
              <ShieldCheck size={16} className="policy-modal__guarantee-icon" />
              <span>Chứng nhận TMĐT Bộ Công Thương & Nghị định 13/2023/NĐ-CP</span>
            </div>
            <div className="policy-modal__guarantee-item">
              <CheckCircle2 size={16} className="policy-modal__guarantee-icon" />
              <span>Bảo mật giao dịch thanh toán VietQR NAPAS 24/7</span>
            </div>
          </div>
        </main>
      </div>
    </Modal>
  );
};
