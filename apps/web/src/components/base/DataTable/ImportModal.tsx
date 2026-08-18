import React, { useState } from 'react';
import { Modal, Upload, message, Typography, Space } from 'antd';
import { InboxOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { DataTableColumn } from './types';
import { BaseButton } from '../BaseButton';

const { Dragger } = Upload;
const { Paragraph, Text } = Typography;

export interface ImportModalProps {
  visible: boolean;
  onCancel: () => void;
  columns?: DataTableColumn[];
  onImport?: (file: File) => void;
  onDownloadTemplate?: (selectedCols?: string[], withMockData?: boolean) => void;
  loading?: boolean;
  entityName?: string;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  visible,
  onCancel,
  onImport,
  onDownloadTemplate,
  loading = false,
  entityName = 'dữ liệu',
}) => {
  const [fileList, setFileList] = useState<any[]>([]);

  const handleUpload = () => {
    if (fileList.length === 0) {
      message.warning('Vui lòng chọn tập tin để tải lên!');
      return;
    }
    const file = fileList[0].originFileObj || fileList[0];
    if (onImport) {
      onImport(file);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      title={
        <Space>
          <UploadOutlined style={{ color: '#ed1c24' }} />
          <span style={{ fontWeight: 700, fontSize: 16 }}>Nhập Dữ Liệu Excel / CSV ({entityName})</span>
        </Space>
      }
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <BaseButton variant="ghost" size="small" onClick={onCancel}>
            Hủy bỏ
          </BaseButton>
          <BaseButton
            variant="brand"
            size="small"
            onClick={handleUpload}
            loading={loading}
            icon={<UploadOutlined />}
            disabled={fileList.length === 0}
            glow
          >
            Tiến hành Import
          </BaseButton>
        </div>
      }
      width={560}
      centered
      destroyOnClose
    >
      <div style={{ padding: '12px 0' }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary">Tải tệp mẫu chuẩn định dạng để điền dữ liệu:</Text>
          {onDownloadTemplate && (
            <BaseButton
              variant="secondary"
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => onDownloadTemplate()}
            >
              Tải tệp mẫu (.xlsx)
            </BaseButton>
          )}
        </div>

        <Dragger
          multiple={false}
          fileList={fileList}
          beforeUpload={(file) => {
            setFileList([file]);
            return false;
          }}
          onRemove={() => setFileList([])}
          accept=".xlsx,.xls,.csv"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ color: '#ed1c24', fontSize: 44 }} />
          </p>
          <p className="ant-upload-text" style={{ fontWeight: 600 }}>
            Kéo thả tập tin vào đây hoặc bấm để chọn tệp
          </p>
          <Paragraph type="secondary" style={{ fontSize: 12, margin: 0 }}>
            Hỗ trợ định dạng: .xlsx, .xls, .csv (Tối đa 10MB)
          </Paragraph>
        </Dragger>
      </div>
    </Modal>
  );
};

export default ImportModal;
