export default function AuthGlobalStyle() {
    return (
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

            .tm-root {
                --primary: #2F6B3C;
                --primary-dark: #1B4229;
                --primary-soft: #E6EFE7;

                --accent: #C98A1E;
                --accent-soft: #FBF0DC;

                --bg: #F6F7F3;
                --surface: #FFFFFF;

                --border: #E3E7DE;
                --border-soft: #EEF1EA;

                --text: #1F2A22;
                --text-soft: #5B6B5E;
                --text-faint: #8A978C;

                --success: #2F8F53;
                --success-soft: #E7F5EC;

                --warning: #C98A1E;
                --warning-soft: #FBF0DC;

                --danger: #C0392B;
                --danger-soft: #FBEAE8;

                --info: #2F6FA6;
                --info-soft: #E9F1F8;

                font-family: 'Inter', ui-sans-serif, sans-serif;
                color: var(--text);
                background: var(--bg);
                min-height: 100vh;

                -webkit-font-smoothing: antialiased;
            }

            .tm-root * {
                box-sizing: border-box;
            }

            .tm-display {
                font-family: 'Space Grotesk', ui-sans-serif, sans-serif;
            }

            .tm-mono {
                font-family: 'IBM Plex Mono', ui-monospace, monospace;
                font-variant-numeric: tabular-nums;
            }

            .tm-root button {
                font-family: inherit;
                cursor: pointer;
            }

            .tm-root input,
            .tm-root select {
                font-family: inherit;
            }

            .tm-focus:focus-visible {
                outline: 2px solid var(--primary);
                outline-offset: 2px;
            }

            @keyframes tm-fade {
                from {
                    opacity: 0;
                    transform: translateY(6px);
                }

                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .tm-anim {
                animation: tm-fade .22s ease-out;
            }

            @keyframes tm-shake {
                10%, 90% {
                    transform: translateX(-1px);
                }

                20%, 80% {
                    transform: translateX(2px);
                }

                30%, 50%, 70% {
                    transform: translateX(-4px);
                }

                40%, 60% {
                    transform: translateX(4px);
                }
            }

            .tm-shake {
                animation: tm-shake .4s ease;
            }

            @keyframes tm-spin {
                to {
                    transform: rotate(360deg);
                }
            }

            .tm-spin {
                animation: tm-spin .8s linear infinite;
            }

            @keyframes tm-pulse {
                0%, 100% {
                    opacity: 1;
                }

                50% {
                    opacity: .5;
                }
            }

            .tm-pulse {
                animation: tm-pulse 1.6s ease-in-out infinite;
            }

            @media (prefers-reduced-motion: reduce) {
                .tm-anim,
                .tm-shake,
                .tm-spin,
                .tm-pulse {
                    animation: none;
                }
            }

            .tm-leafbg {
                background-image:
                    radial-gradient(
                        rgba(255,255,255,0.07) 1.5px,
                        transparent 1.5px
                    );

                background-size: 22px 22px;
            }
        `}</style>
    );
}