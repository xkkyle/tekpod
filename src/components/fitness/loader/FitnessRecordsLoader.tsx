import { SkeletonLoader } from '../../common';

const FitnessRecordsLoader = () => {
	return (
		<>
			<div
				css={{
					display: 'grid',
					gridTemplateColumns: 'repeat(4, 1fr)',
					gridAutoRows: '1fr',
					gap: '8px',
					margin: '32px auto 16px',
				}}>
				{Array.from({ length: 30 }, (_, idx) => (
					<SkeletonLoader key={idx} width={'100%'} height={'80px'} />
				))}
			</div>
			<div
				css={{
					display: 'flex',
					flexDirection: 'column',
					gap: '8px',
					marginBottom: '16px',
				}}>
				<SkeletonLoader width={'100%'} height={'58px'} />
				<SkeletonLoader width={'100%'} height={'58px'} />
			</div>
		</>
	);
};

export default FitnessRecordsLoader;
