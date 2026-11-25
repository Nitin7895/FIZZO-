/** Sample reviews for the fictional Fizzo brand — placeholder copy for the design demo. */

export interface Review {
  name: string;
  city: string;
  flavor: string;
  quote: string;
  stars: 4 | 5;
}

export const REVIEWS: readonly Review[] = [
  { name: "Maya R.", city: "Austin", flavor: "Blue Burst", quote: "Tastes like a blueberry that went to a rave. I have stopped buying anything else.", stars: 5 },
  { name: "Jonas K.", city: "Berlin", flavor: "Lime Rush", quote: "Zero sugar and somehow still crisp. The bubbles are tiny and relentless.", stars: 5 },
  { name: "Priya S.", city: "London", flavor: "Mango Sun", quote: "Like drinking a sunset. Please never discontinue this.", stars: 5 },
  { name: "Leo M.", city: "Lisbon", flavor: "Cherry Pop", quote: "Real cherry, not candy cherry. My dentist would approve.", stars: 4 },
  { name: "Aiko T.", city: "Tokyo", flavor: "Grape Night", quote: "Deep, dark, and strangely elegant. The can looks gorgeous on my desk too.", stars: 5 },
  { name: "Sam W.", city: "Toronto", flavor: "Lime Rush", quote: "Cold out of the fridge it is unreal. Best thing I have had after a run.", stars: 5 },
  { name: "Nora B.", city: "Oslo", flavor: "Blue Burst", quote: "No aftertaste. That alone makes it better than every zero soda I have tried.", stars: 4 },
  { name: "Diego F.", city: "Mexico City", flavor: "Mango Sun", quote: "Brought a case to a party and it was gone in an hour.", stars: 5 },
] as const;
