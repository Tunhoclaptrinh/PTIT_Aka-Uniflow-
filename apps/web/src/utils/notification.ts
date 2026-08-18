import { message, notification } from 'antd';

export const notify = {
  success: (content: string, duration = 3) => {
    message.success({ content, duration });
  },
  error: (content: string, duration = 4) => {
    message.error({ content, duration });
  },
  warning: (content: string, duration = 3) => {
    message.warning({ content, duration });
  },
  info: (content: string, duration = 3) => {
    message.info({ content, duration });
  },
  loading: (content: string, key?: string) => {
    message.loading({ content, key });
  },
  openAlert: (title: string, description: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    notification[type]({
      message: title,
      description,
      placement: 'topRight',
    });
  },
};
