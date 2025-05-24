import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useToast } from '../ui/Toast';

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const countdownAnimation = keyframes`
  0% { background-color: rgba(76, 175, 80, 0.1); }
  25% { background-color: rgba(255, 193, 7, 0.1); }
  50% { background-color: rgba(255, 152, 0, 0.1); }
  75% { background-color: rgba(244, 67, 54, 0.1); }
  100% { background-color: rgba(244, 67, 54, 0.2); }
`;

const TimerContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.large};
  border: 2px solid ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.border};
  text-align: center;
  position: relative;
  overflow: hidden;
  
  ${props => props.isActive && css`
    animation: ${pulseAnimation} 2s infinite;
  `}
  
  ${props => props.isResting && css`
    animation: ${countdownAnimation} 1s infinite alternate;
  `}
`;

const TimerDisplay = styled.div`
  font-size: 4rem;
  font-weight: bold;
  margin: ${props => props.theme.spacing.lg} 0;
  color: ${props => {
    if (props.isResting) return props.theme.colors.warning;
    if (props.isActive) return props.theme.colors.secondary;
    return props.theme.colors.text;
  }};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-family: 'Courier New', monospace;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const TimerLabel = styled.h3`
  margin: 0 0 ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textLight};
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: ${props => props.theme.typography.fontSizes.lg};
`;

const TimerControls = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: center;
  margin: ${props => props.theme.spacing.lg} 0;
  flex-wrap: wrap;
`;

const TimerButton = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-weight: bold;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.medium};
  min-width: 120px;
  font-size: ${props => props.theme.typography.fontSizes.md};
  
  ${props => {
    switch (props.variant) {
      case 'start':
        return css`
          background: ${props.theme.colors.secondary};
          color: white;
          &:hover { background: ${props.theme.colors.secondaryDark}; }
        `;
      case 'pause':
        return css`
          background: ${props.theme.colors.warning};
          color: white;
          &:hover { background: ${props.theme.colors.warningDark}; }
        `;
      case 'stop':
        return css`
          background: ${props.theme.colors.accent};
          color: white;
          &:hover { background: ${props.theme.colors.accentDark}; }
        `;
      case 'rest':
        return css`
          background: ${props.theme.colors.primary};
          color: white;
          &:hover { background: ${props.theme.colors.primaryDark}; }
        `;
      default:
        return css`
          background: ${props.theme.colors.grayLight};
          color: ${props.theme.colors.text};
          &:hover { background: ${props.theme.colors.gray}; }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ProgressOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(
    45deg,
    ${props => props.theme.colors.primary}20,
    ${props => props.theme.colors.secondary}20
  );
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
  z-index: -1;
`;

const TimerSettings = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: ${props => props.theme.borderRadius.medium};
`;

const SettingGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const SettingLabel = styled.label`
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

const SettingInput = styled.input`
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  background: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ProgressionSuggestion = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.lg};
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.primary}10, 
    ${props => props.theme.colors.secondary}10
  );
  border-radius: ${props => props.theme.borderRadius.medium};
  border-left: 4px solid ${props => props.theme.colors.secondary};
`;

const SuggestionTitle = styled.h4`
  margin: 0 0 ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.secondary};
  font-size: ${props => props.theme.typography.fontSizes.lg};
