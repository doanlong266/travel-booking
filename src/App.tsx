import React, { useState } from 'react';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { Map, Sparkles, Navigation } from 'lucide-react';
import { antdThemeConfig } from '@/theme/themeConfig';
import { useTicketSearch } from '@/hooks/useTicketSearch';
import { useRoutePreview } from '@/hooks/useRoutePreview';
import { useBookingFlow } from '@/hooks/useBookingFlow';
import type { ITicketItem } from '@/types/ticket';

// Components
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { SearchWidget } from '@/components/search/SearchWidget';
import { RouteMap } from '@/components/map/RouteMap';
import { TicketList } from '@/components/tickets/TicketList';
import { TicketFilterSidebar } from '@/components/tickets/TicketFilterSidebar';
import { TicketDetailDrawer } from '@/components/tickets/TicketDetailDrawer';
import { SeatSelectionModal } from '@/components/booking/SeatSelectionModal';
import { BookingCheckoutModal } from '@/components/booking/BookingCheckoutModal';
import { PolicyModal } from '@/components/policy/PolicyModal';
import type { PolicyId } from '@/types/policy';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/features/auth/components/AuthModal/AuthModal';
import { UserDashboard } from '@/features/user/components/UserDashboard/UserDashboard';
import { GuestLookupModal } from '@/features/booking/components/GuestLookup/GuestLookupModal';
import { GuestBookingWidget } from '@/features/booking/components/GuestLookup/GuestBookingWidget';
import { SupportFloatingWidget } from '@/features/support/components/SupportFloatingWidget/SupportFloatingWidget';
import { FastRefundModal } from '@/features/support/components/FastRefundModal/FastRefundModal';
import { RefundPolicyDrawer } from '@/features/support/components/RefundPolicyDrawer/RefundPolicyDrawer';
import { SupportChatWidget } from '@/features/chat/components/SupportChatWidget/SupportChatWidget';
import type { IGuestBookingOrder, IDraftBooking } from '@/types/guestLookup.types';

