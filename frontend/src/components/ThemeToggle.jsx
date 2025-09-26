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
			className="inline-flex items-center justify-center rounded-full bg-transparent p-2 text-gray-700 dark:text-gray-100 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
		>
			{isDark ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />}
		</button>
	);
};

export default ThemeToggle;


