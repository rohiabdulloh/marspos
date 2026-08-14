export default function AppGlobalStyle() {
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

                --topbar-bg: rgba(246,247,243,0.9);

                font-family: 'Inter', ui-sans-serif, sans-serif;

                color: var(--text);
                background: var(--bg);

                -webkit-font-smoothing: antialiased;

                transition:
                    background-color .2s ease,
                    color .2s ease;
            }

            /*
            |--------------------------------------------------------------------------
            | DARK MODE
            |--------------------------------------------------------------------------
            */

            html.dark .tm-root {
                --primary: #63A875;
                --primary-dark: #102619;
                --primary-soft: #1C3524;

                --accent: #D9A441;
                --accent-soft: #3A2E18;

                --bg: #111711;
                --surface: #182019;

                --border: #2B352C;
                --border-soft: #222B23;

                --text: #E8EEE8;
                --text-soft: #A9B5AA;
                --text-faint: #748176;

                --success: #55B875;
                --success-soft: #193622;

                --warning: #D9A441;
                --warning-soft: #3A2E18;

                --danger: #E06A5F;
                --danger-soft: #3A201D;

                --info: #69A4D3;
                --info-soft: #1B2E3D;

                --topbar-bg: rgba(17,22,18,0.9);
            }

            .tm-root * {
                box-sizing: border-box;
            }

            .tm-display {
                font-family:
                    'Space Grotesk',
                    ui-sans-serif,
                    sans-serif;
            }

            .tm-mono {
                font-family:
                    'IBM Plex Mono',
                    ui-monospace,
                    monospace;

                font-variant-numeric: tabular-nums;
            }

            .tm-scroll::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }

            .tm-scroll::-webkit-scrollbar-thumb {
                background: #D7DCD1;
                border-radius: 8px;
            }

            html.dark .tm-scroll::-webkit-scrollbar-thumb {
                background: #354036;
            }

            .tm-scroll::-webkit-scrollbar-track {
                background: transparent;
            }

            button {
                font-family: inherit;
                cursor: pointer;
            }

            input,
            select,
            textarea {
                font-family: inherit;
            }

            .tm-focus:focus-visible {
                outline: 2px solid var(--primary);
                outline-offset: 2px;
            }

            @keyframes tm-fade {
                from {
                    opacity: 0;
                    transform: translateY(4px);
                }

                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .tm-anim {
                animation: tm-fade .18s ease-out;
            }

            @keyframes tm-pulse {
                0%,
                100% {
                    opacity: 1;
                }

                50% {
                    opacity: .55;
                }
            }

            .tm-skel {
                animation: tm-pulse 1.4s ease-in-out infinite;
                background: #E9ECE5;
                border-radius: 8px;
            }

            html.dark .tm-skel {
                background: #29332B;
            }

            @media (prefers-reduced-motion: reduce) {
                .tm-anim,
                .tm-skel {
                    animation: none;
                }

                .tm-root {
                    transition: none;
                }
            }
        `}</style>
    );
}