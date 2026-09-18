import React, { useState } from 'react';
import { Input, Select, Modal, Tag, message } from 'antd';
import {
  User,
  CreditCard,
  Phone,
  Mail,
  Calendar,
  UserPlus,
  Edit2,
  Trash2,
  Users,
  CheckCircle,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { ISavedPassenger } from '@/types/auth.types';

export const TabProfile: React.FC = () => {
  const {
    user,
    updateProfile,
    savedPassengers,
    addSavedPassenger,
    updateSavedPassenger,
    deleteSavedPassenger,
  } = useAuth();

  // User Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [identityCard, setIdentityCard] = useState(user?.identityCard || '');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(user?.gender || 'male');
  const [birthday, setBirthday] = useState(user?.birthday || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Handle Reset Profile to initial values
  const handleResetProfile = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');
    setIdentityCard(user?.identityCard || '');
    setGender(user?.gender || 'male');
    setBirthday(user?.birthday || '');
    message.info('Đã hoàn tác thông tin về trạng thái ban đầu');
  };

  // Saved Passenger Modal State
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState<ISavedPassenger | null>(null);

  // Passenger Form State
  const [pName, setPName] = useState('');
  const [pIdCard, setPIdCard] = useState('');
  const [pPhone, setPPhone] = useState('');
  const [pRelation, setPRelation] = useState<ISavedPassenger['relationship']>('Bạn bè');
  const [pGender, setPGender] = useState<'male' | 'female'>('male');
  const [pBirthday, setPBirthday] = useState('');

  // Handle Save Profile
  const handleSaveProfile = async () => {
    if (!name.trim()) {
      message.warning('Họ và tên không được để trống');
      return;
    }
    setIsSavingProfile(true);
    try {
      await updateProfile({
        name,
        email,
        phone,
        identityCard,
        gender,
        birthday,
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Open modal to add passenger
  const handleOpenAddPassenger = () => {
    setEditingPassenger(null);
    setPName('');
    setPIdCard('');
    setPPhone('');
    setPRelation('Bạn bè');
    setPGender('male');
    setPBirthday('');
    setIsPassengerModalOpen(true);
  };

  // Open modal to edit passenger
  const handleOpenEditPassenger = (psg: ISavedPassenger) => {
    setEditingPassenger(psg);
    setPName(psg.fullName);
    setPIdCard(psg.identityCard);
    setPPhone(psg.phone);
    setPRelation(psg.relationship);
    setPGender(psg.gender);
    setPBirthday(psg.birthday || '');
    setIsPassengerModalOpen(true);
  };

  // Handle Save Passenger
  const handleSavePassenger = () => {
    if (!pName.trim()) {
      message.warning('Vui lòng nhập họ và tên hành khách');
      return;
    }
    if (!pIdCard.trim() || pIdCard.trim().length < 9) {
      message.warning('Số CCCD/Hộ chiếu cần có ít nhất 9 - 12 ký tự');
      return;
    }

    if (editingPassenger) {
      updateSavedPassenger({
        ...editingPassenger,
        fullName: pName.trim(),
        identityCard: pIdCard.trim(),
        phone: pPhone.trim(),
        relationship: pRelation,
        gender: pGender,
        birthday: pBirthday,
      });
    } else {
      addSavedPassenger({
        fullName: pName.trim(),
        identityCard: pIdCard.trim(),
        phone: pPhone.trim(),
        relationship: pRelation,
        gender: pGender,
        birthday: pBirthday,
      });
    }

    setIsPassengerModalOpen(false);
  };

  return (
    <div className="tab-profile">
      {/* 1. Personal Information Section */}
      <div className="profile-card">
        <div className="profile-card__header">
          <div className="profile-card__icon-box">
            <User size={18} />
          </div>
          <div>
            <h4 className="profile-card__title">Hồ Sơ Cá Nhân & Định Danh</h4>
            <span className="profile-card__desc">
              Thông tin phục vụ xuất vé điện tử tự động và bảo hiểm hành khách
            </span>
          </div>
        </div>

        <div className="profile-card__form-grid">
          <div className="profile-card__field">
            <label className="profile-card__label">Họ và tên (theo CCCD/Hộ chiếu)</label>
            <Input
              prefix={<User size={15} className="profile-card__input-icon" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Hoàng Nam"
            />
          </div>

          <div className="profile-card__field">
            <label className="profile-card__label">Số CCCD / Hộ chiếu (12 số)</label>
            <Input
              prefix={<CreditCard size={15} className="profile-card__input-icon" />}
              value={identityCard}
              onChange={(e) => setIdentityCard(e.target.value)}
              placeholder="001095012345"
            />
          </div>

          <div className="profile-card__field">
            <label className="profile-card__label">Số điện thoại nhận vé</label>
            <Input
              prefix={<Phone size={15} className="profile-card__input-icon" />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0912345678"
            />
          </div>

          <div className="profile-card__field">
            <label className="profile-card__label">Email nhận biên lai & vé điện tử</label>
            <Input
              prefix={<Mail size={15} className="profile-card__input-icon" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>

          <div className="profile-card__field">
            <label className="profile-card__label">Giới tính</label>
            <Select
              value={gender}
              onChange={setGender}
              style={{ width: '100%' }}
              options={[
                { value: 'male', label: 'Nam' },
                { value: 'female', label: 'Nữ' },
                { value: 'other', label: 'Khác' },
              ]}
            />
          </div>

          <div className="profile-card__field">
            <label className="profile-card__label">Ngày sinh (DD/MM/YYYY)</label>
            <Input
              prefix={<Calendar size={15} className="profile-card__input-icon" />}
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              placeholder="15/10/1995"
            />
          </div>
        </div>

        <div className="profile-card__footer form-actions">
          <button
            type="button"
            className="form-actions__btn form-actions__btn--secondary"
            onClick={handleResetProfile}
            disabled={isSavingProfile}
            title="Khôi phục thông tin ban đầu"
          >
            <RotateCcw size={15} />
            <span>Đặt lại</span>
          </button>
          <button
            type="button"
            className="form-actions__btn form-actions__btn--primary"
            onClick={handleSaveProfile}
            disabled={isSavingProfile}
          >
            <CheckCircle size={15} />
            <span>{isSavingProfile ? 'Đang lưu...' : 'Lưu Thay Đổi Hồ Sơ'}</span>
          </button>
        </div>
      </div>

      {/* 2. Saved Passengers Directory Section */}
      <div className="profile-card profile-card--passengers">
        <div className="profile-card__header profile-card__header--between">
          <div className="profile-card__title-cluster">
            <div className="profile-card__icon-box profile-card__icon-box--green">
              <Users size={18} />
            </div>
            <div>
              <h4 className="profile-card__title">Danh Bạ Hành Khách Thân Quen</h4>
              <span className="profile-card__desc">
                Lưu sẵn thông tin người thân/bạn bè để chọn 1 chạm khi đặt vé (Auto-fill)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenAddPassenger}
            className="section-header__action-btn"
          >
            <UserPlus size={15} />
            <span>+ Thêm Người Thân</span>
          </button>
        </div>

        <div className="saved-passengers-list">
          {savedPassengers.length === 0 ? (
            <div className="saved-passengers-list__empty">
              <Users size={36} className="saved-passengers-list__empty-icon" />
              <p>Chưa có hành khách nào được lưu. Bấm "Thêm Người Thân" để lưu danh bạ.</p>
            </div>
          ) : (
            <div className="saved-passengers-grid">
              {savedPassengers.map((psg: ISavedPassenger) => (
                <div key={psg.id} className="passenger-card">
                  <div className="passenger-card__header">
                    <div className="passenger-card__name-badge">
                      <strong className="passenger-card__name">{psg.fullName}</strong>
                      <Tag color={psg.relationship === 'Bản thân' ? 'blue' : 'cyan'}>
                        {psg.relationship}
                      </Tag>
                    </div>

                    <div className="passenger-card__actions">
                      <button
                        type="button"
                        onClick={() => handleOpenEditPassenger(psg)}
                        className="passenger-card__action-btn"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSavedPassenger(psg.id)}
                        className="passenger-card__action-btn passenger-card__action-btn--delete"
                        title="Xóa khỏi danh bạ"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="passenger-card__body">
                    <div className="passenger-card__row">
                      <span>CCCD / Hộ chiếu:</span>
                      <strong>{psg.identityCard}</strong>
                    </div>
                    <div className="passenger-card__row">
                      <span>Số điện thoại:</span>
                      <span>{psg.phone || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="passenger-card__row">
                      <span>Giới tính / Ngày sinh:</span>
                      <span>
                        {psg.gender === 'male' ? 'Nam' : 'Nữ'}
                        {psg.birthday ? ` • ${psg.birthday}` : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add/Edit Passenger */}
      <Modal
        open={isPassengerModalOpen}
        onCancel={() => setIsPassengerModalOpen(false)}
        onOk={handleSavePassenger}
        okText={editingPassenger ? 'Cập nhật' : 'Thêm vào danh bạ'}
        cancelText="Hủy"
        title={
          <div className="passenger-modal-title">
            <UserPlus size={18} />
            <span>{editingPassenger ? 'Chỉnh Sửa Hành Khách' : 'Thêm Hành Khách Mới'}</span>
          </div>
        }
        centered
        width={500}
      >
        <div className="passenger-form">
          <div className="passenger-form__field">
            <label>Họ và tên (chính xác theo CCCD)</label>
            <Input
              value={pName}
              onChange={(e) => setPName(e.target.value)}
              placeholder="Ví dụ: Trần Thu Hà"
              size="middle"
            />
          </div>

          <div className="passenger-form__row">
            <div className="passenger-form__field">
              <label>Mối quan hệ</label>
              <Select
                value={pRelation}
                onChange={setPRelation}
                size="middle"
                style={{ width: '100%' }}
                options={[
                  { value: 'Bản thân', label: 'Bản thân' },
                  { value: 'Vợ / Chồng', label: 'Vợ / Chồng' },
                  { value: 'Con cái', label: 'Con cái' },
                  { value: 'Bố / Mẹ', label: 'Bố / Mẹ' },
                  { value: 'Bạn bè', label: 'Bạn bè' },
                  { value: 'Đồng nghiệp', label: 'Đồng nghiệp' },
                ]}
              />
            </div>

            <div className="passenger-form__field">
              <label>Giới tính</label>
              <Select
                value={pGender}
                onChange={setPGender}
                size="middle"
                style={{ width: '100%' }}
                options={[
                  { value: 'male', label: 'Nam' },
                  { value: 'female', label: 'Nữ' },
                ]}
              />
            </div>
          </div>

          <div className="passenger-form__row">
            <div className="passenger-form__field">
              <label>Số CCCD / Hộ chiếu (12 số)</label>
              <Input
                value={pIdCard}
                onChange={(e) => setPIdCard(e.target.value)}
                placeholder="001196023456"
                size="middle"
              />
            </div>

            <div className="passenger-form__field">
              <label>Số điện thoại</label>
              <Input
                value={pPhone}
                onChange={(e) => setPPhone(e.target.value)}
                placeholder="0987654321"
                size="middle"
              />
            </div>
          </div>

          <div className="passenger-form__field">
            <label>Ngày sinh (DD/MM/YYYY)</label>
            <Input
              value={pBirthday}
              onChange={(e) => setPBirthday(e.target.value)}
              placeholder="20/05/1996"
              size="middle"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
