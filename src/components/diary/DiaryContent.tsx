import styled from '@emotion/styled';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getDiariesByPage, DIARY_PAGE_SIZE, type Diary } from '../../supabase';
import { EmptyMessage, LoadingSpinner } from '..';
import { useInfiniteScroll } from '../../hooks';
import { routes, staleTime, queryKey } from '../../constants';

const DiaryContent = () => {
	const { data, hasNextPage, fetchNextPage } = useSuspenseInfiniteQuery({
		queryKey: queryKey.DIARY_BY_PAGE,
		queryFn: ({ pageParam }) => getDiariesByPage(pageParam, DIARY_PAGE_SIZE),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const isLastPage = lastPage.length < DIARY_PAGE_SIZE;
			return isLastPage ? undefined : allPages.length + 1;
		},
		staleTime: staleTime.DIARY.ALL_WITH_PAGINATION,
	});

	const targetRef = useInfiniteScroll(fetchNextPage);

	return (
		<>
			<Diaries>
				{data?.pages.flat().map(({ id, title, content, feeling, tags }) => (
					<Diary key={id}>
						<DiaryLink to={`${routes.DIARY}/${id}`}>
							<DiaryTitle>{title}</DiaryTitle>
							<div>
								{content
									.split('-')
									.filter(item => item !== '')
									.map((item, idx) => (
										<div key={`${item}_${idx}`}>- {item}</div>
									))}
							</div>
							<Feeling>⚡️ {feeling}</Feeling>
							<Tags>
								{tags?.map(tag => (
									<div key={tag}>
										<span>#</span>
										<span>{tag}</span>
									</div>
								))}
							</Tags>
						</DiaryLink>
					</Diary>
				))}
				{data?.pages.flat().length === 0 && <EmptyMessage emoji={'📝'}>{'ADD DIARY PLEASE'}</EmptyMessage>}
			</Diaries>
			{hasNextPage && (
				<LoadingArea ref={targetRef}>
					<LoadingSpinner />
				</LoadingArea>
			)}
		</>
	);
};

const Diaries = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-top: 24px;
`;

const Diary = styled.li`
	padding: var(--padding-container-mobile) calc(var(--padding-container-mobile));
	border-bottom: 1px solid var(--greyOpacity100);
	border: 1px solid var(--greyOpacity100);
	border-radius: var(--radius-s);
`;

const DiaryLink = styled(Link)`
	width: 100%;
	height: 100%;
`;

const DiaryTitle = styled.h3`
	font-size: var(--fz-h5);
	font-weight: var(--fw-semibold);
`;

const Feeling = styled.p`
	margin-top: 8px;
	margin-left: auto;
	padding: calc(var(--padding-container-mobile) / 4) calc(var(--padding-container-mobile) / 2);
	font-size: var(--fz-sm);
	font-weight: var(--fw-medium);
	background-color: var(--blue100);
	border-radius: var(--radius-xs);
	border: 1px solid var(--greyOpacity200);
`;

const Tags = styled.div`
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
	gap: 8px;
	margin-top: 12px;
	width: 100%;
	overflow-x: scroll;
	white-space: nowrap;
	scrollbar-width: none; // Firefox
	-webkit-overflow-scrolling: touch; // support ios scroll
	-ms-overflow-style: none; // IE and Edge

	&::-webkit-scrollbar {
		display: none; // hidden scrollbar
	}

	div {
		display: inline-flex;
		gap: 4px;
		padding: calc(var(--padding-container-mobile) / 5) calc(var(--padding-container-mobile) / 2);
		font-size: var(--fz-sm);
		border: 1px solid var(--greyOpacity100);
		border-radius: var(--radius-xs);
		color: var(--grey700);
		background-color: var(--greyOpacity50);
	}
`;

const LoadingArea = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: calc(var(--padding-container-mobile) * 2);
`;

export default DiaryContent;
