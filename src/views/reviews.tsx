import { pageMetadata } from "@/lib/page-metadata";
import { PageHero } from "@/components/sections/page-hero";
import { PageShell } from "@/components/site/page-shell";
import { Marquee } from "@/components/ui/marquee";
import { Reveal } from "@/components/ui/reveal";
import { REVIEWS, type Review } from "@/data/reviews";

const ReviewCard = ({ review }: { review: Review }) => (
  <figure className="mx-[0.6rem] w-[22rem] shrink-0 rounded-card border border-surface-border bg-surface p-[1.4rem] max-sm:w-[16rem]">
    <p aria-label={`${review.stars} out of 5 stars`} className="text-accent">
      {"★".repeat(review.stars)}
      <span className="text-surface-border">{"★".repeat(5 - review.stars)}</span>
    </p>
    <blockquote className="mt-[0.5rem] leading-relaxed">“{review.quote}”</blockquote>
    <figcaption className="mt-[0.8rem] text-[0.85rem] text-muted">
      {review.name}, {review.city} · {review.flavor}
    </figcaption>
  </figure>
);

export const reviewsMetadata = pageMetadata("/reviews");

export const ReviewsView = () => (
  <PageShell path="/reviews">
    <PageHero eyebrow="Word on the street" title="Fizz-heads.">
      Sample reviews from our made-up, extremely happy customers.
    </PageHero>
    <Reveal className="mx-auto flex max-w-[115rem] items-center gap-[2rem] px-[2.4rem] max-sm:px-[1.4rem]">
      <p className="font-display uppercase tracking-tight text-[7rem] leading-display text-accent max-sm:text-[4rem]">
        4.9
        <span className="text-foreground">/5</span>
      </p>
      <p className="max-w-[20rem] text-muted">average rating across 48,000+ cans sold.</p>
    </Reveal>
    <div className="mt-[3rem] space-y-[1rem]">
      <Marquee seconds={60}>
        {REVIEWS.map((review) => (
          <ReviewCard key={review.name} review={review} />
        ))}
      </Marquee>
      <Marquee seconds={70} reverse>
        {[...REVIEWS].reverse().map((review) => (
          <ReviewCard key={review.name} review={review} />
        ))}
      </Marquee>
    </div>
  </PageShell>
);
