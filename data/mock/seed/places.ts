import type { Place } from '@/data/types';

/** Public venues for the mock place search. Google Places replaces this in Phase 3. */
export const seedPlaces: Place[] = [
  { id: 'pl_1', name: 'Not Just Coffee', address: '224 E 7th St', city: 'Charlotte, NC', category: 'coffee' },
  { id: 'pl_2', name: 'Amelie\'s French Bakery', address: '2424 N Davidson St', city: 'Charlotte, NC', category: 'brunch' },
  { id: 'pl_3', name: 'Freedom Park', address: '1900 East Blvd', city: 'Charlotte, NC', category: 'park' },
  { id: 'pl_4', name: 'Chocolate Coffee Co.', address: '1101 Hemphill Ave NW', city: 'Atlanta, GA', category: 'coffee' },
  { id: 'pl_5', name: 'West Egg Café', address: '1100 Howell Mill Rd NW', city: 'Atlanta, GA', category: 'brunch' },
  { id: 'pl_6', name: 'Piedmont Park', address: '1320 Monroe Dr NE', city: 'Atlanta, GA', category: 'park' },
  { id: 'pl_7', name: 'Atlanta BeltLine Eastside Trail', address: 'Irwin St NE', city: 'Atlanta, GA', category: 'park' },
  { id: 'pl_8', name: 'Passion City Church', address: '515 Garson Dr NE', city: 'Atlanta, GA', category: 'church' },
  { id: 'pl_9', name: 'Mary Mac\'s Tea Room', address: '224 Ponce De Leon Ave NE', city: 'Atlanta, GA', category: 'restaurant' },
  { id: 'pl_10', name: 'Frothy Monkey', address: '2509 12th Ave S', city: 'Nashville, TN', category: 'coffee' },
  { id: 'pl_11', name: 'Centennial Park', address: '2500 West End Ave', city: 'Nashville, TN', category: 'park' },
  { id: 'pl_12', name: 'Houston Botanic Garden', address: '1 Botanic Ln', city: 'Houston, TX', category: 'park' },
  { id: 'pl_13', name: 'Intelligentsia Coffee', address: '53 W Jackson Blvd', city: 'Chicago, IL', category: 'coffee' },
  { id: 'pl_14', name: 'Millennium Park', address: '201 E Randolph St', city: 'Chicago, IL', category: 'park' },
];

export function searchSeedPlaces(query: string, city: string): Place[] {
  const q = query.trim().toLowerCase();
  const cityKey = city.split(',')[0]?.trim().toLowerCase() ?? '';
  const inCity = seedPlaces.filter((p) => p.city.toLowerCase().includes(cityKey));
  const pool = inCity.length > 0 ? inCity : seedPlaces;
  if (!q) return pool;
  return pool.filter((p) => p.name.toLowerCase().includes(q) || p.category.includes(q) || p.address.toLowerCase().includes(q));
}
