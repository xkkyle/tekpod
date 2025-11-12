import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Button, Select, ShrinkMotionBlock } from '../components';
import { useToastStore } from '../store';
import { toastData } from '../constants';

const SIXTY = 60;
const ONE_SECOND = 1000;

const PomodoroTimer = () => {
	const initialMinute = 25;
	const [countdownTime, setCountdownTime] = useState(initialMinute * SIXTY); // 60초
	const [isCountdownRunning, setIsCountdownRunning] = useState(false);
	const [inputMinutes, setInputMinutes] = useState(initialMinute);

	const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const wakeLockRef = useRef<WakeLockSentinel | null>(null);
	const { addToast } = useToastStore();

	// prevent auto-lock in IOS
	useEffect(() => {
		async function requestWakeLock() {
			try {
				if ('wakeLock' in navigator) {
					wakeLockRef.current = await navigator.wakeLock.request('screen');
				}
			} catch (err) {
				// Wake Lock 요청 실패 (권한 거부 등)
			}
		}
		if (isCountdownRunning) {
			requestWakeLock();
		} else {
			if (wakeLockRef.current) {
				wakeLockRef.current.release();
				wakeLockRef.current = null;
			}
		}
		return () => {
			if (wakeLockRef.current) {
				wakeLockRef.current.release();
				wakeLockRef.current = null;
			}
		};
	}, [isCountdownRunning]);

	useEffect(() => {
		if (isCountdownRunning && countdownTime > 0) {
			countdownIntervalRef.current = setInterval(() => {
				setCountdownTime(prevTime => {
					if (prevTime <= 1) {
						return 0;
					}

					return prevTime - 1;
				});
			}, ONE_SECOND);
		} else {
			clearInterval(countdownIntervalRef.current!);
		}

		return () => clearInterval(countdownIntervalRef.current!);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isCountdownRunning, countdownTime]);

	useEffect(() => {
		if (countdownTime === 0 && isCountdownRunning) {
			setIsCountdownRunning(false);
			addToast(toastData.POMODORO_TIMER.CUSTOM('info', `It's ${formatCountdownTime(countdownTime)}. All Done.`));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [countdownTime, isCountdownRunning]);

	const formatCountdownTime = (seconds: number) => {
		const mins = Math.floor(seconds / SIXTY);
		const secs = seconds % SIXTY;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	const startCountdown = () => {
		if (countdownTime > 0) {
			setIsCountdownRunning(true);
		}
	};

	const pauseCountdown = () => {
		setIsCountdownRunning(false);
	};

	const resetCountdown = () => {
		setIsCountdownRunning(false);
		setCountdownTime(inputMinutes * SIXTY);
	};

	const setCountdownTimer = (inputMinutes: number) => {
		setCountdownTime(inputMinutes * SIXTY);
	};

	return (
		<Container>
			<MinuteAndSecondDisplay countdownTime={countdownTime} inputMinutes={inputMinutes}>
				{formatCountdownTime(countdownTime)}
			</MinuteAndSecondDisplay>
			<SetInputAndButton>
				<Select
					data={Array.from({ length: 60 }, (_, idx) => `${idx + 1} min`)}
					placeholder={'Select Minute'}
					descriptionLabel={'Minute'}
					currentValue={`${inputMinutes} min`}
					onSelect={option => {
						const _option = option.split('min')[0];
						setInputMinutes(+_option);
						setCountdownTimer(+_option);
					}}
				/>
			</SetInputAndButton>
			<ButtonGroup>
				{!isCountdownRunning ? (
					<StartButton type="button" onClick={startCountdown} disabled={isCountdownRunning || countdownTime === 0}>
						{countdownTime !== inputMinutes * SIXTY ? 'Resume' : 'Start'}
					</StartButton>
				) : (
					<PauseButton type="button" onClick={pauseCountdown} disabled={!isCountdownRunning}>
						Pause
					</PauseButton>
				)}

				{!isCountdownRunning && countdownTime !== inputMinutes * SIXTY && (
					<ResetButton type="button" onClick={resetCountdown}>
						Reset
					</ResetButton>
				)}
			</ButtonGroup>
		</Container>
	);
};

const Container = styled.section`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding-bottom: calc(var(--padding-container-mobile) * 4);
	height: calc(100dvh - 2 * var(--nav-height) - 2 * var(--padding-container-mobile));
`;

const MinuteAndSecondDisplay = styled.div<{
	countdownTime: number;
	inputMinutes: number;
}>`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 60px;
	width: 320px;
	height: 320px;
	font-size: calc(var(--fz-h1) * 1.75);
	font-weight: var(--fw-black);
	outline: 2px dotted var(--blue300);
	outline-offset: 4px;
	border: 1px solid var(--blue100);
	border-radius: var(--radius-extra);
	color: var(--grey100);
	background: var(--gradient-blue100);
	opacity: ${({ countdownTime, inputMinutes }) => (countdownTime < 30 ? 0.4 : countdownTime / (inputMinutes * 60))};
`;

const ButtonGroup = styled(ShrinkMotionBlock)`
	position: absolute;
	bottom: 16px;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	gap: 16px;
`;

const SetInputAndButton = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 16px;
	margin-top: 16px;

	#select-root {
		width: 100%;

		button[role='combobox'] {
			min-width: 240px;
			height: 64px;
			font-size: var(--fz-h7);
		}
	}
`;

const StyledButton = styled(Button)`
	padding: var(--padding-container-mobile);
	min-height: 64px;
	min-width: 100px;
	font-weight: var(--fw-semibold);
	border-radius: var(--radius-extra);
`;

const StartButton = styled(StyledButton)`
	width: 100%;
	color: var(--white);
	background-color: var(--black);

	&:hover,
	&:active,
	&:focus {
		background-color: var(--grey900);
	}

	&:disabled {
		color: var(--grey500);
		background-color: var(--grey100);
	}
`;

const PauseButton = styled(StyledButton)`
	width: 100%;
	color: var(--white);
	background-color: var(--black);
	border: 1px solid var(--grey100);

	&:hover,
	&:active,
	&:focus {
		background-color: var(--grey900);
	}

	&:disabled {
		color: var(--grey500);
		background-color: var(--grey100);
	}
`;

const ResetButton = styled(StyledButton)`
	width: 100%;
	color: var(--black);
	background-color: var(--white);
	border: 1px solid var(--grey100);

	&:hover,
	&:active,
	&:focus {
		background-color: var(--grey100);
	}
`;

export default PomodoroTimer;
