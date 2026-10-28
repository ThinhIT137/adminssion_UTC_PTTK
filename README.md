# Sequence chức năng theo 6 sprint

Mở [mục lục HTML](index.html) để chọn chức năng. Có **49 sơ đồ**, mỗi chức năng một HTML, kèm JSON Archify để chỉnh sửa.

## Phạm vi

- Chỉ tạo tài liệu dưới docs/squence, không sửa app, backend AI, DB hoặc commit/push.
- Sơ đồ các chức năng trùng sprint thể hiện góc nhìn phát triển/tích hợp/hoàn thiện của sprint tương ứng, không phải chức năng mới độc lập.
- CRUD là một chức năng quản trị; đọc/thêm/sửa/xóa là các thao tác thay thế, không chạy tất cả theo thứ tự trong một yêu cầu.
- API chưa có nguồn thật, thiếu UI, fallback và lỗi nghiệp vụ đã biết được ghi trong thẻ lưu ý. Không vẽ guard chưa tồn tại thành hành vi đã có.
- Không đo latency, không chạy các API nghiệp vụ hoặc test app. Finalize của Archify chỉ kiểm tra artifact/sơ đồ trong trình duyệt.
- Giao diện công cụ Archify có thể còn tiếng Anh vì chưa có catalog vi; nội dung tác giả bằng tiếng Việt.

## Nguồn và khác biệt local

Archify xác minh source ở commit, không phải bytes chưa commit. Vì vậy sơ đồ dùng core đã commit ở các revision dưới đây; không khẳng định mô tả đầy đủ mọi thay đổi chưa commit hoặc bản Render/Vercel. Backend được vẽ như hộp đen trong sơ đồ repo frontend; sơ đồ repo backend mới mô tả xử lý nội bộ.

### next

- Repo: frontend_admission
- Revision: f85d938356210193c70e3bf79e232587a1d04caa
- Origin: https://github.com/ThinhIT137/frontend_admission_UTC.git
- Source thay đổi local không được gán cho revision trên:

```text
M actions/compare.action.ts
 M actions/recommended-programs.action.ts
 M app/(main)/hoi-dap-ai/ChatbotClient.tsx
 M app/(main)/hoi-dap-ai/page.tsx
 M app/(main)/ket-qua-tu-van/ApiResultClient.tsx
 M app/(main)/layout.tsx
 M app/(main)/loading.tsx
 M app/(main)/nop-ho-so/NopHoSoClient.tsx
 M app/(main)/nop-ho-so/page.tsx
 M app/(main)/so-sanh-chuong-trinh/CompareClient.tsx
 M app/(main)/so-sanh-chuong-trinh/ProgramPicker.tsx
 M app/(main)/so-sanh-chuong-trinh/page.tsx
 M app/(main)/thong-tin-tuyen-sinh/AdmissionHistoryTable.tsx
 M app/(main)/thong-tin-tuyen-sinh/ThongTinTuyenSinhClient.tsx
 M app/(main)/thong-tin-tuyen-sinh/page.tsx
 M app/(main)/tinh-diem-quy-doi/TinhDiemQuyDoiClient.tsx
 M app/(main)/tinh-diem-quy-doi/eligibility.ts
 M app/(main)/tinh-diem-quy-doi/page.tsx
 M app/(main)/tra-cuu-nganh-hoc/MajorLookupClient.tsx
 M app/(main)/tra-cuu-nganh-hoc/page.tsx
 M app/(main)/trac-nghiem-mbti/MBTITestClient.tsx
 M app/api/backend/[service]/[...path]/route.ts
 M components/layout/Sidebar.tsx
 M components/layout/footer.tsx
 M components/tra-cuu-nganh-hoc/FilterAndSearchBar.tsx
 M components/tra-cuu-nganh-hoc/MajorCard.tsx
 M components/ui/ChatWidget.tsx
 M components/ui/DisclaimerBanner.tsx
 M components/ui/Timeline.tsx
 M libs/api-services/backend.server.ts
 M libs/api-services/browser-api.ts
 M prisma.config.ts
```

### score

