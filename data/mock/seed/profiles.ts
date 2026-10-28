import type { AttendanceId, DenominationId } from '@/config/faiths';
import type {
  Gender,
  Intent,
  MaritalHistory,
  Photo,
  Profile,
  PromptAnswer,
  Testimony,
  VoiceClip,
  WantsChildren,
} from '@/data/types';

import { birthdateForAge, daysAgo } from '../time';

/** Compact row format expanded into the section 9 tables below. */
interface SeedRow {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  city: string;
  denomination: DenominationId;
  attendance: AttendanceId;
  marital: MaritalHistory;
  since?: number;
  kids?: number[];
  wants: WantsChildren;
  intent: Intent;
  verified: boolean;
  /** Voice intro: starter label and duration, or null for text-only. */
  voice: { starter: string; seconds: number } | null;
  homeChurch?: string;
  interests: string[];
  values: string;
  /** Answers to prompt ids, in display order. */
  answers: [string, string][];
  testimony?: string;
  ghost?: number;
}

const rows: SeedRow[] = [
  {
    id: 'p_marcus', name: 'Marcus', gender: 'male', age: 32, city: 'Charlotte, NC', denomination: 'baptist', attendance: 'weekly',
    marital: 'never', wants: 'yes', intent: 'spouse', verified: true, voice: { starter: 'Who I am', seconds: 58 },
    homeChurch: 'Friendship Missionary Baptist', interests: ['Sports', 'Cooking', 'Music', 'Board games'],
    values: 'Faithfulness, hospitality, and showing up.',
    answers: [
      ['perfect_day', "Sunday service, then grilling for whoever shows up. Ending the night with a game of spades I'm definitely winning."],
      ['how_i_serve', 'I run the sound board at church and coach a middle school basketball team on Saturdays.'],
      ['marriage_means', 'Two people who pray together, laugh a lot, and never let the other one carry something alone.'],
    ],
    testimony: 'I came back to church at 27 after my dad passed. The men in that congregation carried me, and I have been trying to be that for someone else since.',
  },
  {
    id: 'p_david', name: 'David', gender: 'male', age: 31, city: 'Atlanta, GA', denomination: 'non_denominational', attendance: 'weekly',
    marital: 'never', wants: 'yes', intent: 'spouse', verified: true, voice: { starter: "What I'm looking for", seconds: 74 },
    homeChurch: 'Passion City Church', interests: ['Music', 'Volunteering', 'Fitness', 'Reading'],
    values: 'Honesty, generosity, patience.',
    answers: [
      ['perfect_day', 'Early run, worship team rehearsal, then a long lunch with people I love and nowhere to be.'],
      ['verse_holding', 'Psalm 27:14. Waiting on the Lord has been the whole lesson of my twenties.'],
      ['hospitality', 'Shrimp and grits, from scratch, with the good cheese. My grandmother would accept nothing less.'],
    ],
  },
  {
    id: 'p_jonathan', name: 'Jonathan', gender: 'male', age: 34, city: 'Atlanta, GA', denomination: 'methodist', attendance: 'most_weeks',
    marital: 'divorced', since: 2021, wants: 'open', intent: 'spouse', verified: true, voice: { starter: 'My faith day to day', seconds: 66 },
    interests: ['Reading', 'Hiking', 'Music', 'Gardening'],
    values: 'Grace, steadiness, telling the truth.',
    answers: [
      ['perfect_day', 'A slow morning with coffee and a hymn, a hike at Sweetwater Creek, and dinner cooked with someone who likes to talk while they chop.'],
      ['faith_grew', 'My divorce. I thought it would end my faith. Instead it taught me what grace actually costs and what it gives back.'],
      ['worship_song', 'Great Is Thy Faithfulness. Morning by morning, new mercies. I need to hear that every day.'],
    ],
    testimony: 'I grew up in the Methodist church, drifted in college, and came back to it broken in 2021. God met me there with a patience I did not deserve.',
  },
  {
    id: 'p_samuel', name: 'Samuel', gender: 'male', age: 29, city: 'Nashville, TN', denomination: 'pentecostal', attendance: 'weekly',
    marital: 'never', wants: 'yes', intent: 'spouse', verified: false, voice: { starter: 'Who I am', seconds: 45 },
    interests: ['Music', 'Worship', 'Travel', 'Cooking'],
    values: 'Joy, humility, hard work.',
    answers: [
      ['perfect_day', 'Leading worship in the morning, hot chicken for lunch, and a porch full of friends playing guitars until the mosquitoes win.'],
      ['travel_anywhere', 'Lagos. My roommate is Nigerian and I have heard so much about his mother\'s jollof that I feel I owe her a visit.'],
      ['laugh_at', 'My nephew explaining the rules of games he invented thirty seconds ago.'],
    ],
  },
  {
    id: 'p_elijah', name: 'Elijah', gender: 'male', age: 36, city: 'Houston, TX', denomination: 'cogic', attendance: 'weekly',
    marital: 'widowed', since: 2022, kids: [6], wants: 'open', intent: 'spouse', verified: true, voice: null,
    interests: ['Sports', 'Reading', 'Volunteering'],
    values: 'Faith, family, and finishing what I start.',
    answers: [
      ['perfect_day', 'Pancakes with my daughter, church, then a nap I have earned. Simple is the point.'],
      ['pray_about', 'That my daughter grows up knowing her mother through how I live, and that I would be ready when God brings someone new.'],
      ['home_feels_like', 'Music playing, something on the stove, and people who feel free to open the fridge.'],
    ],
    testimony: 'Losing my wife taught me that the church is not a building. It is the people who showed up with casseroles for a year.',
  },
  {
    id: 'p_caleb', name: 'Caleb', gender: 'male', age: 27, city: 'Dallas, TX', denomination: 'non_denominational', attendance: 'weekly',
    marital: 'never', wants: 'yes', intent: 'purpose', verified: false, voice: { starter: "What I'm looking for", seconds: 38 },
    interests: ['Fitness', 'Travel', 'Movies', 'Cooking'],
    values: 'Curiosity, kindness, discipline.',
    answers: [
      ['perfect_day', 'Gym before sunrise, a long breakfast, and a drive somewhere with no plan and a good playlist.'],
      ['interesting_thing', 'I can solve a Rubik\'s cube in under a minute and I have never once made it look cool.'],
      ['ideal_first_date', 'A walk somewhere with trees and a coffee in hand. Low pressure, real conversation.'],
    ],
  },
  {
    id: 'p_isaiah', name: 'Isaiah', gender: 'male', age: 33, city: 'Chicago, IL', denomination: 'ame', attendance: 'weekly',
    marital: 'never', wants: 'yes', intent: 'spouse', verified: true, voice: { starter: 'My faith day to day', seconds: 81 },
    homeChurch: 'Quinn Chapel AME', interests: ['Reading', 'Music', 'Volunteering', 'Art'],
    values: 'Justice, mercy, walking humbly.',
    answers: [
      ['perfect_day', 'Service at Quinn Chapel, lunch on the South Side, then the Art Institute until they kick me out.'],
      ['faith_everyday', 'I teach high school history. Faith for me is patience with a sixteen-year-old at 2:45 on a Friday.'],
      ['people_say', 'That I am the one who remembers your birthday and shows up with a book you mentioned once.'],
    ],
  },
  {
    id: 'p_noah', name: 'Noah', gender: 'male', age: 30, city: 'Denver, CO', denomination: 'presbyterian', attendance: 'most_weeks',
    marital: 'never', wants: 'not_sure', intent: 'purpose', verified: false, voice: null,
    interests: ['Hiking', 'Photography', 'Reading'],
    values: 'Thoughtfulness, honesty, wonder.',
    answers: [
      ['perfect_day', 'A trailhead at dawn, a summit, and a diner breakfast on the way home that I have not stopped thinking about.'],
      ['learning_now', 'That rest is not laziness. I am a slow learner on this one.'],
      ['rest_well', 'Film camera, no phone, one trail. I come back a better person.'],
    ],
  },
  {
    id: 'p_andre', name: 'Andre', gender: 'male', age: 38, city: 'Birmingham, AL', denomination: 'baptist', attendance: 'weekly',
    marital: 'divorced', since: 2019, kids: [9, 12], wants: 'open', intent: 'spouse', verified: true, voice: { starter: 'Who I am', seconds: 62 },
    interests: ['Sports', 'Cooking', 'Board games'],
    values: 'Loyalty, provision, laughter.',
    answers: [
      ['perfect_day', 'My boys\' football game, a win preferably, then ribs on the smoker and a movie we have all seen before.'],
      ['marriage_means', 'A partnership where both people are honest when it is hard. I learned that the expensive way.'],
      ['family_tradition', 'Saturday morning pancakes shaped like whatever the kids request. The requests have gotten ambitious.'],
    ],
    testimony: 'God rebuilt my life after my divorce, one Sunday at a time. My sons watched it happen, and that is my testimony.',
  },
  {
    id: 'p_micah', name: 'Micah', gender: 'male', age: 28, city: 'Raleigh, NC', denomination: 'lutheran', attendance: 'occasionally',
    marital: 'never', wants: 'yes', intent: 'purpose', verified: false, voice: { starter: 'Who I am', seconds: 41 },
    interests: ['Music', 'Movies', 'Travel', 'Art'],
    values: 'Creativity, gentleness, growth.',
    answers: [
      ['perfect_day', 'Farmers market, a long record store visit, and cooking something new for friends who are kind about the results.'],
      ['travel_anywhere', 'Wittenberg, honestly. Nerdy Lutheran pilgrimage with good beer and better bread.'],
      ['worship_song', 'A Mighty Fortress. It is in my bones.'],
    ],
  },
  {
    id: 'p_joseph', name: 'Joseph', gender: 'male', age: 41, city: 'Phoenix, AZ', denomination: 'catholic', attendance: 'weekly',
    marital: 'never', wants: 'open', intent: 'spouse', verified: true, voice: null,
    interests: ['Reading', 'Hiking', 'Volunteering', 'Gardening'],
    values: 'Faith, service, quiet strength.',
    answers: [
      ['perfect_day', 'Morning Mass, a desert hike before the heat, and an evening with a book and a slow dinner.'],
      ['how_i_serve', 'St. Vincent de Paul food pantry every other Saturday for eleven years. The regulars know me by name.'],
      ['grateful_for', 'My mother\'s health, the monsoon rains, and a job I still like.'],
    ],
  },
  {
    id: 'p_daniel', name: 'Daniel', gender: 'male', age: 35, city: 'Memphis, TN', denomination: 'cogic', attendance: 'weekly',
    marital: 'never', wants: 'yes', intent: 'spouse', verified: true, voice: { starter: "What I'm looking for", seconds: 70 },
    interests: ['Music', 'Worship', 'Fitness', 'Cooking'],
    values: 'Prayer, discipline, tenderness.',
    answers: [
      ['perfect_day', 'Praise and worship that runs long, a barbecue I did not have to cook, and a sunset over the river.'],
      ['hope_for_us', 'A home where people come to be fed and prayed over, and children who think that is normal.'],
      ['sunday_looks_like', 'Sunday school at 9, service at 11, dinner at my mother\'s at 3. Every week. I love it.'],
    ],
  },
  {
    id: 'p_gabriel', name: 'Gabriel', gender: 'male', age: 26, city: 'Miami, FL', denomination: 'pentecostal', attendance: 'weekly',
    marital: 'never', wants: 'yes', intent: 'purpose', verified: false, voice: { starter: 'Who I am', seconds: 36 },
    interests: ['Sports', 'Music', 'Travel'],
    values: 'Passion, loyalty, family.',
    answers: [
      ['perfect_day', 'Church with my whole family, a beach afternoon, and dominoes with my abuelo until he accuses me of cheating.'],
      ['laugh_at', 'My mother narrating telenovelas to me as if I have not seen the episode.'],
      ['faith_everyday', 'I pray in the car before every shift. Nursing is hard and I do not do it alone.'],
    ],
  },
  {
    id: 'p_thomas', name: 'Thomas', gender: 'male', age: 44, city: 'Minneapolis, MN', denomination: 'lutheran', attendance: 'most_weeks',
    marital: 'widowed', since: 2020, kids: [14, 17], wants: 'no', intent: 'spouse', verified: true, voice: null,
    interests: ['Reading', 'Gardening', 'Cooking', 'Board games'],
    values: 'Steadiness, honesty, warmth.',
    answers: [
      ['perfect_day', 'Coffee on the porch while the garden wakes up, service, and a long dinner where my teenagers actually talk.'],
      ['faith_grew', 'The winter after my wife died. I sat in the back pew and did not sing for months. The congregation sang for me.'],
      ['home_feels_like', 'Bread in the oven and the sound of someone laughing in the next room.'],
    ],
  },
  {
    id: 'p_benjamin', name: 'Benjamin', gender: 'male', age: 31, city: 'Washington, DC', denomination: 'orthodox', attendance: 'weekly',
    marital: 'never', wants: 'yes', intent: 'spouse', verified: true, voice: { starter: 'My faith day to day', seconds: 88 },
    interests: ['Reading', 'Art', 'Travel', 'Music'],
    values: 'Reverence, patience, depth.',
    answers: [
      ['perfect_day', 'Divine Liturgy, a long walk through the museums, and Ethiopian food with friends who argue about theology for fun.'],
      ['verse_holding', 'Lamentations 3:22-23. Steadfast love. I keep coming back to the word steadfast.'],
      ['learning_now', 'Byzantine chant, badly. My choir director is a patient woman.'],
    ],
  },
  {
    id: 'p_christopher', name: 'Christopher', gender: 'male', age: 37, city: 'Columbus, OH', denomination: 'non_denominational', attendance: 'weekly',
    marital: 'divorced', since: 2023, wants: 'open', intent: 'purpose', verified: false, voice: null,
    interests: ['Fitness', 'Sports', 'Movies'],
    values: 'Growth, accountability, humor.',
    answers: [
      ['perfect_day', 'A long bike ride, a Buckeyes game with friends, and tacos that require a lot of napkins.'],
      ['pray_about', 'Learning to be single well before I try to be married again.'],
      ['people_say', 'That I am the designated driver and the designated hype man.'],
    ],
    ghost: 2,
  },
  {
    id: 'p_nathan', name: 'Nathan', gender: 'male', age: 29, city: 'Seattle, WA', denomination: 'presbyterian', attendance: 'weekly',
    marital: 'never', wants: 'yes', intent: 'spouse', verified: true, voice: { starter: "What I'm looking for", seconds: 52 },
    interests: ['Hiking', 'Reading', 'Cooking', 'Photography'],
    values: 'Faithfulness, curiosity, gentleness.',
    answers: [
      ['perfect_day', 'Rain, a bookshop, and ramen. Then evening service and a drive to see the water.'],
      ['marriage_means', 'Two people pointing the same direction, taking turns carrying the pack.'],
      ['hospitality', 'Salmon on cedar, roasted potatoes, and a salad I pretend is the hard part.'],
    ],
  },
  {
    id: 'p_luke', name: 'Luke', gender: 'male', age: 33, city: 'Kansas City, MO', denomination: 'methodist', attendance: 'occasionally',
    marital: 'never', wants: 'open', intent: 'purpose', verified: false, voice: { starter: 'Who I am', seconds: 47 },
    interests: ['Music', 'Cooking', 'Sports'],
    values: 'Kindness, honesty, good barbecue.',
    answers: [
      ['perfect_day', 'A Royals day game, burnt ends, and jazz at the Blue Room until late.'],
      ['interesting_thing', 'I play the trombone in a church brass band and have exactly one solo per year.'],
      ['travel_anywhere', 'New Orleans during Holy Week. Faith and music in the same streets.'],
    ],
  },
  {
    id: 'p_stephen', name: 'Stephen', gender: 'male', age: 40, city: 'Philadelphia, PA', denomination: 'baptist', attendance: 'weekly',
    marital: 'never', wants: 'yes', intent: 'spouse', verified: true, voice: null,
    interests: ['Reading', 'Volunteering', 'Fitness', 'Music'],
    values: 'Integrity, generosity, courage.',
    answers: [
      ['perfect_day', 'Early service, a run along the Schuylkill, and a cheesesteak I will not apologize for.'],
      ['how_i_serve', 'I mentor young men through our church\'s Saturday academy. Twelve years and counting.'],
      ['grateful_for', 'Good health at forty, a church that feels like family, and a mother who still calls every Sunday night.'],
    ],
  },
  {
    id: 'p_aaron', name: 'Aaron', gender: 'male', age: 30, city: 'Charlotte, NC', denomination: 'sda', attendance: 'weekly',
    marital: 'never', wants: 'yes', intent: 'spouse', verified: true, voice: { starter: 'My faith day to day', seconds: 59 },
    interests: ['Fitness', 'Hiking', 'Cooking', 'Reading'],
    values: 'Rest, health, faithfulness.',
    answers: [
      ['perfect_day', 'Sabbath. Phone off from Friday sunset, church, a potluck, and a long nature walk with no agenda.'],
      ['rest_well', 'Sabbath taught me rest is a command, not a reward. Best thing about my faith.'],
      ['ideal_first_date', 'A vegetarian spot with great conversation. I promise the food is better than you think.'],
    ],
  },
  // Women
  {
    id: 'p_naomi', name: 'Naomi', gender: 'female', age: 28, city: 'Charlotte, NC', denomination: 'baptist', attendance: 'weekly',
    marital: 'never', wants: 'yes', intent: 'spouse', verified: true, voice: { starter: 'Who I am', seconds: 55 },
    interests: ['Reading', 'Music', 'Cooking', 'Volunteering'],
    values: 'Loyalty, laughter, prayer.',
    answers: [
      ['perfect_day', 'Choir in the morning, a long brunch with my girlfriends, and a thunderstorm I can watch from the porch.'],
      ['faith_everyday', 'I teach second grade. My faith looks like patience, glitter, and a lot of silent prayers before recess.'],
      ['laugh_at', 'My students\' theories about what teachers do at night.'],
    ],
  },
  {
    id: 'p_abigail', name: 'Abigail', gender: 'female', age: 31, city: 'Atlanta, GA', denomination: 'non_denominational', attendance: 'weekly',
    marital: 'never', wants: 'yes', intent: 'spouse', verified: true, voice: { starter: "What I'm looking for", seconds: 72 },
    interests: ['Fitness', 'Travel', 'Reading', 'Worship'],
    values: 'Honesty, intention, joy.',
    answers: [
      ['perfect_day', 'A sunrise run, service, and a dinner party where I cook too much and everybody stays too late.'],
      ['hope_for_us', 'A marriage people can see Jesus in without us having to say a word.'],
      ['travel_anywhere', 'Israel. I want to stand where the stories happened.'],
    ],
    testimony: 'I gave my life to Christ at a college retreat at 19 and have never looked back, even on the hard days.',
  },
  {
    id: 'p_hannah', name: 'Hannah', gender: 'female', age: 34, city: 'Nashville, TN', denomination: 'methodist', attendance: 'most_weeks',
    marital: 'divorced', since: 2020, kids: [7], wants: 'open', intent: 'spouse', verified: true, voice: null,
    interests: ['Music', 'Gardening', 'Reading', 'Art'],
    values: 'Grace, honesty, resilience.',
    answers: [
      ['perfect_day', 'Pancakes with my son, church, and an afternoon in the garden while he narrates his Lego world to me.'],
      ['faith_grew', 'The year my marriage ended. I learned God does not leave when everything else does.'],
      ['home_feels_like', 'Dirt under my nails, a kid asleep upstairs, and a candle going.'],
    ],
  },
  {
    id: 'p_ruth', name: 'Ruth', gender: 'female', age: 29, city: 'Houston, TX', denomination: 'cogic', attendance: 'weekly',
    marital: 'never', wants: 'yes', intent: 'spouse', verified: false, voice: { starter: 'My faith day to day', seconds: 63 },
    interests: ['Worship', 'Cooking', 'Movies', 'Volunteering'],
    values: 'Faith, hospitality, truth.',
    answers: [
      ['perfect_day', 'Praise team at 8, lunch at my grandmother\'s, and a nap under a ceiling fan.'],
      ['hospitality', 'Gumbo. The real kind. You will need to clear your afternoon.'],
      ['sunday_looks_like', 'Loud. Joyful. Long. Exactly how I like it.'],
    ],
  },
  {
    id: 'p_esther', name: 'Esther', gender: 'female', age: 26, city: 'Dallas, TX', denomination: 'pentecostal', attendance: 'weekly',
    marital: 'never', wants: 'yes', intent: 'purpose', verified: true, voice: { starter: 'Who I am', seconds: 44 },
    interests: ['Music', 'Travel', 'Fitness', 'Photography'],
    values: 'Boldness, kindness, growth.',
    answers: [
      ['perfect_day', 'Worship, tacos, and a drive with the windows down and a friend who sings as badly as I do.'],
      ['interesting_thing', 'I have run a half marathon on three continents and cried at the finish of all three.'],
      ['pray_about', 'Direction for my career, and for a husband who prays louder than I do.'],
    ],
  },
  {
    id: 'p_leah', name: 'Leah', gender: 'female', age: 37, city: 'Chicago, IL', denomination: 'ame', attendance: 'weekly',
    marital: 'never', wants: 'open', intent: 'spouse', verified: true, voice: null,
    interests: ['Reading', 'Art', 'Volunteering', 'Music'],
    values: 'Justice, warmth, wisdom.',
    answers: [
      ['perfect_day', 'Church, a walk along the lake, and a used bookstore with a cat in it.'],
      ['how_i_serve', 'I am a public defender by day and I run our church\'s legal aid clinic one Saturday a month.'],
      ['people_say', 'That I will fight for you and then feed you.'],
    ],
  },
  {
    id: 'p_miriam', name: 'Miriam', gender: 'female', age: 32, city: 'Denver, CO', denomination: 'presbyterian', attendance: 'most_weeks',
    marital: 'never', wants: 'yes', intent: 'spouse', verified: false, voice: { starter: "What I'm looking for", seconds: 49 },
    interests: ['Hiking', 'Reading', 'Cooking'],
    values: 'Faithfulness, curiosity, calm.',
    answers: [
      ['perfect_day', 'A hike before church, a slow afternoon with a book, and soup simmering while the sun goes down over the mountains.'],
      ['marriage_means', 'Steady love that still notices. Someone who prays with me and laughs with me, in that order.'],
      ['learning_now', 'Sourdough and patience. They turn out to be the same lesson.'],
    ],
  },
  {
    id: 'p_deborah', name: 'Deborah', gender: 'female', age: 42, city: 'Birmingham, AL', denomination: 'baptist', attendance: 'weekly',
    marital: 'widowed', since: 2021, kids: [15, 18], wants: 'no', intent: 'spouse', verified: true, voice: { starter: 'Who I am', seconds: 67 },
    interests: ['Cooking', 'Gardening', 'Music', 'Reading'],
    values: 'Faith, family, steadfastness.',
    answers: [
      ['perfect_day', 'Sunday dinner with both my girls home, then a porch swing and a glass of sweet tea while the fireflies come out.'],
      ['faith_grew', 'The night my husband passed, our pastor sat with us until 4am. I learned what the church is for.'],
      ['family_tradition', 'Christmas Eve service, then opening one gift each. Just one. The girls still negotiate every year.'],
    ],
    testimony: 'God has been faithful through the hardest season of my life. I am not looking to replace anyone, just to keep walking with someone kind.',
  },
  {
    id: 'p_sarah', name: 'Sarah', gender: 'female', age: 27, city: 'Raleigh, NC', denomination: 'non_denominational', attendance: 'weekly',
    marital: 'never', wants: 'yes', intent: 'purpose', verified: false, voice: null,
    interests: ['Fitness', 'Travel', 'Movies', 'Cooking'],
    values: 'Adventure, honesty, warmth.',
    answers: [
      ['perfect_day', 'Farmers market, a long bike ride, and a movie night where nobody checks their phone.'],
      ['travel_anywhere', 'Portugal. Tiles, pastries, and a cathedral on every corner.'],
      ['laugh_at', 'My dog\'s reaction to the vacuum. Every single time.'],
    ],
  },
  {
    id: 'p_rebekah', name: 'Rebekah', gender: 'female', age: 30, city: 'Phoenix, AZ', denomination: 'catholic', attendance: 'weekly',
    marital: 'never', wants: 'yes', intent: 'spouse', verified: true, voice: { starter: 'My faith day to day', seconds: 77 },
    interests: ['Reading', 'Hiking', 'Art', 'Volunteering'],
    values: 'Reverence, service, joy.',
    answers: [
      ['perfect_day', 'Early Mass, a hike up Camelback before the heat, and an afternoon painting with the door open.'],
      ['faith_everyday', 'The rosary on my commute. Twenty minutes of quiet before a loud day in the ER.'],
      ['grateful_for', 'My sisters, my parish, and the way the desert smells after rain.'],
    ],
  },
  {
    id: 'p_lydia', name: 'Lydia', gender: 'female', age: 35, city: 'Memphis, TN', denomination: 'cogic', attendance: 'weekly',
    marital: 'divorced', since: 2018, kids: [10], wants: 'open', intent: 'spouse', verified: true, voice: null,
    interests: ['Music', 'Cooking', 'Worship', 'Board games'],
    values: 'Truth, grace, perseverance.',
    answers: [
      ['perfect_day', 'Praise and worship that goes long, my daughter\'s dance recital, and a quiet evening with a candle and nowhere to be.'],
      ['pray_about', 'A godly man who loves my daughter like his own, and the wisdom to wait for him.'],
      ['hospitality', 'Smothered chicken, greens, and cornbread. My grandmother\'s recipe, no measurements.'],
    ],
  },
  {
    id: 'p_anna', name: 'Anna', gender: 'female', age: 25, city: 'Miami, FL', denomination: 'pentecostal', attendance: 'weekly',
    marital: 'never', wants: 'yes', intent: 'purpose', verified: false, voice: { starter: 'Who I am', seconds: 39 },
    interests: ['Music', 'Travel', 'Fitness', 'Photography'],
    values: 'Joy, faith, family.',
    answers: [
      ['perfect_day', 'Service with my whole family, the beach, and cafecito with my grandmother while she tells me who to marry.'],
      ['interesting_thing', 'I speak four languages and dream in two of them.'],
      ['worship_song', 'Way Maker. In Spanish, loud, in the car.'],
    ],
  },
  {
    id: 'p_elizabeth', name: 'Elizabeth', gender: 'female', age: 39, city: 'Minneapolis, MN', denomination: 'lutheran', attendance: 'most_weeks',
    marital: 'never', wants: 'open', intent: 'spouse', verified: true, voice: { starter: "What I'm looking for", seconds: 61 },
    interests: ['Reading', 'Gardening', 'Music', 'Cooking'],
    values: 'Steadiness, kindness, honesty.',
    answers: [
      ['perfect_day', 'Service, a long walk around the lakes, and an afternoon of baking while it snows.'],
      ['marriage_means', 'A quiet partnership that gets stronger in the hard seasons, not just the easy ones.'],
      ['rest_well', 'A real Sabbath. No email, a long nap, and a novel I have read before.'],
    ],
  },
  {
    id: 'p_priscilla', name: 'Priscilla', gender: 'female', age: 33, city: 'Washington, DC', denomination: 'orthodox', attendance: 'weekly',
    marital: 'never', wants: 'yes', intent: 'spouse', verified: true, voice: null,
    interests: ['Art', 'Reading', 'Travel', 'Music'],
    values: 'Depth, reverence, hospitality.',
    answers: [
      ['perfect_day', 'Liturgy, coffee hour that runs two hours, and the museums until closing.'],
      ['verse_holding', 'Psalm 46:10. Be still. I am a doer and this verse keeps humbling me.'],
      ['home_feels_like', 'Icons in the corner, incense in the air, and friends who stay for dinner.'],
    ],
  },
  {
    id: 'p_joanna', name: 'Joanna', gender: 'female', age: 29, city: 'Columbus, OH', denomination: 'non_denominational', attendance: 'weekly',
    marital: 'never', wants: 'yes', intent: 'purpose', verified: false, voice: { starter: 'Who I am', seconds: 50 },
    interests: ['Fitness', 'Movies', 'Cooking', 'Volunteering'],
    values: 'Energy, honesty, service.',
    answers: [
      ['perfect_day', 'Spin class, church, and a cookout with people who bring their folding chairs and stay.'],
      ['how_i_serve', 'Kids\' ministry on Sundays. I am covered in stickers by noon and happy about it.'],
      ['travel_anywhere', 'Kenya. Our church partners with a school there and I want to meet the kids I have been praying for.'],
    ],
  },
  {
    id: 'p_phoebe', name: 'Phoebe', gender: 'female', age: 31, city: 'Seattle, WA', denomination: 'presbyterian', attendance: 'weekly',
    marital: 'never', wants: 'yes', intent: 'spouse', verified: true, voice: { starter: 'My faith day to day', seconds: 83 },
    interests: ['Hiking', 'Photography', 'Reading', 'Cooking'],
    values: 'Thoughtfulness, faithfulness, wonder.',
    answers: [
      ['perfect_day', 'Rain, a ferry, and a bakery on the other side. Then evening service and a long talk on the way home.'],
      ['faith_everyday', 'I am a software engineer. Faith looks like honesty in code reviews and grace in standups.'],
      ['ideal_first_date', 'A walk along the water with coffee. If it rains, that is just more to talk about.'],
    ],
  },
  {
    id: 'p_martha', name: 'Martha', gender: 'female', age: 36, city: 'Kansas City, MO', denomination: 'methodist', attendance: 'occasionally',
    marital: 'divorced', since: 2022, wants: 'open', intent: 'purpose', verified: false, voice: null,
    interests: ['Music', 'Cooking', 'Reading'],
    values: 'Honesty, growth, grace.',
    answers: [
      ['perfect_day', 'Jazz brunch, a long walk, and a kitchen full of friends and good bread.'],
      ['learning_now', 'How to trust again. Slowly. God is patient with me.'],
      ['people_say', 'That I am the friend who shows up with soup before you ask.'],
    ],
    ghost: 1,
  },
  {
    id: 'p_tabitha', name: 'Tabitha', gender: 'female', age: 28, city: 'Philadelphia, PA', denomination: 'baptist', attendance: 'weekly',
    marital: 'never', wants: 'yes', intent: 'spouse', verified: true, voice: { starter: "What I'm looking for", seconds: 56 },
    interests: ['Volunteering', 'Music', 'Fitness', 'Reading'],
    values: 'Compassion, courage, faith.',
    answers: [
      ['perfect_day', 'Early service, a run on Kelly Drive, and a long dinner with my parents who still argue about the sermon.'],
      ['hope_for_us', 'A family that serves together. Soup kitchens, mission trips, whatever God puts in front of us.'],
      ['grateful_for', 'Nursing school being behind me, a church that feels like home, and sunshine on a Monday.'],
    ],
  },
  {
    id: 'p_chloe', name: 'Chloe', gender: 'female', age: 30, city: 'Charlotte, NC', denomination: 'sda', attendance: 'weekly',
    marital: 'never', wants: 'yes', intent: 'spouse', verified: true, voice: { starter: 'Who I am', seconds: 48 },
    interests: ['Hiking', 'Cooking', 'Reading', 'Gardening'],
    values: 'Rest, health, faithfulness.',
    answers: [
      ['perfect_day', 'Sabbath. Church, a potluck, and a long walk where nobody checks the time.'],
      ['rest_well', 'Friday sunset to Saturday sunset. The best gift my faith has given me.'],
      ['family_tradition', 'Friday night candles and a big vegetarian dinner. My future kids will not escape it.'],
    ],
  },
  {
    id: 'p_eve', name: 'Eve', gender: 'female', age: 24, city: 'Nashville, TN', denomination: 'non_denominational', attendance: 'growing',
    marital: 'never', wants: 'not_sure', intent: 'purpose', verified: false, voice: null,
    interests: ['Music', 'Art', 'Travel', 'Movies'],
    values: 'Curiosity, honesty, kindness.',
    answers: [
      ['perfect_day', 'A songwriting session, a long coffee, and an open mic where I am brave enough to play.'],
      ['learning_now', 'What it means to actually follow Jesus and not just know about Him. I am new to this and I am all in.'],
      ['interesting_thing', 'I have written over two hundred songs and performed maybe twelve.'],
    ],
  },
];

