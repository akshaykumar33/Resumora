'use client';

import {
  IconBatteryOff,
  IconBolt,
  IconKey,
  IconLayersIntersect,
  IconRocket,
  IconWifiOff,
} from '@tabler/icons-react';
import { InfiniteMovingCards, type ScenarioCardItem } from '@/components/ui/infinite-moving-cards';

// Real incident topologies and deterministic recovery guarantees
const SCENARIOS: ScenarioCardItem[] = [
  {
    name: 'Tab Crash (SIGKILL)',
    scenario:
      'OS terminates low-memory Chromium process mid-way through a complex multi-step claims form.',
    recovery: 'WAL checkpoint restored + 22 intents replayed',
    latency: '2.4ms',
    status: 'Zero data loss',
    icon: IconBolt,
  },
  {
    name: 'Auth Token Expired',
    scenario:
      'Session bearer token expires while an underwriter is actively editing financial risk fields.',
    recovery: 'Workspace locked at rest until token reauthorization',
    latency: 'Zero-knowledge lock',
    status: 'Strict security',
    icon: IconKey,
  },
  {
    name: 'Production Deploy Reload',
    scenario:
      'A mid-day deployment triggers bundle invalidation, forcing an instant hard reload on open tabs.',
    recovery: 'Buffer seamlessly rehydrated from local storage on reload',
    latency: '1.2ms',
    status: 'Zero data loss',
    icon: IconRocket,
  },
  {
    name: 'Network Connection Flap',
    scenario:
      'Field worker loses connection in a concrete basement while documenting physical assets.',
    recovery: 'Mutations queued locally in IndexedDB with monotonic ordering',
    latency: 'Offline queue',
    status: 'Buffered locally',
    icon: IconWifiOff,
  },
  {
    name: 'Abrupt Battery Loss',
    scenario: 'Mobile device battery shuts down unexpectedly before drafts can sync upstream.',
    recovery: 'All committed WAL batches preserved across cold reboot',
    latency: 'Durable write',
    status: 'Recovered',
    icon: IconBatteryOff,
  },
  {
    name: 'Chromium Tab Discard',
    scenario: 'Browser discards dormant background tabs to reclaim memory under heavy load.',
    recovery: 'State reconstituted on tab switch without server latency',
    latency: '0.8ms',
    status: 'Zero data loss',
    icon: IconLayersIntersect,
  },
];

/** An endless scroller of the interruptions Resumora is built for. Pauses on hover. */
export function ScenarioScroller() {
  return <InfiniteMovingCards items={SCENARIOS} direction="left" speed="normal" />;
}
