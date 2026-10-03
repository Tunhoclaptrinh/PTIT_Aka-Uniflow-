# @uniflow/mcp-connectors — Production Model Context Protocol (MCP) Server

Máy chủ **Model Context Protocol (MCP)** chuẩn công nghiệp của UniFlow AI, cung cấp công cụ tương tác trực tiếp, tra cứu đặc tả và chẩn đoán đồng bộ đa kênh (Omnichannel) cho các AI Agent (Claude Desktop, Cursor, Antigravity, và UniFlow Copilot).

---

## 🌟 Tính Năng Cốt Lõi

1. **MCP Tools (Công Cụ Thao Tác Trực Tiếp)**:
   * `uniflow_normalize_to_udm`: Chuẩn hóa dữ liệu thô từ sàn (Shopee, TikTok, Nhanh, Sapo) sang Universal Data Model.
   * `sapo_create_order`: Đẩy đơn hàng sang Sapo POS & trừ tồn kho tự động.
   * `nhanh_add_order`: Tạo đơn hàng trên hệ thống Nhanh.vn v3.
   * `pancake_create_order`: Tạo đơn trên Pancake POS và lấy mã bưu tá GHN.
   * `misa_create_invoice`: Lập hóa đơn điện tử nháp trên MISA meInvoice.
   * `telegram_send_alert`: Phát tin nhắn cảnh báo hoặc đối soát đơn qua Telegram Bot.

2. **MCP Resources (Tài Nguyên Hợp Đồng Schema 100%)**:
   * `uniflow://spec/sapo` — Toàn bộ đặc tả OpenAPI 3.1 Sapo (lồng 4 tầng).
   * `uniflow://spec/nhanh_vn` — Đặc tả API Nhanh.vn v3.
   * `uniflow://spec/pancake` — Đặc tả Pancake POS & Social.
   * `uniflow://spec/misa_meinvoice` — Đặc tả MISA meInvoice.
   * `uniflow://spec/misa_amis_crm` — Đặc tả MISA CRM.
   * `uniflow://constants/nhanh` — 17 trạng thái đơn, 10 hãng tàu, 24 lý do hủy Nhanh.vn.
   * `uniflow://errors/misa-meinvoice` — 43 mã lỗi hóa đơn điện tử chính thức MISA.

3. **MCP Prompts (Kịch Bản Chẩn Đoán & Tự Động Hóa)**:
   * `diagnose_sync_error`: Chẩn đoán nguyên nhân gốc rễ và tự động sửa lỗi payload.
   * `generate_connector_adapter`: Tự sinh mã nguồn TypeScript Adapter chuẩn hóa UDM cho kênh kết nối mới.

---

## 🚀 Hướng Dẫn Cấu Hình Kết Nối

### 1. Kết nối với Claude Desktop (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "uniflow-connectors": {
      "command": "node",
      "args": [
        "g:/UniFlow-PTIT_Aka/packages/mcp-connectors/dist/index.js"
      ]
    }
  }
}
```

### 2. Kết nối với Cursor / Antigravity IDE
Thêm vào cấu hình MCP Server:
* **Transport**: `stdio`
* **Command**: `node`
* **Args**: `g:/UniFlow-PTIT_Aka/packages/mcp-connectors/dist/index.js`