`;

const SuggestionText = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.text};
  line-height: 1.5;
`;

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const WorkoutTimer = ({ 
  exercise,
  setNumber,
  onSetComplete,
  onWorkoutComplete,
  lastPerformance = null
}) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(90); // default rest time in seconds
  const [workTime, setWorkTime] = useState(0); // work time for timed exercises
  const [currentRestTime, setCurrentRestTime] = useState(0);
  const [timerType, setTimerType] = useState('stopwatch'); // 'stopwatch', 'countdown', 'rest'
  
  // Timer settings
  const [settings, setSettings] = useState({
    defaultRestTime: 90,
    shortRestTime: 60,
    longRestTime: 180,
    autoStartRest: true,
    soundEnabled: true,
    progressiveOverload: true
  });
  
  const intervalRef = useRef(null);
  const audioContextRef = useRef(null);
  const toast = useToast();

  // Initialize audio context for timer sounds
  useEffect(() => {
    if (settings.soundEnabled && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, [settings.soundEnabled]);

  const playSound = useCallback((frequency = 800, duration = 200) => {
    if (!settings.soundEnabled || !audioContextRef.current) return;
    
    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
    } catch (error) {
      console.log('Audio playback not available');
    }
  }, [settings.soundEnabled]);

  const startTimer = useCallback(() => {
    setIsActive(true);
    
    intervalRef.current = setInterval(() => {
      setTime(prevTime => {
        const newTime = timerType === 'countdown' ? prevTime - 1 : prevTime + 1;
        
        // Countdown timer completion
        if (timerType === 'countdown' && newTime <= 0) {
          playSound(1000, 300);
          setIsActive(false);
          toast.success('Time\'s up!', { title: 'Exercise Complete' });
          return 0;
        }
        
        // Rest timer completion
        if (timerType === 'rest' && newTime <= 0) {
          playSound(600, 500);
          setIsResting(false);
          setIsActive(false);
          setTimerType('stopwatch');
          toast.success('Rest complete - ready for next set!', { title: 'Rest Period Over' });
          return 0;
        }
        
        // Sound cues for countdown
        if ((timerType === 'countdown' || timerType === 'rest') && newTime <= 3 && newTime > 0) {
          playSound(800, 200);
        }
        
        return newTime;
      });
    }, 1000);
  }, [timerType, playSound, toast]);

  const pauseTimer = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const stopTimer = useCallback(() => {
    setIsActive(false);
    setIsResting(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTime(0);
    setTimerType('stopwatch');
  }, []);

  const startRest = useCallback(() => {
    setIsResting(true);
    setTimerType('rest');
    setTime(currentRestTime || settings.defaultRestTime);
    
    toast.info(`Rest period started: ${formatTime(currentRestTime || settings.defaultRestTime)}`, {
      title: 'Rest Time'
    });
    
    if (settings.autoStartRest) {
      setIsActive(true);
    }
  }, [currentRestTime, settings.defaultRestTime, settings.autoStartRest, toast]);

  const completeSet = useCallback(() => {
    pauseTimer();
    
    if (onSetComplete) {
      onSetComplete({
        exercise,
        setNumber,
        duration: time,
        timestamp: new Date().toISOString()
      });
    }
    
    toast.success(`Set ${setNumber} completed!`, { title: 'Great Job!' });
    
    // Start rest automatically if enabled
    if (settings.autoStartRest) {
      setTimeout(() => startRest(), 1000);
    }
  }, [time, exercise, setNumber, onSetComplete, pauseTimer, startRest, settings.autoStartRest, toast]);

  // Progressive overload suggestions
  const getProgressiveSuggestion = useCallback(() => {
    if (!settings.progressiveOverload || !lastPerformance) return null;
    
    const suggestions = [];
    
    // Time-based suggestions
    if (lastPerformance.duration && time > lastPerformance.duration * 1.1) {
      suggestions.push('Great! You lasted 10% longer than last time.');
    }
    
    // Rest time optimization
    if (lastPerformance.restTime && currentRestTime < lastPerformance.restTime) {
      suggestions.push('You\'re recovering faster! Consider reducing rest time by 15-30 seconds next session.');
    }
    
    // Volume progression
    if (setNumber > (lastPerformance.sets || 0)) {
      suggestions.push('Excellent! You\'re doing more sets than last time.');
    }
    
    // General progression
    if (suggestions.length === 0) {
      suggestions.push('Try increasing weight by 2.5-5% or adding 1-2 more reps next time.');
    }
    
    return suggestions[0];
  }, [settings.progressiveOverload, lastPerformance, time, currentRestTime, setNumber]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Calculate progress percentage
  const getProgress = () => {
    if (timerType === 'countdown' || timerType === 'rest') {
      const total = timerType === 'rest' ? (currentRestTime || settings.defaultRestTime) : workTime;
      return total > 0 ? ((total - time) / total) * 100 : 0;
    }
    return isActive ? 50 : 0; // For stopwatch, show 50% when active
  };

  const progressiveSuggestion = getProgressiveSuggestion();

  return (
    <TimerContainer isActive={isActive} isResting={isResting}>
      <ProgressOverlay progress={getProgress()} />
      
      <TimerLabel>
        {isResting ? 'Rest Time' : timerType === 'countdown' ? 'Work Time' : 'Set Duration'}
      </TimerLabel>
      
      <TimerDisplay isActive={isActive} isResting={isResting}>
        {formatTime(time)}
      </TimerDisplay>
      
      <TimerControls>
        {!isActive ? (
          <TimerButton variant="start" onClick={startTimer}>
            {isResting ? 'Start Rest' : 'Start Timer'}
          </TimerButton>
        ) : (
          <TimerButton variant="pause" onClick={pauseTimer}>
            Pause
          </TimerButton>
        )}
        
        <TimerButton variant="stop" onClick={stopTimer}>
          Reset
        </TimerButton>
        
        {!isResting && (
          <TimerButton variant="rest" onClick={startRest}>
            Start Rest
          </TimerButton>
        )}
        
        {!isResting && (
          <TimerButton onClick={completeSet}>
            Complete Set
          </TimerButton>
        )}
      </TimerControls>
      
      <TimerSettings>
        <SettingGroup>
          <SettingLabel>Rest Time (seconds)</SettingLabel>
          <SettingInput
            type="number"
            value={currentRestTime || settings.defaultRestTime}
            onChange={(e) => setCurrentRestTime(parseInt(e.target.value))}
            min="30"
            max="600"
          />
        </SettingGroup>
        
        <SettingGroup>
          <SettingLabel>Timer Type</SettingLabel>
          <select
            value={timerType}
            onChange={(e) => setTimerType(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              background: 'white'
            }}
          >
            <option value="stopwatch">Stopwatch</option>
            <option value="countdown">Countdown</option>
          </select>
        </SettingGroup>
        
        {timerType === 'countdown' && (
          <SettingGroup>
            <SettingLabel>Work Time (seconds)</SettingLabel>
            <SettingInput
              type="number"
              value={workTime}
              onChange={(e) => {
                setWorkTime(parseInt(e.target.value));
                setTime(parseInt(e.target.value));
              }}
              min="10"
              max="3600"
            />
          </SettingGroup>
        )}
        
        <SettingGroup>
          <SettingLabel>
            <input
              type="checkbox"
              checked={settings.autoStartRest}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                autoStartRest: e.target.checked
              }))}
              style={{ marginRight: '8px' }}
            />
            Auto-start rest
          </SettingLabel>
        </SettingGroup>
        
        <SettingGroup>
          <SettingLabel>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                soundEnabled: e.target.checked
              }))}
              style={{ marginRight: '8px' }}
            />
            Sound alerts
          </SettingLabel>
        </SettingGroup>
      </TimerSettings>
      
      {progressiveSuggestion && settings.progressiveOverload && (
        <ProgressionSuggestion>
                      <SuggestionTitle>◆ Progressive Overload Suggestion</SuggestionTitle>
          <SuggestionText>{progressiveSuggestion}</SuggestionText>
        </ProgressionSuggestion>
      )}
    </TimerContainer>
  );
};

export default WorkoutTimer; 