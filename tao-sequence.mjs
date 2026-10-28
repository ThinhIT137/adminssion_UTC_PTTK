// Chỉ sinh tài liệu sequence; không chạy app, migration hay sửa repository nguồn.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const base = 'docs/squence';
const git = (repo, ...args) => execFileSync('git', ['-C', repo, ...args], {encoding:'utf8', maxBuffer:8*1024*1024});
const repos = {
  next: {root:'frontend_admission'},
  score: {root:'backend_admission/backend_application_score'},
  ai: {root:'backend_admission/backend_ai_ml_latest'},
};
for (const repo of Object.values(repos)) {
  repo.revision = git(repo.root,'rev-parse','HEAD').trim();
  repo.url = git(repo.root,'remote','get-url','origin').trim().replace(/(https?:\/\/)[^/@]+@/, '$1');
  repo.dirty = git(repo.root,'status','--short','-uno').trim();
}
const definitions = [];
const ref = (file,line=1,end_line) => ({path:file,line,...(end_line?{end_line}:{})});
const person = ['web','frontend','Người dùng','Giao diện trình duyệt'];
const server = ['next','backend','Next.js','Server Action / API'];
const database = ['db','database','PostgreSQL','Supabase'];
const service = ['svc','backend','Service','Xử lý nghiệp vụ'];
function add(sprint,title,repo,participants,messages,sources,notes=[]) {
  definitions.push({sprint,title,repo,participants,messages,sources,notes});
}
function crud(sprint,title,action,file,table,notes=[]) {
  add(sprint,title,'next',[person,server,service,database],[
    ['web','next',action],
    ['next','db','Đọc danh tính quản trị','security'],
    ['db','next','Tài khoản và vai trò','return'],
    ['next','svc','Gọi service được phép'],
    ['svc','db',`Đọc / ghi ${table}`],
    ['db','svc','Kết quả hoặc lỗi ràng buộc','return'],
    ['svc','next','Trả kết quả xử lý','return'],
    ['next','web','Làm mới danh sách / báo lỗi','return'],
  ],[ref(file)],['Sơ đồ CRUD tóm lược các thao tác đọc/thêm/sửa/xóa; mỗi thao tác là một lần gọi riêng.',...notes]);
}

