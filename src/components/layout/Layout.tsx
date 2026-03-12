import { Suspense, useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { Outlet } from 'react-router-dom';
import { Header, BottomNav, LayoutLoadingSpinner, QuickMemoDrawer, ModalContainer } from '..';
import { useInitialScrollToTop } from '../../hooks';

const layoutCss = {
	wrapper: css`
		max-width: var(--max-app-width);
		min-width: var(--min-app-width);
		margin: 0 auto;
		background-color: var(--white);
		overflow: hidden;
	`,
	main: css`
		position: relative;
		min-height: calc(100dvh - 2 * var(--nav-height) - 16px);
		margin: var(--nav-height) 0 calc(var(--nav-height) + 16px);
		padding: var(--padding-container-mobile);
		background-color: var(--white);

		@media screen and (min-width: 640px) {
			min-height: calc(100dvh - 2 * var(--nav-height));
			margin: var(--nav-height) 0;
		}
	`,
};

const Layout = () => {
	const layoutRef = useRef<HTMLDivElement>(null);
	const [, setGlobalWidth] = useState<string>('');

	useInitialScrollToTop();

	useEffect(() => {
		if (layoutRef.current) {
			setGlobalWidth(`${layoutRef.current.clientWidth}px`);
		}
	}, [setGlobalWidth]);

	return (
		<Suspense fallback={<LayoutLoadingSpinner />}>
			<div id="layout-container" ref={layoutRef} css={layoutCss.wrapper}>
				<Header />
				<main id="layout-contents" css={layoutCss.main}>
					<Outlet />
				</main>
				<BottomNav />
				<QuickMemoDrawer />
			</div>
			<ModalContainer />
		</Suspense>
	);
};

export default Layout;
