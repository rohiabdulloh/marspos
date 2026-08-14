import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export default function AppThemeSwitcher() {
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('marspos-theme') as Theme | null;

        const initialTheme =
            savedTheme ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light');

        setTheme(initialTheme);

        document.documentElement.classList.toggle(
            'dark',
            initialTheme === 'dark',
        );
    }, []);

    const toggleTheme = () => {
        const nextTheme: Theme =
            theme === 'light' ? 'dark' : 'light';

        setTheme(nextTheme);

        localStorage.setItem('marspos-theme', nextTheme);

        document.documentElement.classList.toggle(
            'dark',
            nextTheme === 'dark',
        );
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="
                tm-focus
                size-[34px]
                items-center justify-center
                rounded-[9px]
                border border-[var(--border)]
                bg-[var(--surface)]
                text-[var(--text-soft)]
                transition
                hover:bg-[var(--bg)]
                hover:text-[var(--text)]
                hidden
                sm:flex
            "
            title={
                theme === 'light'
                    ? 'Aktifkan dark mode'
                    : 'Aktifkan light mode'
            }
            aria-label={
                theme === 'light'
                    ? 'Aktifkan dark mode'
                    : 'Aktifkan light mode'
            }
        >
            {theme === 'light' ? (
                <Moon size={16} />
            ) : (
                <Sun size={16} />
            )}
        </button>
    );
}