const TravelBookingApp: React.FC = () => {
  // 1. Search state orchestration
  const {
    transportType,
    setTransportType,
    origin,
    setOrigin,
    destination,
    setDestination,
    departureDate,
    setDepartureDate,
    returnDate,
    setReturnDate,
    isRoundTrip,
    setIsRoundTrip,
    passengerCount,
    setPassengerCount,
    seatClassFilter,
    setSeatClassFilter,
    priceRange,
    setPriceRange,
    selectedCarriers,
    setSelectedCarriers,
    selectedTimeSlots,
    setSelectedTimeSlots,
    sortBy,
    setSortBy,
    swapLocations,
    resetFilters,
    filteredTickets,
    allAvailableCarriers,
    priceBounds,
  } = useTicketSearch();

  // 2. Route calculation & trajectory (Dependency Inversion)
  const { routeInfo, formattedDuration } = useRoutePreview({
    origin,
    destination,
    transportType,
  });

  // 3. Booking flow, VietQR countdown timer & guest checkout
  const {
    selectedTicket,
    isSeatModalOpen,
    openSeatModal,
    closeSeatModal,
    isCheckoutModalOpen,
    closeCheckoutModal,
    checkoutStep,
    selectedSeats,
    contactInfo,
    passengers,
    setPassengerCount: syncBookingPassengers,
    countdownSeconds,
    isTimerExpired,
    regenerateQR,
    confirmedBooking,
    proceedToCheckoutWithSeats,
    submitGuestInfoAndCreateQR,
    simulatePaymentSuccess,
    resumeFromDraft,
    rebookTicket,
    resetBooking,
  } = useBookingFlow(passengerCount);

  // Sync passenger count from search to booking flow
  const handlePassengerCountChange = (count: number) => {
    setPassengerCount(count);
    syncBookingPassengers(count);
  };

  // 4. Guest Booking Lookup & Recovery state
  const [isGuestLookupOpen, setIsGuestLookupOpen] = useState(false);
  const [guestLookupBookingId, setGuestLookupBookingId] = useState<string | undefined>(undefined);

  const handleOpenGuestLookup = (bookingId?: string) => {
    setGuestLookupBookingId(bookingId);
    setIsGuestLookupOpen(true);
  };

  const handleCloseGuestLookup = () => {
    setIsGuestLookupOpen(false);
    setGuestLookupBookingId(undefined);
  };

  const handleResumeDraftFromWidget = (draft: IDraftBooking) => {
    resumeFromDraft(draft);
  };

  const handleRebookFromTicket = (order: IGuestBookingOrder) => {
    setIsGuestLookupOpen(false);
    rebookTicket(order);
  };

  const handleResumePaymentFromTicket = (order: IGuestBookingOrder) => {
    if (order.rawPayload) {
      resumeFromDraft({
        bookingId: order.bookingId,
        payload: order.rawPayload,
        paymentExpiresAt: order.paymentExpiresAt ? new Date(order.paymentExpiresAt).getTime() : Date.now() + 10 * 60 * 1000,
        createdAt: Date.now()
      });
      setIsGuestLookupOpen(false);
    }
  };

  // 5. Fast Refund & 24/7 Support Hub state
  const [isFastRefundOpen, setIsFastRefundOpen] = useState(false);
  const [isRefundPolicyOpen, setIsRefundPolicyOpen] = useState(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [fastRefundPrefilledOrder, setFastRefundPrefilledOrder] = useState<IGuestBookingOrder | null>(null);

  const handleOpenFastRefund = (order?: IGuestBookingOrder) => {
    setFastRefundPrefilledOrder(order || null);
    setIsFastRefundOpen(true);
  };

  const handleCloseFastRefund = () => {
    setIsFastRefundOpen(false);
    setFastRefundPrefilledOrder(null);
  };

  const handleOpenLiveChat = () => {
    setIsLiveChatOpen(true);
  };

  // 6. Ticket Detail Drawer state
  const [detailDrawerTicket, setDetailDrawerTicket] = useState<ITicketItem | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  const handleOpenDetails = (ticket: ITicketItem) => {
    setDetailDrawerTicket(ticket);
    setIsDetailDrawerOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailDrawerOpen(false);
  };

  // 6. Policy Modal state
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [activePolicyId, setActivePolicyId] = useState<PolicyId>('terms');

  const handleOpenPolicy = (id: PolicyId) => {
    setActivePolicyId(id);
    setIsPolicyModalOpen(true);
  };

  const handleClosePolicy = () => {
    setIsPolicyModalOpen(false);
  };

  const handleSelectTicket = (ticket: ITicketItem) => {
    openSeatModal(ticket);
  };

  const handleSearchScroll = () => {
    const el = document.getElementById('results-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 7. Global Auth state
  const { isAuthModalOpen, authModalMode, openAuthModal, closeAuthModal } = useAuth();

  const handleRegisterMemberFromGuest = (_phone: string) => {
    setIsGuestLookupOpen(false);
    openAuthModal('register');
  };

  return (
    <div className="travel-app">
        {/* Header */}
        <AppHeader
          activeTransportType={transportType}
          onSelectTransportType={setTransportType}
          onOpenGuestLookup={() => handleOpenGuestLookup()}
        />

        {/* Hero Banner */}
        <section className="travel-app__hero">
          <div className="travel-app__hero-container">
            <div className="travel-app__hero-badge">
              <Sparkles size={14} />
              <span>Nền Tảng Đặt Vé Đa Phương Tiện Tiên Phong</span>
            </div>
            <h1 className="travel-app__hero-title">
              Khám phá Việt Nam cùng <span>Vé Máy Bay, Tàu Hỏa & Xe Khách</span>
            </h1>
            <p className="travel-app__hero-subtitle">
              So sánh tức thì lộ trình, khoảng cách và giá vé từ hơn 50+ đơn vị vận chuyển hàng đầu
              Việt Nam với sơ đồ chọn ghế trực quan, đặt vé không cần đăng nhập và thanh toán VietQR tự động.
            </p>
          </div>
        </section>

        {/* Floating Search Widget */}
        <div className="travel-app__search-container">
          <SearchWidget
            transportType={transportType}
            onTransportTypeChange={setTransportType}
            origin={origin}
            onOriginChange={setOrigin}
            destination={destination}
            onDestinationChange={setDestination}
            departureDate={departureDate}
            onDepartureDateChange={setDepartureDate}
            returnDate={returnDate}
            onReturnDateChange={setReturnDate}
            isRoundTrip={isRoundTrip}
            onIsRoundTripChange={setIsRoundTrip}
            passengerCount={passengerCount}
            onPassengerCountChange={handlePassengerCountChange}
            seatClass={seatClassFilter}
            onSeatClassChange={setSeatClassFilter}
            onSwap={swapLocations}
            onSearch={handleSearchScroll}
          />
        </div>

        {/* Main Content Layout */}
        <main className="travel-app__main">
          {/* Section 1: Route Map Preview */}
          <section className="travel-app__map-section">
            <div className="travel-app__section-header">
              <h2 className="travel-app__section-title">
                <Map size={20} className="travel-app__section-icon" />
                Bản đồ lộ trình tương tác
              </h2>
              <span className="travel-app__section-subtitle">
                Tọa độ vector & đường nối vệ tinh thời gian thực
              </span>
            </div>

            <RouteMap
              origin={origin}
              destination={destination}
              transportType={transportType}
              routeInfo={routeInfo}
              formattedDuration={formattedDuration}
            />
          </section>

          {/* Section 2: Tickets Filter & Results Grid */}
          <section id="results-section" className="travel-app__results-section">
            <div className="travel-app__section-header">
              <h2 className="travel-app__section-title">
                <Navigation size={20} className="travel-app__section-icon" />
                Danh sách chuyến khả dụng
              </h2>
              <span className="travel-app__section-subtitle">
                Giá vé hiển thị đã bao gồm thuế & phí phục vụ
              </span>
            </div>

            <div className="travel-app__results-grid">
              {/* Filter Sidebar */}
              <TicketFilterSidebar
                transportType={transportType}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                priceBounds={priceBounds}
                availableCarriers={allAvailableCarriers}
                selectedCarriers={selectedCarriers}
                onSelectedCarriersChange={setSelectedCarriers}
                selectedTimeSlots={selectedTimeSlots}
                onSelectedTimeSlotsChange={setSelectedTimeSlots}
                onReset={resetFilters}
              />

              {/* Tickets List */}
              <TicketList
                tickets={filteredTickets}
                selectedTicketId={selectedTicket?.id}
                onSelectTicket={handleSelectTicket}
                onViewDetails={handleOpenDetails}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                onResetFilters={resetFilters}
              />
            </div>
          </section>
        </main>

        {/* Modals & Drawers */}
        <TicketDetailDrawer
          ticket={detailDrawerTicket}
          isOpen={isDetailDrawerOpen}
          onClose={handleCloseDetails}
          onSelect={handleSelectTicket}
        />

        <SeatSelectionModal
          ticket={selectedTicket}
          isOpen={isSeatModalOpen}
          onClose={closeSeatModal}
          selectedSeats={selectedSeats}
          onConfirmSeats={proceedToCheckoutWithSeats}
          maxPassengers={passengerCount}
        />

        <BookingCheckoutModal
          ticket={selectedTicket}
          selectedSeats={selectedSeats}
          passengers={passengers}
          contactInfo={contactInfo}
          checkoutStep={checkoutStep}
          isOpen={isCheckoutModalOpen}
          onClose={closeCheckoutModal}
          countdownSeconds={countdownSeconds}
          isTimerExpired={isTimerExpired}
          regenerateQR={regenerateQR}
          confirmedBooking={confirmedBooking}
          onSubmitGuestInfo={submitGuestInfoAndCreateQR}
          onSimulateSuccess={simulatePaymentSuccess}
          onReset={resetBooking}
          distanceKm={routeInfo?.distanceKm || 0}
        />

        {/* Policy Modal */}
        <PolicyModal
          isOpen={isPolicyModalOpen}
          onClose={handleClosePolicy}
          initialPolicyId={activePolicyId}
        />

        {/* Auth Modal / Drawer */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
          defaultTab={authModalMode}
          onOpenTerms={() => handleOpenPolicy('terms')}
        />

        {/* User Dashboard */}
        <UserDashboard />

        {/* Guest Booking Lookup & Recovery Modal */}
        <GuestLookupModal
          isOpen={isGuestLookupOpen}
          onClose={handleCloseGuestLookup}
          initialBookingId={guestLookupBookingId}
          onRebook={handleRebookFromTicket}
          onResumePayment={handleResumePaymentFromTicket}
          onRegisterMember={handleRegisterMemberFromGuest}
          onOpenFastRefund={(order) => {
            setIsGuestLookupOpen(false);
            handleOpenFastRefund(order);
          }}
        />

        {/* Floating Guest Recovery Widget */}
        <GuestBookingWidget
          onOpenLookup={handleOpenGuestLookup}
          onResumeDraft={handleResumeDraftFromWidget}
        />

        {/* Fast Refund Modal */}
        <FastRefundModal
          isOpen={isFastRefundOpen}
          onClose={handleCloseFastRefund}
          prefilledOrder={fastRefundPrefilledOrder}
          onOpenPolicyDrawer={() => setIsRefundPolicyOpen(true)}
        />

        {/* Refund Policy Drawer */}
        <RefundPolicyDrawer
          isOpen={isRefundPolicyOpen}
          onClose={() => setIsRefundPolicyOpen(false)}
          onOpenFastRefund={() => handleOpenFastRefund()}
        />

        {/* 24/7 Floating Speed-Dial Support Hub */}
        {!isLiveChatOpen && (
          <SupportFloatingWidget
            onOpenFastRefund={() => handleOpenFastRefund()}
            onOpenExchange={() => handleOpenFastRefund()}
            onOpenPolicyDrawer={() => setIsRefundPolicyOpen(true)}
            onOpenLiveChat={handleOpenLiveChat}
          />
        )}

        {/* Live Support Chat Docked Window */}
        <SupportChatWidget
          isOpen={isLiveChatOpen}
          onClose={() => setIsLiveChatOpen(false)}
          onOpenFastRefund={() => handleOpenFastRefund()}
          onOpenExchange={() => handleOpenFastRefund()}
          onOpenLookup={handleOpenGuestLookup}
          onOpenPolicyDrawer={() => setIsRefundPolicyOpen(true)}
        />

        {/* Footer */}
        <AppFooter onOpenPolicy={handleOpenPolicy} />
      </div>
  );
};

export const App: React.FC = () => {
  return (
    <ConfigProvider theme={antdThemeConfig} locale={viVN}>
      <AuthProvider>
        <TravelBookingApp />
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
