import { useTheme as useNextTheme } from 'next-themes';
import { useTheme } from '@nextui-org/react';
import { MdNightlight, MdLightMode } from 'react-icons/md';

export default function DarkModeSwitch() {
  const { setTheme } = useNextTheme();
  const { isDark, type } = useTheme();
  return (
    <div>
      {isDark ? (
        <MdLightMode
          size={20}
          onClick={() => {
            setTheme('light');
          }}
        />
      ) : (
        <MdNightlight
          size={20}
          onClick={() => {
            setTheme('dark');
          }}
        />
      )}
    </div>
  );
}