add(1,'Hiển thị giao diện và bố cục thí sinh','next',[person,server,['layout','frontend','Layout chung','Header / sidebar / footer']],[
 ['web','next','Mở trang thí sinh'],['next','layout','Lắp bố cục và nội dung'],['layout','next','Cây giao diện','return'],['next','web','HTML / React payload','return']
],[ref('app/(main)/layout.tsx')],['Mô tả bố cục ở commit đã neo; thay đổi giao diện local sau commit không được giả làm bằng chứng HEAD.']);
add(1,'Hiển thị giao diện quản trị','next',[person,server,database],[
 ['web','next','Mở trang admin'],['next','db','Đọc tài khoản từ phiên','security'],['db','next','Tài khoản / vai trò','return'],['next','web','Layout admin hoặc chuyển login','return']
],[ref('app/admin/(dashboard)/layout.tsx'),ref('services/user.service.ts',96,143)]);
add(1,'Đăng nhập quản trị','next',[person,server,['auth','security','Xác thực','Mật khẩu băm / JWT'],database],[
 ['web','next','Gửi email và mật khẩu','security'],['next','db','Tìm admin theo email'],['db','next','Tài khoản và mật khẩu băm','return'],['next','auth','Kiểm tra mật khẩu; ký JWT','security'],['auth','next','Access / refresh token','return'],['next','web','Ghi cookie khi hợp lệ','return']
],[ref('actions/auth.action.ts',9,27),ref('services/user.service.ts',30,46),ref('services/token.service.ts')],['Sai mật khẩu: dừng trước bước ký token và trả lỗi. Không lưu mật khẩu vào JWT.']);
crud(1,'Quản lý tài khoản quản trị','CRUD tài khoản','services/user.service.ts','admin',['Tạo/xóa và sửa tài khoản khác cần super admin; sửa bản thân có giới hạn riêng.']);
crud(1,'Quản lý vai trò và phân quyền','CRUD vai trò','services/role.service.ts','vai_tro',['Quyền thực tế dựa tên vai trò; chưa phải permission tùy biến. P07: service chưa chặn đổi tên vai trò mặc định.']);
crud(1,'Quản trị ngành học','CRUD ngành học','services/nganh_hoc.service.ts','nganh_hoc');
crud(1,'Quản trị chương trình đào tạo','CRUD chương trình','services/chuong_trinh_dao_tao.service.ts','chuong_trinh_dao_tao');
add(1,'Quản lý dữ liệu điểm chuẩn các năm','score',[['caller','external','Caller admin','JWT quản trị'],['api','backend','Score API','/diem-chuan'],service,database],[
 ['caller','api','CRUD theo năm / chương trình','security'],['api','svc','Yêu cầu có quyền admin'],['svc','db','Kiểm tra tham chiếu / trùng năm'],['db','svc','Dữ liệu hiện tại','return'],['svc','db','Ghi lịch sử và điểm phương thức'],['db','svc','Flush dữ liệu','return'],['svc','api','Bản ghi / lỗi','return'],['api','caller','Response sau transaction','return']
],[ref('src/router/admission_router.py',14,44),ref('src/services/admission_service.py',20,83),ref('src/core/database.py')],['Giữ các điều kiện cũ khi payload không sửa; không cộng lặp chỉ tiêu theo phương thức.']);
add(1,'Tính điểm quy đổi','score',[['caller','external','Next.js','Đầu vào thí sinh'],['api','backend','Score API','/diem/tinh-diem-doi-soat'],database,['scale','database','JSON quy đổi','Bảng năm 2026']],[
 ['caller','api','Gửi điểm và phương thức'],['api','db','Đọc tổ hợp và tên môn'],['db','api','Danh mục môn','return'],['api','scale','Học bạ / HSA / TSA nếu cần'],['scale','api','Điểm tương đương / lỗi','return'],['api','caller','Tổng điểm và lưu ý sơ bộ','return']
],[ref('src/router/diem_router.py',30,32),ref('src/services/score_preview.py'),ref('src/services/conversion_service.py')],['THPT giữ điểm gốc, không cần bước quy đổi JSON. Chứng chỉ chưa có công thức trả trạng thái thiếu cấu hình.', 'Backend trả phép tính điểm; Next.js chịu trách nhiệm trình bày, chênh lệch và phân nhóm tham khảo.']);
add(1,'Nộp hồ sơ học bạ chứng chỉ giải thưởng','score',[['caller','external','Thí sinh','Phiên đã xác thực'],['api','backend','Score API','POST /ho-so'],service,database],[
 ['caller','api','Gửi metadata hồ sơ','security'],['api','svc','Danh tính lấy từ JWT'],['svc','db','Khóa thí sinh; kiểm tra mã'],['db','svc','Tham chiếu và nguyện vọng','return'],['svc','db','Tạo hồ sơ chờ và minh chứng'],['db','svc','Flush cùng transaction','return'],['svc','api','Hồ sơ đã tạo','return'],['api','caller','201 hoặc lỗi rollback','return']
],[ref('src/router/admission_router.py',45),ref('src/services/admission_service.py',85),ref('src/core/database.py')],['Đây là metadata của API lõi ở commit score đã neo. Coordinator ảnh-sau và giao dịch bù đang untracked/local không được trình bày như source commit này.', 'File Storage không nằm trong transaction PostgreSQL; xem báo cáo đối chiếu cho khác biệt local.']);
add(1,'Tra cứu trạng thái hồ sơ','score',[['caller','external','Thí sinh','Phiên và mã hồ sơ'],['api','backend','Score API','Tra cứu hồ sơ'],service,database],[
 ['caller','api','Tra cứu hồ sơ của mình','security'],['api','svc','Xác minh chủ hồ sơ'],['svc','db','Đọc hồ sơ và trạng thái'],['db','svc','Hồ sơ / kết quả','return'],['svc','api','Che quyết định chưa công bố','return'],['api','caller','Trạng thái được phép xem','return']
],[ref('src/router/ho_so_router.py'),ref('src/services/ho_so_service.py'),ref('src/services/result_state.py')],['Hợp lệ không có nghĩa đã trúng tuyển; kết quả public cần cong_bo_at và trạng thái do/truot.']);
add(1,'Trắc nghiệm MBTI','ai',[['caller','external','Next.js','API MBTI'],['api','backend','AI service','Chấm MBTI'],['repo','backend','Repository','Câu hỏi / kết quả'],database],[
 ['caller','api','GET bộ câu hỏi'],['api','repo','Nạp bộ câu hỏi'],['repo','db','SELECT câu hỏi active'],['db','repo','Câu hỏi / lỗi','return'],['repo','api','DB hoặc bộ mặc định','return'],['api','caller','Danh sách câu hỏi','return'],['caller','api','POST câu trả lời'],['api','repo','Lưu báo cáo đã chấm'],['repo','db','INSERT kết quả'],['db','repo','Mã kết quả / lỗi','return'],['repo','api','result_id hoặc null','return'],['api','caller','Báo cáo và mã kết quả','return']
],[ref('src/router/mbti_router.py'),ref('src/services/mbti_service.py',19,76),ref('src/repositories/mbti_repository.py',18,95)],['Nếu đọc câu hỏi DB thất bại, AI dùng MBTI_QUESTIONS. Nếu lưu thất bại, frontend cần chặn điều hướng khi thiếu result_id.']);
add(1,'Quản lý tri thức chatbot','ai',[['caller','external','Admin qua Next.js','Khóa nội bộ'],['api','backend','AI service','CRUD tri thức'],['repo','backend','Repository','tri_thuc_ai'],database,['rag','backend','RAG','Bộ nhớ tri thức']],[
 ['caller','api','Thêm / sửa / xóa','security'],['api','repo','Lưu thay đổi tri thức'],['repo','db','INSERT / UPDATE / DELETE'],['db','repo','Kết quả đã ghi','return'],['repo','api','Bản ghi / xác nhận','return'],['api','repo','Đọc tri thức active'],['repo','db','SELECT tri thức'],['db','repo','Danh sách','return'],['repo','api','Nội dung cần đồng bộ','return'],['api','rag','Reload kho tri thức'],['rag','api','Kết quả sync / lỗi','return'],['api','caller','Thành công hoặc lỗi chung','return']
],[ref('src/router/chat_router.py',39),ref('src/services/chat_service.py',104,138),ref('src/repositories/chat_repository.py')],['Ghi DB và reload RAG không phải một transaction. P09: có thể DB đã đổi nhưng sync lỗi.']);
add(1,'Hỏi đáp AI Chatbot','ai',[['caller','external','Next.js','Trang chat / widget'],['api','backend','AI service','ChatService'],['rag','backend','RAG','Ngữ cảnh trong bộ nhớ'],['llm','cloud','LLM ngoài','NVIDIA NIM']],[
 ['caller','api','POST câu hỏi và session'],['api','rag','Retrieve ngữ cảnh top 3'],['rag','api','Các đoạn liên quan','return'],['api','llm','Prompt gồm câu hỏi + ngữ cảnh'],['llm','api','Nội dung / lỗi kết nối','return'],['api','caller','Câu trả lời, nguồn và session','return']
],[ref('src/router/chat_router.py',17,28),ref('src/services/chat_service.py',41,102),ref('src/ml/llm/loader.py')],['LLM lỗi: AI trả nội dung hướng dẫn liên hệ; không đồng nghĩa mô hình đã trả lời thành công.', 'RAG dùng dữ liệu đã nạp; không vẽ một SELECT DB cho từng câu hỏi khi source không làm vậy.']);