- Repo: backend_admission/backend_application_score
- Revision: 1cd1281a115a7a97bddada3f05d8e3c70e9e941f
- Origin: https://github.com/ThinhIT137/backend_application_score.git
- Source thay đổi local không được gán cho revision trên:

```text
M app.py
 M src/core/config.py
 M src/data/mock_scores.json
 M src/models/__init__.py
 M src/router/candidate_auth_router.py
 M src/router/workflow_router.py
 M src/schemas/diem_schema.py
 M src/services/admission_service.py
 M src/services/candidate_preferences_service.py
 M src/services/ho_so_service.py
```

### ai

- Repo: backend_admission/backend_ai_ml_latest
- Revision: 3c487756b7f3ddb98e4729c8a2c903c8a5c4b8eb
- Origin: https://github.com/ThinhIT137/backend_ai_ml.git
- Source thay đổi local không được gán cho revision trên:

```text
M tests/conftest.py
```

Danh sách tracked changes không bao gồm file untracked. Đặc biệt coordinator nộp hồ sơ/ảnh và operation journal local chưa được coi là source của commit score. Các sửa UI/tính điểm/chat local sau commit cũng không tự động có trong sơ đồ. Xem [báo cáo source hiện tại](../review/DOI-CHIEU-6-SPRINT.md) để đối chiếu.

## Danh mục

### Sprint 1

- [Hiển thị giao diện và bố cục thí sinh](<sprint_1/Hiển thị giao diện và bố cục thí sinh.html>)
- [Hiển thị giao diện quản trị](<sprint_1/Hiển thị giao diện quản trị.html>)
- [Đăng nhập quản trị](<sprint_1/Đăng nhập quản trị.html>)
- [Quản lý tài khoản quản trị](<sprint_1/Quản lý tài khoản quản trị.html>)
- [Quản lý vai trò và phân quyền](<sprint_1/Quản lý vai trò và phân quyền.html>)
- [Quản trị ngành học](<sprint_1/Quản trị ngành học.html>)
- [Quản trị chương trình đào tạo](<sprint_1/Quản trị chương trình đào tạo.html>)
- [Quản lý dữ liệu điểm chuẩn các năm](<sprint_1/Quản lý dữ liệu điểm chuẩn các năm.html>)
- [Tính điểm quy đổi](<sprint_1/Tính điểm quy đổi.html>)
- [Nộp hồ sơ học bạ chứng chỉ giải thưởng](<sprint_1/Nộp hồ sơ học bạ chứng chỉ giải thưởng.html>)
- [Tra cứu trạng thái hồ sơ](<sprint_1/Tra cứu trạng thái hồ sơ.html>)
- [Trắc nghiệm MBTI](<sprint_1/Trắc nghiệm MBTI.html>)
- [Quản lý tri thức chatbot](<sprint_1/Quản lý tri thức chatbot.html>)
- [Hỏi đáp AI Chatbot](<sprint_1/Hỏi đáp AI Chatbot.html>)
- [Thêm dữ liệu mẫu kiểm thử](<sprint_1/Thêm dữ liệu mẫu kiểm thử.html>)

### Sprint 2

- [Quản lý tổ hợp xét tuyển](<sprint_2/Quản lý tổ hợp xét tuyển.html>)
- [Quản lý phương thức xét tuyển](<sprint_2/Quản lý phương thức xét tuyển.html>)
- [Quản lý mốc thời gian tuyển sinh](<sprint_2/Quản lý mốc thời gian tuyển sinh.html>)
- [Thiết lập chỉ tiêu tuyển sinh đầu mùa](<sprint_2/Thiết lập chỉ tiêu tuyển sinh đầu mùa.html>)
- [Duyệt xử lý hồ sơ thí sinh](<sprint_2/Duyệt xử lý hồ sơ thí sinh.html>)
- [Cập nhật trạng thái xét tuyển](<sprint_2/Cập nhật trạng thái xét tuyển.html>)
- [Đồng bộ điểm thi THPT](<sprint_2/Đồng bộ điểm thi THPT.html>)
- [Nộp và xác minh điểm ĐGNL](<sprint_2/Nộp và xác minh điểm ĐGNL.html>)
- [Xem kết quả tư vấn hướng nghiệp](<sprint_2/Xem kết quả tư vấn hướng nghiệp.html>)
- [Dự đoán khả năng trúng tuyển](<sprint_2/Dự đoán khả năng trúng tuyển.html>)
- [Dự đoán điểm chuẩn chương trình](<sprint_2/Dự đoán điểm chuẩn chương trình.html>)

