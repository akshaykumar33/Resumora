import { IconArrowRight, IconCheck } from '@tabler/icons-react';
import { ArchitectureBeams } from '@/components/home/architecture-beams';
import { FeatureBento } from '@/components/home/bento';
import { CodeShowcaseTabs } from '@/components/home/code-tabs';
import { ContinuityTimeline } from '@/components/home/continuity-timeline';
import { DisplayHeadline } from '@/components/home/display-headline';
import { StaggerReveal } from '@/components/home/gsap-scenes';
import { InterruptionOrbit } from '@/components/home/interruption-orbit';
import { LiveDemo } from '@/components/home/live-demo';
import { ProofStats } from '@/components/home/proof-stats';
import { Reveal } from '@/components/home/motion';
import { ResumoraGlobe } from '@/components/home/resumora-globe';
import { ScenarioScroller } from '@/components/home/scenario-scroller';
import { ScrollStory } from '@/components/home/scroll-story';
import { LogoMark } from '@/components/logo';
import { SiteFooter } from '@/components/site-footer';
import { SmoothScroll } from '@/components/smooth-scroll';
import { ButtonLink, Em, Heading, Section, Surface } from '@/components/ui/kit';

const promises = [
  'No runtime dependencies in core',
  'Every record namespaced by tenant, user and workspace',
  'Runs in any JavaScript host, so it tests anywhere',
];

export default function HomePage() {
  return (
    <main id="top" className="flex flex-1 flex-col overflow-x-clip">
      <SmoothScroll />

      {/* Hero: the promise on the left, the product working on the right */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="resumora-grid absolute inset-0 opacity-30" />
          <div className="absolute -right-40 top-10 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--color-fd-primary)_22%,transparent),transparent_65%)] blur-2xl" />
          <div className="absolute -left-56 -top-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--resumora-glow-b)_16%,transparent),transparent_65%)] blur-2xl" />
        </div>

        <div className="mx-auto grid min-h-[100dvh] w-full max-w-6xl items-center gap-12 px-gutter pb-16 pt-28 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-24">
          <div className="flex flex-col items-start gap-7">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card/70 px-3.5 py-1.5 text-[13px] text-fd-muted-foreground">
                <LogoMark className="size-3.5 text-fd-primary" />
                Application continuity runtime
              </span>
            </Reveal>

            <DisplayHeadline
              segments={[
                { text: 'Your users never lose' },
                { text: 'the work', em: true },
                { text: 'they’ve done.' },
              ]}
              className="font-display text-display font-semibold text-fd-foreground"
            />

            <Reveal delay={0.15}>
              <p className="max-w-[44ch] text-lead text-fd-muted-foreground md:text-xl md:leading-relaxed">
                Unfinished work comes back after crashes, reloads and expired sessions, and stored
                data is never treated as permission.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="flex flex-wrap items-center gap-3">
                <ButtonLink href="/docs/getting-started" size="lg">
                  Get started
                  <IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </ButtonLink>
                <ButtonLink href="#try-it" variant="secondary" size="lg">
                  Try the live demo
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.3} className="relative w-full min-w-0">
            <div
              aria-hidden
              className="absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(60%_60%_at_50%_40%,color-mix(in_oklch,var(--color-fd-primary)_20%,transparent),transparent)] blur-xl"
            />
            <ContinuityTimeline />
          </Reveal>
        </div>
      </section>

      {/* Proof: real numbers, set as type rather than boxed in cards */}
      <section className="border-y border-fd-border bg-sunken">
        <ProofStats />
      </section>

      {/* Architecture: one centred statement and the diagram */}
      <Section>
        <div className="flex flex-col items-center gap-14">
          <Reveal>
            <Heading
              align="center"
              title={
                <>
                  One runtime between your app and <Em>its storage.</Em>
                </>
              }
              lead="Every screen sends its edits through Resumora, which keeps them in whichever storage you choose."
            />
          </Reveal>
          <Reveal delay={0.1} className="w-full">
            <ArchitectureBeams />
          </Reveal>
        </div>
      </Section>

      {/* Interruptions: words beside the orbit, then the scenarios scroll past */}
      <Section tone="sunken" bordered containerClassName="pb-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <Heading
              title={
                <>
                  Every interruption, <Em>absorbed.</Em>
                </>
              }
              lead="Crashes, expired tokens, deploys, dead batteries, discarded tabs. Whatever stops your user, their work is already on the device."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <InterruptionOrbit />
          </Reveal>
        </div>
      </Section>
      <div className="-mt-px border-b border-fd-border bg-sunken pb-16">
        <ScenarioScroller />
      </div>

      {/* Invariants: the bento board */}
      <Section>
        <Reveal>
          <Heading
            eyebrow="Built in"
            title={
              <>
                Made for the moment things <Em>go wrong.</Em>
              </>
            }
            className="mb-12"
          />
        </Reveal>
        <StaggerReveal>
          <FeatureBento />
        </StaggerReveal>
      </Section>

      {/* The story, told by scrolling */}
      <ScrollStory />

      {/* Live demo */}
      <Section id="try-it" tone="sunken" bordered className="scroll-mt-20">
        <Reveal>
          <Heading
            eyebrow="Live"
            title={
              <>
                Now try to <Em>lose yours.</Em>
              </>
            }
            lead="This is the real runtime, saving to IndexedDB in your browser. Type, then crash it."
            className="mb-12"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <LiveDemo />
        </Reveal>
      </Section>

      {/* The API, in three calls */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <Reveal className="flex flex-col gap-8">
            <Heading
              title={
                <>
                  Three calls. <Em>Nothing lost.</Em>
                </>
              }
              lead="Record, checkpoint, restore. Your app replays what comes back, so it always owns its state."
            />
            <ul className="flex flex-col gap-3">
              {promises.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[15px] text-fd-foreground">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-fd-primary/15 text-fd-primary">
                    <IconCheck className="size-3.5" strokeWidth={2.5} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <ButtonLink
              href="/docs/concepts/recovery-model"
              variant="ghost"
              className="-ml-4 w-fit"
            >
              How recovery works
              <IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.1} className="min-w-0">
            <CodeShowcaseTabs />
          </Reveal>
        </div>
      </Section>

      {/* Closing: one glowing card, the globe inside it */}
      <Section containerClassName="pt-0">
        <Surface className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 size-[36rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--color-fd-primary)_24%,transparent),transparent_65%)] blur-2xl"
          />
          <div className="relative grid items-center gap-6 p-8 sm:p-12 lg:grid-cols-[1.1fr_1fr] lg:p-16">
            <Reveal className="flex flex-col items-start gap-8">
              <Heading
                title={
                  <>
                    Recover your first workspace in <Em>five minutes.</Em>
                  </>
                }
                lead="Work stays on each user’s device until they come back to it."
              />
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/docs/getting-started" size="lg">
                  Get started
                  <IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </ButtonLink>
                <ButtonLink
                  href="https://github.com/akshaykumar33/Resumora"
                  variant="secondary"
                  size="lg"
                >
                  View the source
                </ButtonLink>
              </div>
            </Reveal>
            <div className="relative mx-auto aspect-square w-full max-w-[min(420px,80vw)]">
              <ResumoraGlobe />
            </div>
          </div>
        </Surface>
      </Section>

      <SiteFooter />
    </main>
  );
}