crud(2,'Quản lý tổ hợp xét tuyển','CRUD tổ hợp','services/to_hop_xet_tuyen.service.ts','to_hop_xet_tuyen');
crud(2,'Quản lý phương thức xét tuyển','CRUD phương thức','services/phuong_thuc_xet_tuyen.service.ts','phuong_thuc_xet_tuyen');
crud(2,'Quản lý mốc thời gian tuyển sinh','CRUD mốc thời gian','services/lo_trinh_tuyen_sinh.service.ts','lo_trinh_tuyen_sinh',['P06: validation khoảng ngày ở server chưa đầy đủ.']);
add(2,'Thiết lập chỉ tiêu tuyển sinh đầu mùa','next',[person,server,['score','external','Backend điểm','API có JWT']],[
 ['web','next','Chọn chương trình và năm'],['next','score','POST chỉ tiêu + phương thức','security'],['score','next','Bản ghi / lỗi','return'],['next','web','Làm mới danh sách chỉ tiêu','return'],['web','next','Sửa chỉ tiêu hiện có'],['next','score','GET bản ghi hiện tại','security'],['score','next','Điểm và điều kiện cũ','return'],['next','score','PUT đầy đủ; giữ điều kiện','security'],['score','next','Xác nhận / lỗi','return'],['next','web','Kết quả cập nhật','return']
],[ref('actions/chi_tieu.action.ts')],['Điểm tạo ban đầu bằng 0 là chưa công bố, không phải điểm trúng tuyển bằng 0.']);
add(2,'Duyệt xử lý hồ sơ thí sinh','score',[['caller','external','Cán bộ tuyển sinh','JWT admin'],['api','backend','Score API','Duyệt / từ chối'],service,database],[
 ['caller','api','Duyệt hoặc từ chối','security'],['api','svc','Gửi danh tính cán bộ'],['svc','db','Đọc hồ sơ phải còn chờ'],['db','svc','Hồ sơ / lỗi','return'],['svc','db','Ghi hợp lệ hoặc từ chối'],['db','svc','Lưu trong transaction','return'],['svc','api','Trạng thái mới','return'],['api','caller','Thành công / lỗi nghiệp vụ','return']
],[ref('src/router/ho_so_router.py'),ref('src/services/ho_so_service.py',105,140),ref('src/core/database.py')],['Từ chối cần lý do; duyệt hợp lệ chưa tạo quyết định đỗ.']);
add(2,'Cập nhật trạng thái xét tuyển','score',[['caller','external','Cán bộ','JWT admin'],['api','backend','Workflow API','Bắt đầu xử lý'],database],[
 ['caller','api','PATCH bắt đầu xét tuyển','security'],['api','db','Khóa hồ sơ; đọc trạng thái'],['db','api','Hồ sơ hợp lệ / lỗi','return'],['api','db','Ghi dang_xu_ly và cán bộ'],['db','api','Flush thay đổi','return'],['api','caller','Trạng thái đang xử lý','return']
],[ref('src/router/workflow_router.py',49,77),ref('src/core/database.py')],['Chỉ chấp nhận từ hop_le và chưa công bố. Chốt điểm, quyết định và công bố là các sơ đồ riêng của Sprint 6.']);
add(2,'Đồng bộ điểm thi THPT','score',[['caller','external','Quản trị','Yêu cầu đồng bộ'],['api','backend','Score service','DiemService'],['provider','external','Nguồn cấu hình','HTTP / mock / disabled'],database],[
 ['caller','api','Đồng bộ năm học','security'],['api','provider','Fetch điểm theo provider'],['provider','api','Dữ liệu hoặc lỗi nguồn','return'],['api','db','Nếu có dữ liệu: kiểm tra mã'],['db','api','Thí sinh / môn hợp lệ','return'],['api','db','Upsert điểm từng thí sinh'],['db','api','Kết quả ghi','return'],['api','caller','Tổng thành công và lỗi','return']
],[ref('src/router/diem_router.py',35,54),ref('src/services/diem_service.py',40,80),ref('src/repositories/diem_repository.py')],['Nhánh nguồn lỗi dừng trước bước ghi DB. Chưa xác minh API Bộ thật; có adapter không đồng nghĩa đã kết nối.']);
add(2,'Nộp và xác minh điểm ĐGNL','score',[['caller','external','Thí sinh / admin','Hai thao tác riêng'],['api','backend','Score service','Điểm ĐGNL'],database,['provider','external','Nguồn ĐGNL','Provider được cấu hình']],[
 ['caller','api','Thí sinh nộp điểm và minh chứng','security'],['api','db','Kiểm tra CCCD và trùng năm'],['db','api','Tham chiếu hợp lệ','return'],['api','db','Lưu chứng chỉ chờ xác minh'],['db','api','Chứng chỉ','return'],['api','caller','Đã nhận; chưa xác minh','return'],['caller','api','Admin yêu cầu xác minh','security'],['api','provider','Đối chiếu nguồn cấu hình'],['provider','api','Kết quả / lỗi nguồn','return'],['api','db','Nếu đạt: cập nhật xác minh'],['db','api','Trạng thái lưu','return'],['api','caller','Kết quả xác minh','return']
],[ref('src/router/diem_router.py',57,80),ref('src/services/diem_service.py',82),ref('src/repositories/diem_repository.py')],['Hai lượt gửi độc lập. Provider thật chưa được nghiệm thu; không tự coi minh chứng tải lên là dữ liệu đã xác thực.']);
add(2,'Xem kết quả tư vấn hướng nghiệp','ai',[['caller','external','Next.js','Mã kết quả MBTI'],['api','backend','AI service','GET result'],['repo','backend','Repository','Báo cáo đã lưu'],database],[
 ['caller','api','GET kết quả theo ID'],['api','repo','Tìm báo cáo'],['repo','db','SELECT ket_qua_trac_nghiem'],['db','repo','Payload / không có','return'],['repo','api','Báo cáo đã chuẩn hóa','return'],['api','caller','Nội dung tư vấn / 404','return']
],[ref('src/router/mbti_router.py',41,58),ref('src/services/mbti_service.py',72,84),ref('src/repositories/mbti_repository.py',97)],['P10: chưa thấy kiểm tra chủ sở hữu ở router này. Không vẽ bước xác thực tưởng tượng.']);
add(2,'Dự đoán khả năng trúng tuyển','ai',[['caller','external','Next.js','Điểm đầu vào'],['api','backend','Prediction API','Admission chance'],['eval','backend','Bộ đánh giá','Admission predictor']],[
 ['caller','api','POST điểm và mã chương trình'],['api','eval','Chuẩn hóa và đánh giá'],['eval','api','Cơ hội / giải thích','return'],['api','caller','Kết quả chỉ tham khảo','return']
],[ref('src/router/prediction_router.py',46,63),ref('src/services/prediction_service.py',100),ref('src/ml/prediction/admission_predictor.py')],['Không cung cấp quyết định trúng tuyển chính thức; khác phép cộng trừ/phân nhóm ở Next.js.']);
add(2,'Dự đoán điểm chuẩn chương trình','ai',[['caller','external','Next.js','Bảng dự báo'],['api','backend','Prediction API','Mùa 2026'],['repo','backend','Repository','DB / fallback'],database,['asset','database','Asset JSON','Anchor 2025–2026']],[
 ['caller','api','GET all-benchmarks'],['api','repo','Đọc dự đoán 2026'],['repo','db','SELECT dự đoán + lịch sử'],['db','repo','Dữ liệu / rỗng / lỗi','return'],['repo','asset','Chỉ khi thiếu DB: đọc anchor'],['asset','repo','Dữ liệu fallback','return'],['repo','api','Danh sách đã ghép','return'],['api','caller','Điểm và khoảng dự báo','return']
],[ref('src/router/prediction_router.py',16,33),ref('src/services/prediction_service.py',24,75),ref('src/repositories/prediction_repository.py',1,85)],['Nhánh asset chỉ chạy khi thiếu dữ liệu DB. Fallback trong repo có thể dùng điểm cũ làm diem_du_doan; không khẳng định mọi kết quả là suy luận model mới.', 'Hợp đồng đang gắn năm 2026, không tự đổi thành năm 2027.']);

