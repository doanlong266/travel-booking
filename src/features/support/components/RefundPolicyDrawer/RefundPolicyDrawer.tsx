import React, { useState, useMemo } from 'react';
import { Drawer, Tag } from 'antd';
import {
  FileText,
  Plane,
  Train,
  Bus,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { CARRIER_POLICY_RULES } from '../../../../services/refundCalculation.service';
import type { TransportType } from '../../../../types/location';
import { CarrierLogo } from '../../../../components/common/CarrierLogo';
import { SmoothTabs, SmoothTabContent, useTabDirection } from '../../../../components/common/SmoothTabs';
import type { ISmoothTabItem } from '../../../../components/common/SmoothTabs';

interface RefundPolicyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFastRefund?: () => void;
}

const POLICY_TAB_KEYS = ['flight', 'train', 'bus'];

export const RefundPolicyDrawer: React.FC<RefundPolicyDrawerProps> = ({
  isOpen,
  onClose,
  onOpenFastRefund
}) => {
  const [activeTab, setActiveTab] = useState<TransportType>('flight');

  const { direction } = useTabDirection(activeTab, POLICY_TAB_KEYS);

  const policyTabItems: ISmoothTabItem[] = useMemo(() => [
    {
      key: 'flight',
      label: 'Vé Máy Bay',
      icon: <Plane size={15} />
    },
    {
      key: 'train',
      label: 'Vé Tàu Hỏa',
      icon: <Train size={15} />
    },
    {
      key: 'bus',
      label: 'Vé Xe Khách',
      icon: <Bus size={15} />
    }
  ], []);

  const filteredRules = CARRIER_POLICY_RULES.filter(r => r.transportType === activeTab);

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      width={640}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 'bold' }}>
          <FileText size={20} color="var(--color-primary, #0ea5e9)" />
          <span>Bảng Tra Cứu Quy Định Hoàn & Đổi Vé Minh Bạch</span>
        </div>
      }
      extra={
        onOpenFastRefund && (
          <button
            type="button"
            className="guest-lookup__submit-btn"
            style={{ width: 'auto', padding: '6px 14px', fontSize: '12px' }}
            onClick={() => {
              onClose();
              onOpenFastRefund();
            }}
          >
            <Zap size={14} /> Hoàn vé ngay
          </button>
        )
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Top Highlight Banner */}
        <div style={{ padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', color: '#166534', fontSize: '13px' }}>
          <ShieldCheck size={22} style={{ flexShrink: 0 }} />
          <div>
            <strong>Cam kết minh bạch 100%:</strong> Mọi mức phí hoàn vé đều tuân thủ chính xác theo quy chuẩn ban hành của Cục Hàng không, Tổng công ty Đường sắt & Nhà xe đối tác.
          </div>
        </div>

        {/* Smooth Spring-Motion Tabs */}
        <SmoothTabs
          variant="pill"
          items={policyTabItems}
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k as TransportType)}
          renderContent={false}
          layoutId="refund-policy-smooth-tabs"
        />

        {/* Fluid Direction-Aware Policy List Content */}
        <SmoothTabContent activeKey={activeTab} direction={direction} enableSmoothHeight>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredRules.map(rule => (
              <div
                key={rule.id}
                style={{
                  padding: '16px',
                  background: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {/* Carrier Title Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CarrierLogo
                      carrier={rule.carrierCode}
                      name={rule.carrierName}
                      code={rule.carrierCode}
                      size="sm"
                    />
                    <div>
                      <strong style={{ fontSize: '14px' }}>{rule.carrierName}</strong>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>{rule.ticketClassName}</div>
                    </div>
                  </div>
                  <Tag color="blue">{rule.carrierCode}</Tag>
                </div>

                {/* Timeframe Rules Table */}
                <table className="e-ticket__passenger-table" style={{ fontSize: '12.5px' }}>
                  <thead>
                    <tr>
                      <th>Mốc thời gian trước khởi hành</th>
                      <th>Phí hoàn vé</th>
                      <th>Đổi chuyến</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rule.timeframeRules.map((tr, idx) => (
                      <tr key={idx}>
                        <td>
                          <strong>
                            {tr.maxHoursBeforeDeparture 
                              ? `Từ ${tr.minHoursBeforeDeparture}h đến ${tr.maxHoursBeforeDeparture}h`
                              : `Trước trên ${tr.minHoursBeforeDeparture} giờ`}
                          </strong>
                        </td>
                        <td>
                          {tr.feePercentage >= 100 ? (
                            <span style={{ color: '#dc2626', fontWeight: 600 }}>Không hoàn</span>
                          ) : (
                            <span style={{ color: '#059669', fontWeight: 600 }}>
                              Khấu trừ {tr.feePercentage}% {tr.fixedFee ? `+ ${tr.fixedFee.toLocaleString()}đ` : ''}
                            </span>
                          )}
                        </td>
                        <td>
                          {tr.allowExchange ? (
                            <Tag color="cyan">Phí: {tr.exchangeFee > 0 ? `${tr.exchangeFee.toLocaleString()}đ` : 'Miễn phí'}</Tag>
                          ) : (
                            <Tag color="default">Không hỗ trợ</Tag>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Special conditions */}
                {rule.specialConditions && rule.specialConditions.length > 0 && (
                  <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11.5px', color: '#475569' }}>
                    <strong style={{ display: 'block', marginBottom: '4px', color: '#1e293b' }}>Lưu ý quy chuẩn:</strong>
                    <ul style={{ margin: 0, paddingLeft: '16px' }}>
                      {rule.specialConditions.map((cond, cIdx) => (
                        <li key={cIdx} style={{ marginBottom: '2px' }}>{cond}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </SmoothTabContent>

        {/* Bottom Fast Refund CTA */}
        {onOpenFastRefund && (
          <div style={{ padding: '16px', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', borderRadius: '14px', border: '1.5px solid #bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div>
              <strong style={{ fontSize: '13.5px', color: '#0369a1', display: 'block' }}>Cần hỗ trợ hoàn vé tự động ngay?</strong>
              <span style={{ fontSize: '12px', color: '#0284c7' }}>Hệ thống tự động tính toán số tiền và hoàn về trong 15 - 30 phút.</span>
            </div>
            <button
              type="button"
              className="guest-lookup__submit-btn"
              style={{ width: 'auto', padding: '8px 18px', whiteSpace: 'nowrap' }}
              onClick={() => {
                onClose();
                onOpenFastRefund();
              }}
            >
              Mở cổng hoàn vé
            </button>
          </div>
        )}
      </div>
    </Drawer>
  );
};
