'use client';

import { BatteryLow, KeyRound, Layers, Rocket, WifiOff, Zap } from 'lucide-react';
import { InfiniteMovingCards, type ScenarioCardItem } from '@/components/ui/infinite-moving-cards';

// Real situations and what Resumora does in each.
const SCENARIOS: ScenarioCardItem[] = [
  {
    quote: 'An inspector is 22 steps into a claim when the browser crashes on a low-memory tablet.',
    name: 'Tab crash',
    title: 'Checkpoint restored, later edits replayed',
    icon: Zap,
  },
  {
    quote:
      'A session token expires while an underwriter is typing notes on a mortgage application.',
    name: 'Token expired',
    title: 'Workspace locked until the user signs back in',
    icon: KeyRound,
  },
  {
    quote: 'A deploy ships mid-afternoon and every open tab reloads onto the new build.',
    name: 'New deploy',
    title: 'Work restored on the next page load',
    icon: Rocket,
  },
  {
    quote: 'A field agent loses signal in a basement while filling in a property survey.',
    name: 'Offline mode',
    title: 'Every edit safely stored on-device',
    icon: WifiOff,
  },
  {
    quote: 'A laptop runs out of battery halfway through a long compliance form.',
    name: 'Dead battery',
    title: 'Intents committed before the power went',
    icon: BatteryLow,
  },
  {
    quote: 'The browser quietly discards a background tab to free memory.',
    name: 'Discarded tab',
    title: 'Same workspace, same state on return',
    icon: Layers,
  },
];

/** An endless scroller of the interruptions Resumora is built for. Pauses on hover. */
export function ScenarioScroller() {
  return <InfiniteMovingCards items={SCENARIOS} direction="left" speed="normal" />;
}
