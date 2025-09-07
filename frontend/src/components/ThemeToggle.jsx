import React from 'react';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useTheme } from '../context/ThemeContext.jsx';

const ThemeToggle = () => {
	const { theme, toggleTheme } = useTheme();
	const isDark = theme === 'dark';
	return (
		<button
			onClick={toggleTheme}
			aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
			className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-800 dark:hover:bg-gray-800"
		>
			{isDark ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />}
			<span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
		</button>
	);
};

export default ThemeToggle;