export const seedProfiles: Profile[] = [];
export const seedVoiceClips: VoiceClip[] = [];
export const seedPromptAnswers: PromptAnswer[] = [];
export const seedTestimonies: Testimony[] = [];
export const seedPhotos: Photo[] = [];

rows.forEach((row, index) => {
  const created = daysAgo(90 - index * 2);
  seedProfiles.push({
    id: row.id,
    first_name: row.name,
    birthdate: birthdateForAge(row.age, index),
    city: row.city,
    gender: row.gender,
    seeking: row.gender === 'male' ? 'female' : 'male',
    faith: 'christian',
    denomination: row.denomination,
    church_attendance: row.attendance,
    home_church: row.homeChurch ?? null,
    marital_history: row.marital,
    marital_since_year: row.since ?? null,
    has_children: (row.kids?.length ?? 0) > 0,
    children_ages: row.kids ?? [],
    wants_children: row.wants,
    intent: row.intent,
    interests: row.interests,
    core_values: row.values,
    verified: row.verified,
    has_voice_intro: row.voice !== null,
    onboarding_step: 11,
    ghost_count: row.ghost ?? 0,
    created_at: created,
  });

  if (row.voice) {
    seedVoiceClips.push({
      id: `vc_${row.id}_intro`,
      profile_id: row.id,
      kind: 'intro',
      storage_path: `placeholder:${(index % 3) + 1}`,
      duration_s: row.voice.seconds,
      transcript: null,
      starter_label: row.voice.starter,
    });
  }

  row.answers.forEach(([promptId, text], i) => {
    seedPromptAnswers.push({
      id: `pa_${row.id}_${i}`,
      profile_id: row.id,
      prompt_id: promptId,
      text,
      voice_clip_id: null,
    });
  });

  if (row.testimony) {
    seedTestimonies.push({ id: `t_${row.id}`, profile_id: row.id, text: row.testimony, voice_clip_id: null });
  }

  const photoCount = 2 + (index % 3);
  for (let i = 0; i < photoCount; i++) {
    seedPhotos.push({
      id: `ph_${row.id}_${i}`,
      profile_id: row.id,
      storage_path: `abstract:${row.id}:${i}`,
      blurred_path: `blur:${row.id}:${i}`,
      order: i,
    });
  }
});