function publicRead(title,file,serviceFile,query) {
 add(3,title,'next',[person,server,service,database],[
  ['web','next','Mở trang / đổi bộ lọc'],['next','svc','Chuẩn hóa tham số truy vấn'],['svc','db',query],['db','svc','Danh sách / lỗi','return'],['svc','next','Dữ liệu đã ánh xạ','return'],['next','web','Render kết quả / báo thiếu','return']
 ],[ref(file),ref(serviceFile)],['Đọc DB ở server Next.js; không giả định mọi trang công khai phải gọi backend điểm.']);
}
publicRead('Xem thông tin tuyển sinh','app/(main)/thong-tin-tuyen-sinh/page.tsx','services/chuong_trinh_dao_tao.service.ts','Đọc lịch sử và danh mục');
crud(3,'Quản lý tin tức quy chế và hướng dẫn','Lưu / xóa bài viết','actions/content.action.ts','trang_noi_dung',['Runtime đang dùng bảng cũ. Không vẽ CMS tin_tuc mới như đã được nối hoàn chỉnh.']);
publicRead('Xem lộ trình tuyển sinh và nhập học','app/(main)/lo-trinh-tuyen-sinh/page.tsx','services/lo_trinh_tuyen_sinh.service.ts','Đọc các mốc đã cấu hình');
publicRead('Tra cứu ngành học','app/(main)/tra-cuu-nganh-hoc/page.tsx','services/chuong_trinh_dao_tao.service.ts','Đọc chương trình và ngành liên quan');
publicRead('Tra cứu chương trình đào tạo','app/(main)/tra-cuu-nganh-hoc/page.tsx','services/chuong_trinh_dao_tao.service.ts','Lọc chương trình và lịch sử năm');
add(3,'Tích hợp API hồ sơ và điểm','next',[person,server,['score','external','Backend điểm','API được cho phép']],[
 ['web','next','Gọi proxy backend/score'],['next','score','Endpoint hợp lệ + JWT','security'],['score','next','JSON hoặc lỗi service','return'],['next','web','JSON an toàn / mã lỗi','return']
],[ref('app/api/backend/[service]/[...path]/route.ts'),ref('libs/api-services/backend.server.ts')],['Proxy có allowlist và kiểm tra phiên; đây là đường tích hợp, không phải service điểm thứ hai ở Next.js.']);
add(3,'Tích hợp API MBTI và Chatbot','next',[person,server,['ai','external','Backend AI','API hiện có']],[
 ['web','next','Gửi câu hỏi / bài làm'],['next','ai','POST tới API AI được phép'],['ai','next','Kết quả hoặc lỗi','return'],['next','web','Hiển thị kết quả / lỗi','return']
],[ref('app/api/mbti/submit/route.ts'),ref('app/api/backend/[service]/[...path]/route.ts'),ref('libs/api-services/backend.server.ts')],['Quản trị tri thức cần quyền admin và khóa nội bộ; chat/MBTI công khai theo policy.', 'Các sửa timeout local chưa commit không được trích dẫn như nội dung HEAD.']);
add(3,'Tra cứu kết quả trúng tuyển','score',[['caller','external','Thí sinh','Phiên hợp lệ'],['api','backend','Score service','Tra cứu kết quả'],database],[
 ['caller','api','Tra cứu đúng hồ sơ','security'],['api','db','Đọc quyết định và cong_bo_at'],['db','api','Hồ sơ / không có','return'],['api','caller','Đã công bố: đỗ / trượt','return']
],[ref('src/services/ho_so_service.py'),ref('src/services/result_state.py'),ref('src/router/ho_so_router.py')],['Chưa công bố: trả chua_cong_bo, không lộ quyết định. Trường hợp chưa có hồ sơ trả lỗi tương ứng.']);
add(3,'Thông báo kết quả cho thí sinh','score',[['caller','external','Caller admin','API gửi riêng'],['api','backend','Score workflow','Xử lý outbox'],database,['smtp','external','SMTP','Email được cấu hình']],[
 ['caller','api','Yêu cầu gửi theo năm','security'],['api','db','Claim job chưa gửi'],['db','api','Job đã khóa','return'],['api','db','Commit trạng thái sending'],['api','smtp','Có email: gửi thông báo'],['smtp','api','SMTP chấp nhận / lỗi','return'],['api','db','Ghi sent / failed / thiếu email'],['db','api','Lưu trạng thái','return'],['api','caller','Số lượng xử lý và đã gửi','return']
],[ref('src/router/workflow_router.py',263),ref('src/services/adapters/email_sender.py'),ref('src/services/notification_service.py')],['SMTP thiếu cấu hình: dừng trước claim. Không có email: bỏ qua SMTP và ghi missing_email.', 'Không vẽ worker tự chạy: chưa thấy lịch chạy tự động. P08: job sending có nguy cơ kẹt khi process chết.']);

