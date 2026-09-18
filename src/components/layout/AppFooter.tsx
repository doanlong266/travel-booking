import React from 'react';
import {
  ShieldCheck,
  Headphones,
  Award,
  CreditCard,
  FileText,
  Lock,
  BookOpen,
  RefreshCw,
  AlertCircle,
  Luggage,
  ShieldAlert,
  PhoneCall,
  Mail,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import type { PolicyId } from '@/types/policy';

interface AppFooterProps {
  onOpenPolicy?: (policyId: PolicyId) => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({ onOpenPolicy }) => {
  const handlePolicyClick = (policyId: PolicyId) => {
    if (onOpenPolicy) {
      onOpenPolicy(policyId);
    }
  };

  return (
    <footer className="app-footer">
      {/* 1. Value Propositions Banner */}
      <div className="app-footer__features">
        <div className="app-footer__container">
          <div className="app-footer__features-grid">
            <div className="app-footer__feature-item">
              <div className="app-footer__feature-icon-box">
                <ShieldCheck size={20} className="app-footer__feature-icon" />
              </div>
              <div className="app-footer__feature-info">
                <strong className="app-footer__feature-title">An tâm tuyệt đối</strong>
                <span className="app-footer__feature-desc">100% vé thật, xác thực trực tiếp nhà xe/hãng</span>
              </div>
            </div>

            <div className="app-footer__feature-item">
              <div className="app-footer__feature-icon-box">
                <CreditCard size={20} className="app-footer__feature-icon" />
              </div>
              <div className="app-footer__feature-info">
                <strong className="app-footer__feature-title">Thanh toán VietQR</strong>
                <span className="app-footer__feature-desc">Quét mã tức thì, xác nhận tự động 24/7</span>
              </div>
            </div>

            <div className="app-footer__feature-item">
              <div className="app-footer__feature-icon-box">
                <Headphones size={20} className="app-footer__feature-icon" />
              </div>
              <div className="app-footer__feature-info">
                <strong className="app-footer__feature-title">Hỗ trợ 24/7 tận tâm</strong>
                <span className="app-footer__feature-desc">Giải đáp & xử lý hoàn đổi vé siêu tốc</span>
              </div>
            </div>

            <div className="app-footer__feature-item">
              <div className="app-footer__feature-icon-box">
                <Award size={20} className="app-footer__feature-icon" />
              </div>
              <div className="app-footer__feature-info">
                <strong className="app-footer__feature-title">Đối tác chính thức</strong>
                <span className="app-footer__feature-desc">Hàng không, Đường sắt & Xe khách Việt Nam</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation & Policy Columns */}
      <div className="app-footer__main">
        <div className="app-footer__container">
          <div className="app-footer__columns-grid">
            {/* Column 1: Company Profile */}
            <div className="app-footer__col">
              <h4 className="app-footer__col-title">Về OMNITRAVEL</h4>
              <p className="app-footer__col-desc">
                Hệ sinh thái đặt vé trực tuyến đa phương tiện tiên phong tại Việt Nam, tích hợp
                vé máy bay, vé tàu hỏa và vé xe khách liên tỉnh với sơ đồ chọn chỗ ngồi trực quan.
              </p>
              <div className="app-footer__contact-list">
                <div className="app-footer__contact-row">
                  <PhoneCall size={14} className="app-footer__contact-icon" />
                  <span>Tổng đài CSKH: <strong>1900 6868</strong> (24/7)</span>
                </div>
                <div className="app-footer__contact-row">
                  <Mail size={14} className="app-footer__contact-icon" />
                  <span>Hỗ trợ & Khiếu nại: hotro@omnitravel.vn</span>
                </div>
                <div className="app-footer__contact-row">
                  <MapPin size={14} className="app-footer__contact-icon" />
                  <span>Trụ sở chính: Q. Hoàn Kiếm, Hà Nội & Q. 1, TP. HCM</span>
                </div>
              </div>
            </div>

            {/* Column 2: Core Policies */}
            <div className="app-footer__col">
              <h4 className="app-footer__col-title">Chính Sách & Quy Định</h4>
              <ul className="app-footer__link-list">
                <li>
                  <button
                    type="button"
                    className="app-footer__link-btn"
                    onClick={() => handlePolicyClick('terms')}
                  >
                    <FileText size={14} />
                    <span>Điều khoản sử dụng</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="app-footer__link-btn"
                    onClick={() => handlePolicyClick('privacy')}
                  >
                    <Lock size={14} />
                    <span>Chính sách bảo mật (NĐ 13)</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="app-footer__link-btn"
                    onClick={() => handlePolicyClick('regulations')}
                  >
                    <BookOpen size={14} />
                    <span>Quy chế hoạt động sàn TMĐT</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="app-footer__link-btn"
                    onClick={() => handlePolicyClick('refund')}
                  >
                    <RefreshCw size={14} />
                    <span>Chính sách hoàn & đổi vé</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Customer Rights & Operations */}
            <div className="app-footer__col">
              <h4 className="app-footer__col-title">Quyền Lợi & Nghiệp Vụ</h4>
              <ul className="app-footer__link-list">
                <li>
                  <button
                    type="button"
                    className="app-footer__link-btn"
                    onClick={() => handlePolicyClick('dispute')}
                  >
                    <AlertCircle size={14} />
                    <span>Giải quyết khiếu nại & tranh chấp</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="app-footer__link-btn"
                    onClick={() => handlePolicyClick('baggage')}
                  >
                    <Luggage size={14} />
                    <span>Quy định hành lý & vận chuyển</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="app-footer__link-btn"
                    onClick={() => handlePolicyClick('insurance')}
                  >
                    <ShieldAlert size={14} />
                    <span>Bảo hiểm & an toàn chuyến đi</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Security Badges & Certifications */}
            <div className="app-footer__col">
              <h4 className="app-footer__col-title">Chứng Nhận & Bảo Mật</h4>
              <div className="app-footer__badges">
                <div className="app-footer__badge-item">
                  <CheckCircle size={15} className="app-footer__badge-icon" />
                  <span>Đã thông báo Bộ Công Thương (Sàn TMĐT)</span>
                </div>
                <div className="app-footer__badge-item">
                  <CheckCircle size={15} className="app-footer__badge-icon" />
                  <span>Tuân thủ Nghị định 13/2023/NĐ-CP Bảo vệ dữ liệu</span>
                </div>
                <div className="app-footer__badge-item">
                  <CheckCircle size={15} className="app-footer__badge-icon" />
                  <span>Mã hóa SSL/TLS 256-bit chuẩn ngân hàng</span>
                </div>
                <div className="app-footer__badge-item">
                  <CheckCircle size={15} className="app-footer__badge-icon" />
                  <span>Thanh toán bảo mật chuẩn VietQR NAPAS 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright Bar */}
      <div className="app-footer__bottom">
        <div className="app-footer__container">
          <div className="app-footer__bottom-content">
            <p className="app-footer__copyright">
              &copy; {new Date().getFullYear()} OMNITRAVEL Platform.
            </p>
            <div className="app-footer__bottom-links">
              <button
                type="button"
                className="app-footer__bottom-link"
                onClick={() => handlePolicyClick('terms')}
              >
                Điều khoản sử dụng
              </button>
              <button
                type="button"
                className="app-footer__bottom-link"
                onClick={() => handlePolicyClick('privacy')}
              >
                Chính sách bảo mật
              </button>
              <button
                type="button"
                className="app-footer__bottom-link"
                onClick={() => handlePolicyClick('regulations')}
              >
                Quy chế hoạt động
              </button>
              <button
                type="button"
                className="app-footer__bottom-link"
                onClick={() => handlePolicyClick('refund')}
              >
                Hoàn tiền & Đổi vé
              </button>
              <button
                type="button"
                className="app-footer__bottom-link"
                onClick={() => handlePolicyClick('dispute')}
              >
                Giải quyết khiếu nại
              </button>
              <button
                type="button"
                className="app-footer__bottom-link"
                onClick={() => handlePolicyClick('baggage')}
              >
                Quy định hành lý
              </button>
              <button
                type="button"
                className="app-footer__bottom-link"
                onClick={() => handlePolicyClick('insurance')}
              >
                Bảo hiểm an toàn
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
