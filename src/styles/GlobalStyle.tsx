import { css } from '@emotion/react';

const Global = css`
	:root {
		font-weight: 400;
		font-synthesis: none;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		-webkit-text-size-adjust: 100%;
		text-size-adjust: 100%;

		/*colors*/
		--white: #fff;
		--whiteOpacity: rgba(255, 255, 255, 0.4);
		--black: #000;

		--grey50: #f9fafb;
		--grey100: #f2f4f6;
		--grey200: #e5e8eb;
		--grey300: #d1d6db;
		--grey400: #b0b8c1;
		--grey500: #8b95a1;
		--grey600: #6b7684;
		--grey700: #4e5968;
		--grey800: #333d4b;
		--grey900: #191f28;
		--greyOpacity50: rgba(0, 23, 51, 0.02);
		--greyOpacity100: rgba(2, 32, 71, 0.05);
		--greyOpacity200: rgba(0, 27, 55, 0.1);
		--greyOpacity300: rgba(0, 29, 58, 0.18);
		--greyOpacity400: rgba(0, 25, 54, 0.31);
		--greyOpacity500: rgba(3, 24, 50, 0.46);
		--greyOpacity600: rgba(0, 19, 43, 0.58);
		--greyOpacity700: rgba(3, 18, 40, 0.7);
		--greyOpacity800: rgba(0, 12, 30, 0.8);
		--greyOpacity900: rgba(2, 9, 19, 0.91);

		--background: #fff;
		--greyBackground: #f2f4f6;
		--overlayBackground: rgba(0, 0, 0, 0.3);

		--orange100: #fffbe5;
		--orange200: #fff7cc;
		--orange300: #fff0a6;
		--orange400: #ffea80;
		--orange500: #ffe359;
		--orange600: #ffdd33;
		--orange700: #ffd400;
		--orange800: #ffc100;
		--orange900: #ffb320;

		--blue100: #eff8ff;
		--blue200: #1c9eff;
		--blue300: #b1dcfd;
		--blue400: #7fc7ff;
		--gradient-blue50: linear-gradient(270deg, #d0e8fd 0%, #a8cbff 40%, #a1c3fd 100%);
		--gradient-blue100: linear-gradient(135deg, #a1c4fd 0%, #6fa8ff 40%, #3f5efb 100%);
		--gradient-blue200: linear-gradient(145deg, #667eea 0%, #4facfe 100%);

		--green100: #f1fcf8;
		--green200: #00c82c;

		--red100: #faedef;
		--red200: #ef2a2b;

		/* radius */
		--radius-xs: 6px;
		--radius-s: 8px;
		--radius-m: 12px;
		--radius-l: 16px;
		--radius-xl: 24px;
		--radius-2xl: 32px;
		--radius-3xl: 64px;
		--radius-extra: 9999px;

		/* padding */
		--padding-container-desktop: 32px;
		--padding-container-mobile: 16px;

		--padding-base-vertical: 12px;
		--padding-base-horizontal: 16px;
		--padding-s-vertical: 4px;
		--padding-s-horizontal: 8px;
		--padding-m-vertical: 8px;
		--padding-m-horizontal: 12px;
		--padding-l-vertical: 12px;
		--padding-l-horizontal: 20px;
		--padding-xl-vertical: 16px;
		--padding-xl-horizontal: 24px;
		--padding-2xl-vertical: 18px;
		--padding-2xl-horizontal: 32px;

		/* font */
		--line-height-base: 1.5;
		--fz-2xl: 96px;
		--fz-xl: 72px;
		--fz-h1: 56px;
		--fz-h2: 48px;
		--fz-h3: 36px;
		--fz-h4: 32px;
		--fz-h5: 24px;
		--fz-h6: 20px;
		--fz-h7: 17px;
		--fz-p: 15px;
		--fz-sm: 13px;
		--fz-xs: 11px;

		--fw-regular: 400;
		--fw-medium: 500;
		--fw-semibold: 600;
		--fw-bold: 700;
		--fw-black: 900;

		--max-app-width: 480px;
		--min-app-width: 320px;

		--nav-height: 50px;
		--transition-duration: 0.2;

		/* z-index */
		--nav-index: 50;
		--overlay-index: 100;
		--drawer-index: 999;
		--modal-index: 1000;
		--toast-index: 1010;
		--hovered-info-index: 998;
		--floating-action-button-index: 997;
	}

	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		border: 0;
		vertical-align: baseline;
		font-family:
			'Pretendard Variable',
			Pretendard,
			-apple-system,
			BlinkMacSystemFont,
			system-ui,
			Roboto,
			'Helvetica Neue',
			'Mona-Sans',
			'Segoe UI',
			'Apple SD Gothic Neo',
			'Noto Sans KR',
			'Malgun Gothic',
			'Apple Color Emoji',
			'Segoe UI Emoji',
			'Segoe UI Symbol',
			sans-serif;

		word-break: keep-all;
		-webkit-tap-highlight-color: rgba(255, 255, 255, 0);
	}

	html {
		width: 100%;
		height: 100%;
	}

	body {
		width: 100%;
		height: 100%;
		line-height: var(--line-height-base);
		font-size: var(--fz-p);
		background-color: var(--greyOpacity50);
	}

	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		margin: 0;
		font-size: var(--fz-p);
		font-weight: normal;
	}

	ul,
	ol,
	li {
		padding-left: 0;
		list-style-type: none;
	}

	a {
		-webkit-touch-callout: none;
		text-decoration: none;
		color: inherit;
	}

	a,
	button {
		cursor: pointer;
	}

	button,
	input,
	select,
	textarea {
		font-size: var(--fz-p);
		background-color: transparent;
		border: 0;

		&:focus {
			outline: none;
			box-shadow: none;
		}
	}

	select {
		appearance: none;
		-moz-appearance: none;
		-webkit-appearance: none;
	}

	input[type='text'],
	input[type='number'],
	input[type='email'],
	input[type='tel'],
	input[type='password'],
	textarea {
		border-radius: 0;
		-webkit-text-size-adjust: 100%; /* iOS에서 텍스트 크기 자동 조정 방지 */
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0); /* 탭 시 하이라이트 효과 제거 */
	}

	div:focus-visible,
	li:focus-visible,
	span:focus-visible,
	button:focus-visible,
	a:focus-visible {
		outline: 2px solid var(--blue200);
		outline-offset: 1px;
		border-radius: var(--radius-s);
	}

	::-moz-selection {
		background: var(--blue100);
	}

	::selection {
		background: var(--blue100);
	}

	.rdp-root {
		margin-top: 8px;
		background: none;
		z-index: var(--modal-index);
		--rdp-accent-color: var(--grey600); /* Change the accent color to indigo. */
		--rdp-accent-background-color: var(--blue300); /* Change the accent background color. */
		--rdp-today-color: var(--blue200);
		--rdp-selected-border: 1px solid var(--blue200);

		@media screen and (min-width: 480px) {
			--rdp-day-width: calc((var(--max-app-width)- 4 * var(--padding-container-mobile)) / 7);
			--rdp-day-height: calc((var(--max-app-width)- 4 * var(--padding-container-mobile)) / 7);
			--rdp-day_button-width: calc((var(--max-app-width) - 4 * var(--padding-container-mobile)) / 7);
			--rdp-day_button-height: calc((var(--max-app-width) - 4 * var(--padding-container-mobile)) / 7);
		}
	}

	.rdp-months {
		padding: 8px 16px;
		min-width: var(--min-app-width);
		max-width: var(--max-app-width);
		background-color: var(--white);
		border: 1px solid var(--grey100);
		border-radius: var(--radius-m);
	}
`;

export default Global;
