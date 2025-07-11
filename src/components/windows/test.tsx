import { useState } from 'react';
import MenuItem from '../shared/menu-item';
import Screen from '../shared/screen';
import { toast, type ExternalToast } from 'sonner';

export default function TestScreen() {
  const [loading, setLoading] = useState(false);

  const displayToast = (
    type: 'warning' | 'success' | 'error',
    msg: string,
    data?: ExternalToast
  ) => {
    return () => {
      toast[type](msg, data);
    };
  };

  return (
    <Screen loading={loading}>
      <MenuItem onClick={() => setLoading(true)} icon={false}>
        Loading
      </MenuItem>
      <MenuItem icon={false}>Toast</MenuItem>
      <MenuItem
        icon={false}
        onClick={displayToast('success', 'This is a sucess')}>
        Success Toast
      </MenuItem>
      <MenuItem
        icon={false}
        onClick={displayToast('warning', 'This is a warning')}>
        Warning Toast
      </MenuItem>
      <MenuItem
        icon={false}
        onClick={displayToast('error', 'This is an error')}>
        Error Toast
      </MenuItem>
    </Screen>
  );
}