function stats(title,endpoint) {
 add(4,title,'score',[['caller','external','Next.js admin','Bộ lọc năm'],['api','backend','Score API',endpoint],service,database],[
 ['caller','api','GET số liệu với JWT','security'],['api','svc','Bộ lọc đã kiểm tra'],['svc','db','Đọc hồ sơ và danh mục'],['db','svc','Dữ liệu đúng phạm vi','return'],['svc','api','Nhóm, đếm và tỷ lệ','return'],['api','caller','JSON số liệu / lỗi','return']
 ],[ref('src/router/thong_ke_router.py'),ref('src/services/thong_ke_service.py'),ref('src/repositories/thong_ke_repository.py')],['Trúng tuyển chính thức phải dựa kết quả đã công bố; không lấy hồ sơ hợp lệ làm số đỗ.', 'P01 thuộc dashboard Next.js khác: số liệu fallback trên dashboard không được coi là dữ liệu của API này.']);
}
stats('Thống kê tổng quan hồ sơ','/thong-ke/tong-quan');
stats('Thống kê theo ngành học','/thong-ke/nganh-hoc');
stats('Thống kê theo phương thức và tổ hợp','/thong-ke/xet-tuyen');
add(4,'Báo cáo kết quả trúng tuyển','next',[person,server,['score','external','Backend điểm','API báo cáo']],[
 ['web','next','Mở báo cáo theo năm'],['next','score','GET trang 1, page_size=100','security'],['score','next','Dữ liệu + phân trang','return'],['next','score','Nếu còn trang: GET trang kế','security'],['score','next','Dữ liệu trang kế','return'],['next','web','Gom và ánh xạ báo cáo','return']
],[ref('services/backend-report.service.ts')],['Lặp các trang còn lại tuần tự; trên 10.000 dòng báo lỗi thay vì xuất thiếu. Chưa có ngày sinh/giới tính trong mapping.']);
add(4,'Xuất báo cáo CSV','next',[person,['ui','frontend','Báo cáo client','Dữ liệu đang lọc'],['file','external','Trình duyệt','Tải file CSV']],[
 ['web','ui','Nhấn xuất Excel (.csv)'],['ui','file','Tạo Blob UTF-8 và tải CSV'],['file','web','File .csv','return']
],[ref('app/admin/(dashboard)/bao-cao-trung-tuyen/BaoCaoClient.tsx',106,162)],['Đây là CSV mở được bằng Excel, không phải XLSX; dùng tập dữ liệu của màn hình.']);
add(4,'In và lưu báo cáo PDF','next',[person,['ui','frontend','Báo cáo client','Bố cục bản in'],['print','external','Trình duyệt','Hộp thoại in']],[
 ['web','ui','Nhấn In / Xuất PDF'],['ui','print','window.print()'],['print','web','Chọn máy in / lưu PDF','return']
],[ref('app/admin/(dashboard)/bao-cao-trung-tuyen/BaoCaoClient.tsx',164,168)],['Không có service tạo PDF server trong luồng này.']);

