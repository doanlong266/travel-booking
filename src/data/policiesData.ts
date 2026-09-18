import type { IPolicyItem } from '@/types/policy';

export const POLICIES_DATA: IPolicyItem[] = [
  {
    id: 'terms',
    title: 'Điều Khoản Sử Dụng Nền Tảng OMNITRAVEL',
    shortTitle: 'Điều khoản sử dụng',
    category: 'core',
    badge: 'Pháp lý cốt lõi',
    iconName: 'FileText',
    lastUpdated: '15/01/2026',
    summary:
      'Quy định quyền lợi, nghĩa vụ và trách nhiệm pháp lý ràng buộc giữa người dùng và Nền tảng OMNITRAVEL khi sử dụng dịch vụ tìm kiếm, so sánh và đặt vé đa phương tiện trực tuyến.',
    sections: [
      {
        title: '1. Định nghĩa và Phạm vi Áp dụng',
        content: [
          'Nền tảng OMNITRAVEL (sau đây gọi tắt là "OMNITRAVEL") là hệ sinh thái công nghệ kết nối trực tiếp khách hàng với các đơn vị vận tải hàng không, đường sắt và vận tải đường bộ liên tỉnh tại Việt Nam.',
          'Bằng việc truy cập, tra cứu thông tin hoặc thực hiện giao dịch đặt vé trên website/ứng dụng OMNITRAVEL, Quý khách xác nhận đã đọc, hiểu rõ và đồng ý tuân thủ toàn bộ các điều khoản và điều kiện được nêu tại văn bản này.',
          'OMNITRAVEL có quyền sửa đổi, bổ sung nội dung điều khoản bất kỳ lúc nào nhằm tuân thủ các thay đổi pháp luật hoặc tối ưu dịch vụ. Phiên bản cập nhật sẽ có hiệu lực ngay khi được đăng tải chính thức.',
        ],
      },
      {
        title: '2. Quyền và Trách nhiệm của Người Dùng',
        content: [
          'Cung cấp đầy đủ, chuẩn xác thông tin cá nhân (Họ tên tiếng Việt không dấu hoặc có dấu theo giấy tờ tùy thân, Số CCCD/Hộ chiếu, Số điện thoại di động và Email nhận vé).',
          'Khách hàng hoàn toàn chịu trách nhiệm trước pháp luật nếu cung cấp thông tin sai lệch dẫn đến việc bị từ chối vận chuyển tại sân bay, nhà ga hoặc bến xe theo quy định của nhà vận tải.',
          'Tuyệt đối không sử dụng công cụ tự động (bot, crawler, spider) để quét dữ liệu vé, can thiệp trái phép vào hệ thống máy chủ hoặc thực hiện các hành vi gian lận thanh toán.',
        ],
        note: 'Lưu ý: Tên trên vé máy bay và vé tàu hỏa phải trùng khớp 100% với CCCD/Hộ chiếu xuất trình khi làm thủ tục check-in.',
      },
      {
        title: '3. Giá Vé, Thuế và Phí Dịch Vụ',
        content: [
          'Mọi mức giá vé hiển thị trên OMNITRAVEL đều được công khai minh bạch, thể hiện bằng Đồng Việt Nam (VND).',
          'Giá vé máy bay đã bao gồm thuế GTGT (VAT), phí an ninh soi chiếu, phí sân bay theo quy định của Cục Hàng không Việt Nam.',
          'Giá vé tàu hỏa và xe khách đã bao gồm bảo hiểm hành khách bắt buộc theo quy định của Bộ Giao thông Vận tải.',
          'OMNITRAVEL cam kết không thu phụ phí ẩn ngoài các khoản đã được liệt kê chi tiết tại bước xác nhận thanh toán trước khi Quý khách quét mã VietQR.',
        ],
      },
      {
        title: '4. Giới Hạn Trách Nhiệm Pháp Lý',
        content: [
          'OMNITRAVEL đóng vai trò là sàn giao dịch thương mại điện tử kết nối và cung cấp dịch vụ đại lý ủy quyền chính thức. Nhà vận tải (hãng hàng không, Tổng công ty ĐSVN, nhà xe) là bên trực tiếp chịu trách nhiệm thực hiện hành trình vận chuyển.',
          'OMNITRAVEL được miễn trừ trách nhiệm bồi thường trong các trường hợp bất khả kháng theo quy định pháp luật (thiên tai, bão lũ, sự cố không lưu, dịch bệnh, hoặc lệnh cấm/hạn chế di chuyển từ cơ quan nhà nước có thẩm quyền).',
          'Trong mọi trường hợp phát sinh sự cố hủy/hoãn chuyến, OMNITRAVEL cam kết phối hợp tối đa cùng nhà vận tải để hỗ trợ hành khách đổi hành trình hoặc hoàn tiền nhanh chóng nhất.',
        ],
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Chính Sách Bảo Mật & Bảo Vệ Dữ Liệu Cá Nhân',
    shortTitle: 'Chính sách bảo mật',
    category: 'core',
    badge: 'Nghị định 13/2023/NĐ-CP',
    iconName: 'ShieldCheck',
    lastUpdated: '10/01/2026',
    summary:
      'Cam kết bảo vệ tuyệt đối dữ liệu cá nhân của người dùng theo tiêu chuẩn an ninh thông tin quốc gia và Nghị định số 13/2023/NĐ-CP của Chính phủ về Bảo vệ Dữ liệu Cá nhân.',
    sections: [
      {
        title: '1. Mục Đích và Phạm Vi Thu Thập Dữ Liệu',
        content: [
          'OMNITRAVEL chỉ thu thập các dữ liệu cá nhân tối thiểu cần thiết để phục vụ quy trình xuất vé điện tử, bao gồm: Họ và tên, Ngày tháng năm sinh (đối với trẻ em/em bé), Số điện thoại, Địa chỉ Email, Số CCCD/Hộ chiếu.',
          'Dữ liệu thu thập được sử dụng riêng cho các mục đích: Xuất phôi vé điện tử chính thức từ nhà vận chuyển; Gửi mã vé và thông báo cập nhật chuyến đi qua SMS/Email; Phục vụ tra cứu và hỗ trợ khách hàng 24/7.',
          'Chúng tôi cam kết KHÔNG bán, chia sẻ hoặc thương mại hóa dữ liệu cá nhân của Quý khách cho bất kỳ bên thứ ba nào vì mục đích quảng cáo khi chưa có sự đồng thuận rõ ràng.',
        ],
      },
      {
        title: '2. Bảo Mật Giao Dịch & Thanh Toán VietQR',
        content: [
          'OMNITRAVEL áp dụng mô hình thanh toán an toàn qua VietQR (NAPAS 247). Khách hàng chuyển khoản trực tiếp từ ứng dụng ngân hàng của mình, OMNITRAVEL hoàn toàn KHÔNG lưu trữ mật khẩu, mã PIN, mã CVV hoặc thông tin thẻ tín dụng/ghi nợ của khách hàng.',
          'Toàn bộ kết nối giữa trình duyệt của người dùng và máy chủ OMNITRAVEL được mã hóa bởi giao thức SSL/TLS 256-bit chuẩn ngân hàng.',
          'Hệ thống máy chủ lưu trữ dữ liệu tuân thủ tiêu chuẩn an toàn an ninh mạng cấp độ 3 và đặt tại các trung tâm dữ liệu đạt chuẩn Tier III tại Việt Nam.',
        ],
        note: 'Mã QR thanh toán được sinh ngẫu nhiên kèm mã giao dịch duy nhất và tự động hủy bỏ hiệu lực sau 10:00 phút đếm ngược.',
      },
      {
        title: '3. Quyền của Chủ Thể Dữ Liệu',
        content: [
          'Theo Nghị định 13/2023/NĐ-CP, Quý khách có quyền:',
          '1) Quyền được biết và đồng ý về các loại dữ liệu được thu thập;',
          '2) Quyền yêu cầu tra cứu, trích xuất lịch sử giao dịch và vé điện tử đã mua;',
          '3) Quyền yêu cầu chỉnh sửa thông tin chưa chính xác trước giờ khởi hành;',
          '4) Quyền yêu cầu xóa hoặc hủy bỏ lưu trữ dữ liệu cá nhân khi không còn nhu cầu sử dụng dịch vụ (liên hệ dpo@omnitravel.vn).',
        ],
      },
    ],
  },
  {
    id: 'regulations',
    title: 'Quy Chế Hoạt Động Sàn Thương Mại Điện Tử OMNITRAVEL',
    shortTitle: 'Quy chế hoạt động',
    category: 'core',
    badge: 'Chuẩn Bộ Công Thương',
    iconName: 'BookOpen',
    lastUpdated: '01/01/2026',
    summary:
      'Quy chế quản lý, vận hành sàn giao dịch thương mại điện tử chuyên ngành vận tải hành khách trực tuyến theo Nghị định 52/2013/NĐ-CP và Nghị định 85/2021/NĐ-CP của Chính phủ.',
    sections: [
      {
        title: '1. Nguyên Tắc Hoạt Động',
        content: [
          'Sàn giao dịch TMĐT OMNITRAVEL hoạt động công khai, minh bạch, bảo vệ quyền lợi hợp pháp của người tiêu dùng và các đơn vị vận chuyển tham gia sàn.',
          'Mọi thương hiệu vận chuyển hiển thị trên sàn (Vietnam Airlines, Vietjet Air, Bamboo Airways, Vietravel Airlines, Đường sắt Việt Nam, Phương Trang, Mai Linh, Kumho Samco,...) đều là đối tác liên kết chính thức hoặc đại lý ủy quyền hợp pháp.',
          'Thông tin về giá vé, số ghế trống, giờ khởi hành và điểm đón/trả được đồng bộ thời gian thực (Real-time Sync) trực tiếp từ hệ thống API của các hãng.',
        ],
      },
      {
        title: '2. Quy Trình Giao Dịch & Xác Nhận Đơn Hàng',
        content: [
          'Bước 1: Khách hàng tìm kiếm lộ trình, so sánh thời gian di chuyển, nhà xe và mức giá.',
          'Bước 2: Khách hàng chọn vị trí ghế ngồi cụ thể trên sơ đồ trực quan.',
          'Bước 3: Khách hàng nhập thông tin liên hệ và họ tên hành khách.',
          'Bước 4: Thanh toán bằng phương thức quét mã VietQR tự động.',
          'Bước 5: Hệ thống tự động xác thực biên lai và phát hành Vé Điện Tử (E-Ticket) với mã QR tra cứu ngay trên màn hình và gửi qua Email.',
        ],
      },
      {
        title: '3. Cơ Chế Kiểm Duyệt và Quản Lý Chất Lượng',
        content: [
          'Tất cả phương tiện niêm yết trên OMNITRAVEL phải đáp ứng đầy đủ giấy phép kinh doanh vận tải, chứng nhận kiểm định an toàn kỹ thuật và bảo hiểm trách nhiệm dân sự còn hiệu lực.',
          'OMNITRAVEL áp dụng hệ thống đánh giá sao và phản hồi thực tế từ khách hàng sau mỗi chuyến đi để xếp hạng và loại bỏ các đối tác không đảm bảo chất lượng phục vụ.',
        ],
      },
    ],
  },
  {
    id: 'refund',
    title: 'Chính Sách Hoàn Tiền, Đổi Lịch & Hủy Vé',
    shortTitle: 'Chính sách hoàn & đổi vé',
    category: 'operation',
    badge: 'Nghiệp vụ vận tải',
    iconName: 'RefreshCw',
    lastUpdated: '12/01/2026',
    summary:
      'Quy định chi tiết về thời hạn, điều kiện áp dụng và mức phí hủy, đổi vé hoặc hoàn tiền tương ứng cho từng loại hình phương tiện (Hàng không, Đường sắt, Xe khách).',
    sections: [
      {
        title: '1. Bảng Quy Định Đổi / Hủy Vé Chi Tiết Theo Phương Tiện',
        content: [
          'Mức phí đổi hoặc hủy vé được áp dụng căn cứ theo thời điểm yêu cầu hủy so với giờ xe/tàu/máy bay xuất phát và điều kiện vé do nhà vận tải quy định:',
        ],
        table: {
          headers: ['Loại phương tiện', 'Thời gian yêu cầu trước giờ khởi hành', 'Mức phí hủy / đổi vé', 'Thời gian hoàn tiền'],
          rows: [
            ['Xe khách (FUTA, Mai Linh,...)', 'Trước trên 24 giờ', 'Miễn phí hoặc 5% - 10%', 'Trong vòng 24 giờ làm việc'],
            ['Xe khách liên tỉnh', 'Từ 12 giờ đến 24 giờ', 'Thu phí 20% - 30% giá vé', '1 - 2 ngày làm việc'],
            ['Xe khách liên tỉnh', 'Dưới 12 giờ hoặc đã xuất bến', 'Không hỗ trợ hoàn vé (100%)', 'Không áp dụng'],
            ['Đường sắt Việt Nam (VNR)', 'Trước giờ tàu chạy từ 24h trở lên', 'Phí 10% giá in trên vé', '2 - 3 ngày làm việc'],
            ['Đường sắt Việt Nam (VNR)', 'Từ 4h đến dưới 24h trước giờ chạy', 'Phí 20% giá in trên vé', '2 - 3 ngày làm việc'],
            ['Hàng không (Vietnam Airlines)', 'Tùy theo hạng Phổ thông / Thương gia', 'Theo điều kiện từng hạng vé', '3 - 7 ngày làm việc'],
            ['Hàng không giá rẻ (Vietjet)', 'Trước 3h (Đổi ngày/chặng bay)', 'Phí đổi + chênh lệch giá vé', 'Bảo lưu định danh / E-voucher'],
          ],
        },
        note: 'Các dịp Lễ, Tết Nguyên Đán mức phí và thời hạn hoàn hủy có thể thay đổi theo quy định đặc biệt của Tổng công ty Đường sắt và các Sở GTVT.',
      },
      {
        title: '2. Quy Trình Hoàn Tiền Tự Động',
        content: [
          'Sau khi yêu cầu hoàn vé được xác nhận hợp lệ, số tiền hoàn lại (sau khi trừ phí hủy theo quy định nếu có) sẽ được chuyển khoản trực tiếp vào tài khoản ngân hàng của khách hàng.',
          'Đối với các giao dịch thanh toán qua VietQR, hệ thống sẽ thực hiện lệnh chuyển khoản tự động Napas 24/7 đến đúng số tài khoản mà Quý khách đã sử dụng để quét mã.',
          'Bộ phận CSKH OMNITRAVEL sẽ gửi tin nhắn SMS và Email thông báo mã giao dịch hoàn tiền để Quý khách chủ động đối soát với ngân hàng thụ hưởng.',
        ],
      },
    ],
  },
  {
    id: 'dispute',
    title: 'Chính Sách Giải Quyết Khiếu Nại & Xử Lý Tranh Chấp',
    shortTitle: 'Giải quyết khiếu nại',
    category: 'operation',
    badge: 'Bảo vệ quyền lợi',
    iconName: 'AlertCircle',
    lastUpdated: '08/01/2026',
    summary:
      'Quy trình tiếp nhận, xử lý minh bạch và cam kết thời gian phản hồi khiếu nại của hành khách nhằm bảo vệ tối đa quyền lợi người tiêu dùng.',
    sections: [
      {
        title: '1. Cam Kết Thời Gian Phản Hồi Khiếu Nại',
        content: [
          'OMNITRAVEL tôn trọng và nghiêm túc tiếp thu mọi ý kiến phản hồi, khiếu nại liên quan đến chất lượng phục vụ, hành trình di chuyển hoặc các vấn đề thanh toán.',
          'Tiếp nhận ban đầu: Trong vòng 30 phút qua Hotline 1900 6868 và không quá 02 giờ làm việc qua Email/Ticket hỗ trợ.',
          'Xác minh & Phối hợp cùng nhà xe/hãng bay: Tối đa 24 giờ kể từ thời điểm tiếp nhận đầy đủ bằng chứng khiếu nại.',
          'Đưa ra phương án bồi thường / xử lý dứt điểm: Không quá 48 giờ làm việc.',
        ],
      },
      {
        title: '2. Quy Trình 4 Bước Xử Lý Khiếu Nại Chuẩn Hóa',
        content: [
          'Bước 1: Tiếp nhận phản ánh qua các kênh: Hotline 1900 6868, Email hotro@omnitravel.vn hoặc Trung tâm Hỗ trợ trực tuyến.',
          'Bước 2: Xác thực thông tin: Chuyên viên đối soát mã vé (Ticket ID), bằng chứng hình ảnh/video, biên lai thanh toán và ghi nhận yêu cầu của khách hàng.',
          'Bước 3: Làm việc với đơn vị vận chuyển: Yêu cầu đại diện nhà xe/hãng bay giải trình, trích xuất camera hành trình hoặc nhật ký vận hành chuyến đi.',
          'Bước 4: Giải quyết và đền bù thỏa đáng: Trường hợp lỗi thuộc về nhà vận tải hoặc hệ thống OMNITRAVEL, chúng tôi cam kết hoàn 100% tiền vé kèm voucher bồi thường thỏa đáng.',
        ],
      },
    ],
  },
  {
    id: 'baggage',
    title: 'Quy Định Về Hành Lý & Tiêu Chuẩn Vận Chuyển',
    shortTitle: 'Quy định hành lý',
    category: 'operation',
    badge: 'Quy chuẩn an toàn',
    iconName: 'Luggage',
    lastUpdated: '05/01/2026',
    summary:
      'Quy định tiêu chuẩn trọng lượng, kích thước hành lý xách tay, hành lý ký gửi và danh mục hàng hóa cấm vận chuyển trên các chuyến đi.',
    sections: [
      {
        title: '1. Tiêu Chuẩn Trọng Lượng & Kích Thước Hành Lý',
        content: [
          'Mỗi phương tiện áp dụng các hạn mức hành lý miễn cước khác nhau theo quy chuẩn an toàn giao thông:',
        ],
        table: {
          headers: ['Phương tiện', 'Hành lý xách tay (Miễn phí)', 'Hành lý ký gửi / để khoang xe', 'Quy định cước phụ trội'],
          rows: [
            ['Hàng không (Vietnam Airlines, Bamboo)', '01 kiện ≤ 10kg - 12kg + 01 phụ kiện', '01 kiện ≤ 23kg (tùy hạng vé)', 'Mua thêm gói hành lý ký gửi trước giờ bay'],
            ['Hàng không giá rẻ (Vietjet Air)', '01 kiện chính ≤ 7kg + 01 túi xách nhỏ', 'Chưa bao gồm (phải mua thêm)', 'Phí mua tại sân bay cao hơn mua trước trực tuyến'],
            ['Đường sắt Việt Nam (Tàu hỏa SE/TN)', 'Tối đa 20kg/hành khách, để trên giá hành lý toa', 'Hành lý cồng kềnh gửi toa xe riêng', 'Tính theo biểu cước vận chuyển hàng hóa ĐSVN'],
            ['Xe khách liên tỉnh (Giường nằm / Limousine)', '01 balo/túi xách nhỏ mang lên ghế', '01 vali ≤ 20kg để tại hầm hành lý', 'Hàng cồng kềnh phụ thu 50.000đ - 100.000đ/kiện'],
          ],
        },
      },
      {
        title: '2. Danh Mục Hàng Hóa Cấm Vận Chuyển Tuyệt Đối',
        content: [
          'Vũ khí quân dụng, súng, đạn dược, vật liệu nổ, pháo hoa các loại.',
          'Các chất lỏng, khí ga dễ cháy nổ (xăng, dầu, bình gas mini, dung môi hóa chất).',
          'Các chất độc hại, chất phóng xạ, chất ăn mòn kim loại, hóa chất nguy hiểm.',
          'Các chất cấm, ma túy, tiền chất ma túy theo luật pháp Nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.',
          'Động vật sống (trừ trường hợp vật nuôi cảnh đã qua kiểm dịch y tế và có lồng vận chuyển chuyên dụng gửi theo khoang hành lý xe khách được nhà xe đồng ý trước).',
        ],
        note: 'Hành khách cố tình vi phạm sẽ bị hủy vé ngay lập tức không hoàn tiền và chuyển giao cơ quan chức năng xử lý theo pháp luật.',
      },
    ],
  },
  {
    id: 'insurance',
    title: 'Chính Sách Bảo Hiểm & An Toàn Chuyến Đi',
    shortTitle: 'Bảo hiểm & An toàn',
    category: 'operation',
    badge: 'Bảo hiểm trọn gói',
    iconName: 'ShieldAlert',
    lastUpdated: '01/01/2026',
    summary:
      'Quyền lợi bảo hiểm bắt buộc trách nhiệm dân sự đối với hành khách trên mọi chuyến xe, tàu hỏa và máy bay đã được bao gồm trong giá vé.',
    sections: [
      {
        title: '1. Quyền Lợi Bảo Hiểm Mặc Định Trong Vé',
        content: [
          '100% vé xuất qua OMNITRAVEL đều đã bao gồm phí Bảo hiểm Trách nhiệm Dân sự bắt buộc của chủ phương tiện đối với hành khách theo quy định của Bộ Giao thông Vận tải và Bộ Tài chính.',
          'Hành khách được bảo hiểm bảo vệ toàn diện trong suốt thời gian từ khi lên phương tiện tại điểm xuất phát đến khi xuống phương tiện an toàn tại điểm kết thúc hành trình.',
          'Mức trách nhiệm bảo hiểm bồi thường tai nạn người lên tới 100.000.000 VND đến 150.000.000 VND/người/vụ theo quy định pháp luật hiện hành.',
        ],
      },
      {
        title: '2. Thủ Tục Hưởng Quyền Lợi Bảo Hiểm Khi Có Rủi Ro',
        content: [
          'Khi xảy ra sự cố không may trong chuyến đi, hành khách hoặc thân nhân cần:',
          '1) Yêu cầu biên bản xác nhận tai nạn từ trưởng tàu, lái xe hoặc đại diện hãng hàng không tại hiện trường;',
          '2) Giữ nguyên cuống vé điện tử (mã Ticket ID) do OMNITRAVEL phát hành;',
          '3) Thu thập các hóa đơn, chứng từ y tế hợp lệ từ cơ sở khám chữa bệnh;',
          '4) Liên hệ Tổng đài khẩn cấp OMNITRAVEL 1900 6868 để được bộ phận pháp chế hướng dẫn hoàn tất hồ sơ bồi thường nhanh chóng trong vòng 07 ngày làm việc.',
        ],
      },
    ],
  },
];
