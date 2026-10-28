# adminssion_UTC_PTTK

Tài liệu phân tích và thiết kế ứng dụng tư vấn tuyển sinh UTC.

## Sơ đồ sequence

- [Hướng dẫn và phạm vi sơ đồ](docs/squence/README.md)
- [Mục lục HTML](docs/squence/index.html)

## Xuất bản bằng GitHub Pages

Trong repository, mở **Settings → Pages**:

1. **Source:** Deploy from a branch.
2. **Branch:** `main`, thư mục `/(root)`.
3. Bấm **Save** và chờ deployment hoàn tất.

Địa chỉ dự kiến: https://thinhit137.github.io/adminssion_UTC_PTTK/

`index.html` ở thư mục gốc chuyển tới mục lục `docs/squence/index.html`. Các liên kết dùng đường dẫn tương đối để hoạt động dưới tên repository. `.nojekyll` giúp xuất bản nguyên trạng các file HTML/JSON.

Có thể xem offline bằng cách mở `index.html` hoặc `docs/squence/index.html` trong trình duyệt. Không cần Node.js, cài thư viện hay build.