add(5,'Xử lý lỗi khi duyệt và từ chối hồ sơ','next',[person,server,['score','external','Backend điểm','Duyệt / từ chối']],[
 ['web','next','Gửi thao tác xử lý hồ sơ'],['next','score','PATCH kèm phiên admin','security'],['score','next','Thành công hoặc 4xx / 5xx','return'],['next','web','Chỉ thành công mới tải lại','return']
],[ref('app/admin/(dashboard)/ho-so/HoSoClient.tsx'),ref('libs/api-services/browser-api.ts'),ref('app/api/backend/[service]/[...path]/route.ts')],['Lỗi quyền/nghiệp vụ phải giữ UI ở trạng thái chưa xác nhận thành công. Không vẽ bước bỏ xác thực để xử lý lỗi.']);
add(5,'Tách hồ sơ hợp lệ khỏi kết quả trúng tuyển','score',[['caller','external','Thí sinh','Tra cứu'],['api','backend','Score service','Public status'],database],[
 ['caller','api','Yêu cầu trạng thái hồ sơ'],['api','db','Đọc trang_thai và cong_bo_at'],['db','api','Trạng thái đã lưu','return'],['api','caller','Hợp lệ / xử lý / kết quả công bố','return']
],[ref('src/services/result_state.py'),ref('src/services/ho_so_service.py')],['hop_le không ánh xạ thành trúng tuyển. do/truot chưa công bố được che bằng dang_xu_ly ở public_status.']);
add(5,'Lưu tin tức thật và làm mới giao diện','next',[person,server,database],[
 ['web','next','Lưu bài nháp hoặc xuất bản','security'],['next','db','Kiểm tra tài khoản quản trị'],['db','next','Danh tính tác giả','return'],['next','db','Create / update trang_noi_dung'],['db','next','Bài đã lưu','return'],['next','web','Revalidate và trả bản ghi','return']
],[ref('actions/content.action.ts',9,43)],['Đây là lưu bài cũ, không đồng nghĩa CMS mới tin_tuc đã hoàn thiện.']);
add(5,'Đồng bộ tri thức Chatbot sau cập nhật','ai',[['caller','external','Next.js admin','Thao tác tri thức'],['api','backend','AI service','Lưu rồi đồng bộ'],database,['rag','backend','RAG','Kho tri thức']],[
 ['caller','api','Cập nhật tri thức','security'],['api','db','Repository ghi nội dung'],['db','api','Ghi thành công','return'],['api','db','Đọc tri thức active'],['db','api','Tập nội dung','return'],['api','rag','Reload dữ liệu'],['rag','api','Đồng bộ / ném lỗi','return'],['api','caller','Response thao tác','return']
],[ref('src/services/chat_service.py',28,39),ref('src/services/chat_service.py',108,138),ref('src/repositories/chat_repository.py')],['P09: sync lỗi sau ghi có thể trả lỗi chung dù DB đã đổi; chưa có hợp đồng hai giai đoạn hoàn chỉnh.']);

add(6,'Chốt điểm xét tuyển từ hồ sơ','score',[['caller','external','Admin','Hồ sơ đang xử lý'],['api','backend','Workflow API','Chốt điểm'],database,['convert','backend','Quy đổi','Công thức / JSON']],[
 ['caller','api','Chọn nguồn điểm và căn cứ','security'],['api','db','Khóa hồ sơ chưa công bố'],['db','api','Bảng điểm / chứng chỉ','return'],['api','convert','Nếu cần: quy đổi điểm'],['convert','api','Điểm gốc đã quy đổi','return'],['api','db','Ghi tổng, ưu tiên và trace'],['db','api','Flush trong transaction','return'],['api','caller','Điểm đã chốt hoặc lỗi','return']
],[ref('src/router/workflow_router.py',39,136),ref('src/services/conversion_service.py'),ref('src/core/database.py')],['Manual nhận điểm đã đối soát; exempt không cộng ưu tiên. UI hiện tại chủ yếu nhập tay.', 'P03: chưa kiểm tra đủ loại/năm bảng điểm, loại/hạn chứng chỉ. Không mô tả những guard đó như đã có.']);
add(6,'Chốt quyết định trúng tuyển','score',[['caller','external','Admin','Danh sách có căn cứ'],['api','backend','Workflow API','Chốt kết quả'],database],[
 ['caller','api','POST danh sách quyết định','security'],['api','db','Khóa hồ sơ, thí sinh, quota'],['db','api','Điểm, ngưỡng và trạng thái','return'],['api','db','Ghi do / truot, người chốt'],['api','db','Đếm quota và trùng thí sinh'],['db','api','Đạt / vi phạm ràng buộc','return'],['api','caller','Commit hoặc rollback','return']
],[ref('src/router/workflow_router.py',139,209),ref('src/core/database.py')],['Chưa công bố sau khi chốt. Sai quota/trùng thí sinh làm transaction rollback.', 'P04: thiếu cutoff có thể bỏ qua khối ngưỡng; đây chưa phải engine tự xếp hạng/lọc nguyện vọng.']);
add(6,'Công bố kết quả chính thức','score',[['caller','external','Admin','Chọn mùa / chương trình'],['api','backend','HoSo service','Công bố'],database],[
 ['caller','api','Yêu cầu công bố','security'],['api','db','Đọc mốc và hồ sơ theo phạm vi'],['db','api','Lịch + danh sách','return'],['api','db','Nếu đủ căn cứ: ghi cong_bo_at'],['api','db','Tạo NotificationOutbox pending'],['db','api','Kết quả cùng transaction','return'],['api','caller','Đã công bố / lỗi điều kiện','return']
],[ref('src/services/ho_so_service.py',140,190),ref('src/models/workflow.py'),ref('src/core/database.py')],['Không đủ mốc/chưa chốt: dừng trước ghi. Lặp công bố không tạo outbox trùng.', 'P02: bộ seed local có tên mốc tra cứu không khớp nhận diện công bố; cần đối chiếu dữ liệu thật. Email chưa tự gửi ở bước này.']);
add(6,'Đối soát tra cứu thống kê và báo cáo','score',[['caller','external','Caller có quyền','Thí sinh / admin'],['api','backend','API tương ứng','Ba lượt đọc riêng'],['rule','backend','Result rule','published / result_label'],database],[
 ['caller','api','Tra cứu hoặc thống kê / báo cáo'],['api','db','Đọc cùng năm và phạm vi'],['db','api','Hồ sơ và cong_bo_at','return'],['api','rule','Phân loại kết quả đã công bố'],['rule','api','Nhãn kết quả thống nhất','return'],['api','caller','Response theo quyền caller','return']
],[ref('src/services/result_state.py'),ref('src/services/ho_so_service.py'),ref('src/services/thong_ke_service.py')],['Không phải một endpoint cấp cả thống kê cho thí sinh. Mỗi API giữ quyền riêng, dùng chung quy tắc phân loại.', 'Sơ đồ logic không chứng minh số liệu thực tế đã đối soát hoặc test xuyên luồng đã đạt.']);