### Sprint 3

- [Xem thông tin tuyển sinh](<sprint_3/Xem thông tin tuyển sinh.html>)
- [Quản lý tin tức quy chế và hướng dẫn](<sprint_3/Quản lý tin tức quy chế và hướng dẫn.html>)
- [Xem lộ trình tuyển sinh và nhập học](<sprint_3/Xem lộ trình tuyển sinh và nhập học.html>)
- [Tra cứu ngành học](<sprint_3/Tra cứu ngành học.html>)
- [Tra cứu chương trình đào tạo](<sprint_3/Tra cứu chương trình đào tạo.html>)
- [Tích hợp API hồ sơ và điểm](<sprint_3/Tích hợp API hồ sơ và điểm.html>)
- [Tích hợp API MBTI và Chatbot](<sprint_3/Tích hợp API MBTI và Chatbot.html>)
- [Tra cứu kết quả trúng tuyển](<sprint_3/Tra cứu kết quả trúng tuyển.html>)
- [Thông báo kết quả cho thí sinh](<sprint_3/Thông báo kết quả cho thí sinh.html>)

### Sprint 4

- [Thống kê tổng quan hồ sơ](<sprint_4/Thống kê tổng quan hồ sơ.html>)
- [Thống kê theo ngành học](<sprint_4/Thống kê theo ngành học.html>)
- [Thống kê theo phương thức và tổ hợp](<sprint_4/Thống kê theo phương thức và tổ hợp.html>)
- [Báo cáo kết quả trúng tuyển](<sprint_4/Báo cáo kết quả trúng tuyển.html>)
- [Xuất báo cáo CSV](<sprint_4/Xuất báo cáo CSV.html>)
- [In và lưu báo cáo PDF](<sprint_4/In và lưu báo cáo PDF.html>)

### Sprint 5

- [Xử lý lỗi khi duyệt và từ chối hồ sơ](<sprint_5/Xử lý lỗi khi duyệt và từ chối hồ sơ.html>)
- [Tách hồ sơ hợp lệ khỏi kết quả trúng tuyển](<sprint_5/Tách hồ sơ hợp lệ khỏi kết quả trúng tuyển.html>)
- [Lưu tin tức thật và làm mới giao diện](<sprint_5/Lưu tin tức thật và làm mới giao diện.html>)
- [Đồng bộ tri thức Chatbot sau cập nhật](<sprint_5/Đồng bộ tri thức Chatbot sau cập nhật.html>)

### Sprint 6

- [Chốt điểm xét tuyển từ hồ sơ](<sprint_6/Chốt điểm xét tuyển từ hồ sơ.html>)
- [Chốt quyết định trúng tuyển](<sprint_6/Chốt quyết định trúng tuyển.html>)
- [Công bố kết quả chính thức](<sprint_6/Công bố kết quả chính thức.html>)
- [Đối soát tra cứu thống kê và báo cáo](<sprint_6/Đối soát tra cứu thống kê và báo cáo.html>)

## Kết quả kiểm tra artifact

49/49 sơ đồ đã qua các gate validate, deliver, check và browser-check của Archify. Kết quả hiện hành nằm trong [ket-qua-archify.json](ket-qua-archify.json); đã đối chiếu hash candidate với receipt. Chưa đánh giá trực quan từng sơ đồ bằng mắt và chưa chạy kiểm thử nghiệp vụ app. Receipt của các lượt xuất trước được giữ để truy vết, không thay thế kết quả tổng hợp hiện hành.

## Lệnh tái tạo

Chạy generator từ thư mục gốc project bằng Node để sinh JSON/mục lục. Sau đó chạy Archify finalize cho mỗi candidate với repo-root tương ứng trong manifest.json. Không gọi generator sau khi muốn giữ thay đổi thủ công trong JSON. Các receipt đi kèm ghi kết quả kiểm tra thực tế; không coi việc có HTML là đã qua mọi gate.
