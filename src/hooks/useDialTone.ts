import { useAudioPlayer } from 'expo-audio';

const TONE_URI = 'https://actions.google.com/sounds/v1/user_interface/click_fast.ogg';

export function useDialTone() {
  const player = useAudioPlayer(TONE_URI);

  const playKeyPressTone = () => {
    try {
      player.seekTo(0);
      player.play();
    } catch (error) {
      // Fallback silently if audio fails
    }
  };

  return { playKeyPressTone };
}