add(1,'Thêm dữ liệu mẫu kiểm thử','next',[
 ['dev','external','Người chạy seed','Môi trường test riêng'],
 ['seed','backend','Seed script','tests/fixtures/seed.cjs'],
 ['db','database','PostgreSQL test','localhost / admission_test'],
],[
 ['dev','seed','Chạy seed fixture riêng'],
 ['seed','db','Đúng DB test: BEGIN'],
 ['seed','db','Upsert danh mục và tài khoản test'],
 ['seed','db','Upsert hồ sơ và dữ liệu nền'],
 ['db','seed','Thực thi / lỗi ràng buộc','return'],
 ['seed','db','COMMIT hoặc ROLLBACK'],
 ['seed','dev','Kết quả seed','return'],
],[ref('tests/fixtures/seed.cjs')],[
 'Chặn host/DB ngoài môi trường test trước khi kết nối. Đây là dữ liệu tổng hợp cho kiểm thử, không phải chính sách tuyển sinh thật.',
 'Chưa chạy script. Fixture cũ có nhãn trạng thái cần rà soát theo workflow mới; không dùng để kết luận nghiệp vụ đúng.',
 'Entry prisma/seeds.ts local chỉ seed timeline và chưa commit: không gán cho bằng chứng HEAD của sơ đồ này.',
]);

