# 🧰 TreoRackit (Vanilla JS Edition)

**TreoRackit** là một ứng dụng web đơn giản giúp người dùng thiết kế giá treo quần áo bằng ống sắt thông qua giao diện kéo-thả. Người dùng có thể chọn các khối như ống, co, T, chân đế; đặt lên canvas để mô phỏng thiết kế và tự động tính toán vật liệu cần dùng.

---

## 🔧 Tech Stack

- **HTML + CSS + Vanilla JavaScript**
- **Bootstrap 5** – giao diện nhanh, responsive
- **HTML5 Drag-and-Drop API** – xử lý kéo-thả khối
- **FileSaver.js** *(tùy chọn)* – để xuất file

---

## ✅ Features (MVP)

### 🎨 Thiết kế kéo-thả

- Kéo các khối từ thanh công cụ vào canvas:
  - `PipeSegment` – có thể nhập độ dài
  - `ElbowJoint` – co 90 độ
  - `TeeJoint` – khớp T
  - `WallMount` – chân đế gắn tường
- Tương tác:
  - Chọn để chỉnh sửa
  - Xoay khối
  - Xoá khối

### 📋 Sidebar công cụ

- Danh sách các khối
- Kéo khối từ thanh công cụ vào khu vực thiết kế

### 🧮 Tính toán vật liệu (BOM)

- Tự động đếm số lượng từng loại khối
- Gom nhóm ống theo độ dài (cm)
- Cập nhật bảng vật liệu theo thời gian thực

### 📤 Xuất thiết kế (sau MVP)

- Xuất ảnh PNG từ canvas (sử dụng `html2canvas`)
- Xuất file PDF đơn giản (dùng `jsPDF` nếu cần)
