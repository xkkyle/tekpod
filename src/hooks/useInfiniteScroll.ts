import { useEffect, useRef } from 'react';

const useInfiniteScroll = (callback: () => void) => {
	const targetRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting) {
				callback();
			}
		});

		if (targetRef.current) {
			observer.observe(targetRef.current);
		}

		return () => {
			observer.disconnect();
		};
	}, []);

	return targetRef;
};

export default useInfiniteScroll;