fs.mkdirSync(base,{recursive:true});
const manifest = [];
for (const d of definitions) {
  const repo = repos[d.repo];
  // Kiểm tra file/range tồn tại trong commit; không gán bytes local cho HEAD.
  const sources = d.sources.map(s=>{
    const lines = git(repo.root,'show',`${repo.revision}:${s.path}`).split(/\r?\n/);
    const end_line = s.end_line ?? Math.max(s.line,lines.length-1);
    if(s.line > lines.length || end_line > lines.length) throw Error(`Range sai: ${s.path}`);
    return {...s,end_line};
  });
  const dir = `${base}/sprint_${d.sprint}`;
  fs.mkdirSync(dir,{recursive:true});
  const output = `${dir}/${d.title}.html`;
  const candidatePath = `${dir}/${d.title}.sequence.json`;
  const candidate = {
    schema_version:1,diagram_type:'sequence',
    meta:{title:`Sprint ${d.sprint} · ${d.title}`,output,locale:'vi',quality_profile:'showcase',
      repository:{url:repo.url,revision:repo.revision,link_mode:'local-only'}},
    participants:d.participants.map(([id,type,label,sublabel])=>({id,type,label,sublabel,sources})),
    messages:d.messages.map(([from,to,label,variant='default'],i)=>({id:`message-${i+1}`,from,to,label,variant,y:170+i*58})),
    cards:[
      {dot:'cyan',title:'Phạm vi và cách đọc',items:[
        `Luồng chức năng Sprint ${d.sprint}; thời gian và độ trễ không được đo.`,
        'Mũi tên nét đứt kiểu return là phản hồi. Điều kiện hoặc nhánh thay thế được ghi trong phần lưu ý.',
        `Source neo vào ${repo.root} @ ${repo.revision.slice(0,12)}. Không phải xác nhận production.`,
      ]},
      {dot:'amber',title:'Giới hạn và phần chưa hoàn thiện',items:d.notes.length?d.notes:['Sơ đồ mô tả tương tác có trong source, không xác nhận test hoặc triển khai đã thành công.']},
      {dot:'slate',title:'Nguồn mã',items:sources.map(s=>`${repo.root}/${s.path}:${s.line}–${s.end_line}`)},
    ],
  };
  fs.writeFileSync(candidatePath,JSON.stringify(candidate,null,2)+'\n','utf8');
  manifest.push({sprint:d.sprint,title:d.title,candidate:candidatePath,output,repoRoot:repo.root});
}
fs.writeFileSync(`${base}/manifest.json`,JSON.stringify({generatedAt:new Date().toISOString(),repositories:repos,diagrams:manifest},null,2)+'\n','utf8');
const escaped = s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const sections = [1,2,3,4,5,6].map(n=>`<section><h2>Sprint ${n}</h2><ul>${manifest.filter(d=>d.sprint===n).map(d=>`<li><a href="${escaped(`sprint_${n}/${d.title}.html`)}">${escaped(d.title)}</a></li>`).join('')}</ul></section>`).join('');
fs.writeFileSync(`${base}/index.html`,`<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sequence tuyển sinh UTC — 6 sprint</title><style>body{margin:0;background:#f3f6fc;color:#142552;font:16px/1.6 system-ui}main{max-width:1150px;margin:auto;padding:40px 24px}h1{line-height:1.2}aside{padding:18px 22px;background:#fff5d9;border:1px solid #e8cb78;border-radius:14px}article{display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:20px;margin-top:28px}section{background:white;border:1px solid #d7e0ef;border-radius:16px;padding:20px}h2{margin:0 0 12px}ul{padding-left:22px;margin:0}li{margin:9px 0}a{color:#1858b6;text-underline-offset:4px}footer{margin-top:28px;color:#50617b}</style><main><h1>Sequence chức năng tuyển sinh UTC</h1><p>${manifest.length} sơ đồ · Mỗi chức năng một file · Chia theo 6 sprint</p><aside>Đây là bản mô tả luồng code, không phải kết quả kiểm thử. Trích dẫn Archify neo vào commit của từng repo; source chưa commit và các tính năng chưa nối đầy đủ được ghi chú riêng. Nội dung sơ đồ bằng tiếng Việt; một số nút công cụ Archify dùng tiếng Anh.</aside><article>${sections}</article><footer><a href="README.md">Phạm vi, nguồn và khác biệt local</a> · <a href="../review/DOI-CHIEU-6-SPRINT.md">Báo cáo đối chiếu 6 sprint</a></footer></main></html>`,'utf8');
const readme = `# Sequence chức năng theo 6 sprint\n\nMở [mục lục HTML](index.html) để chọn chức năng. Có **${manifest.length} sơ đồ**, mỗi chức năng một HTML, kèm JSON Archify để chỉnh sửa.\n\n## Phạm vi\n\n- Chỉ tạo tài liệu dưới docs/squence, không sửa app, backend AI, DB hoặc commit/push.\n- Sơ đồ các chức năng trùng sprint thể hiện góc nhìn phát triển/tích hợp/hoàn thiện của sprint tương ứng, không phải chức năng mới độc lập.\n- CRUD là một chức năng quản trị; đọc/thêm/sửa/xóa là các thao tác thay thế, không chạy tất cả theo thứ tự trong một yêu cầu.\n- API chưa có nguồn thật, thiếu UI, fallback và lỗi nghiệp vụ đã biết được ghi trong thẻ lưu ý. Không vẽ guard chưa tồn tại thành hành vi đã có.\n- Không đo latency, không chạy các API nghiệp vụ hoặc test app. Finalize của Archify chỉ kiểm tra artifact/sơ đồ trong trình duyệt.\n- Giao diện công cụ Archify có thể còn tiếng Anh vì chưa có catalog vi; nội dung tác giả bằng tiếng Việt.\n\n## Nguồn và khác biệt local\n\nArchify xác minh source ở commit, không phải bytes chưa commit. Vì vậy sơ đồ dùng core đã commit ở các revision dưới đây; không khẳng định mô tả đầy đủ mọi thay đổi chưa commit hoặc bản Render/Vercel. Backend được vẽ như hộp đen trong sơ đồ repo frontend; sơ đồ repo backend mới mô tả xử lý nội bộ.\n\n${Object.entries(repos).map(([name,r])=>`### ${name}\n\n- Repo: ${r.root}\n- Revision: ${r.revision}\n- Origin: ${r.url}\n- Source thay đổi local không được gán cho revision trên:\n\n\`\`\`text\n${r.dirty||'(không có tracked changes)'}\n\`\`\`\n`).join('\n')}\nDanh sách tracked changes không bao gồm file untracked. Đặc biệt coordinator nộp hồ sơ/ảnh và operation journal local chưa được coi là source của commit score. Các sửa UI/tính điểm/chat local sau commit cũng không tự động có trong sơ đồ. Xem [báo cáo source hiện tại](../review/DOI-CHIEU-6-SPRINT.md) để đối chiếu.\n\n## Danh mục\n\n${[1,2,3,4,5,6].map(n=>`### Sprint ${n}\n\n${manifest.filter(d=>d.sprint===n).map(d=>`- [${d.title}](<sprint_${n}/${d.title}.html>)`).join('\n')}`).join('\n\n')}\n\n## Tái tạo\n\nChạy generator từ thư mục gốc project bằng Node để sinh JSON/mục lục. Sau đó chạy Archify finalize cho mỗi candidate với repo-root tương ứng trong manifest.json. Không gọi generator sau khi muốn giữ thay đổi thủ công trong JSON. Các receipt đi kèm ghi kết quả kiểm tra thực tế; không coi việc có HTML là đã qua mọi gate.\n`;
fs.writeFileSync(`${base}/README.md`,readme,'utf8');
console.log(`Created ${manifest.length} complete candidates and overview under ${base}`);
