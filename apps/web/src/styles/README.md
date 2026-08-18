# 🎨 `src/styles/` — HỆ THỐNG STYLES & DESIGN TOKENS (ANT DESIGN + LESS)

Thư mục quản lý toàn bộ định nghĩa giao diện, hệ màu nhận diện thương hiệu PTIT_Aka và cấu hình Theme của Ant Design.

---

## 🎨 **Hệ màu chủ đạo**
* **`@primary-aka-red: #ed1c24`:** Màu đỏ nhiệt huyết PTIT_Aka.
* **`@secondary-solar-gold: #fcc20f`:** Màu vàng Solar Gold.
* **`@brand-gradient:`** Dải màu chuyển tiếp `linear-gradient(135deg, #ed1c24 0%, #fcc20f 100%)`.

---

## 📂 **Cấu trúc tệp**
```
src/styles/
├── variables.less     # Biến Less toàn cục (@primary-aka-red, @secondary-solar-gold, Dark tokens, mixins)
├── theme.ts           # Ant Design ThemeConfig (darkThemeConfig & lightThemeConfig cho ConfigProvider)
├── global.less        # Reset CSS, Scrollbar, Pulse Animation, Brand Gradient Utility classes
└── README.md          # Tài liệu hướng dẫn (File này)
```
