import React from 'react';
import { OppoAudio } from './OppoAudio';
import { OppoOpening } from './OppoOpening';

export function OppoAudioCover() {
  return <OppoAudio opening={<OppoOpening />} />;
}
