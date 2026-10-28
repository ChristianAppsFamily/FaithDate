/**
 * Canned Aunt Martha replies for Phase 1. Picked by context and keyword, never random noise.
 * Phase 3 replaces this with the Claude API behind the system prompt in config/auntMartha.ts.
 */
import type { CoachContextType } from '@/config/auntMartha';

export interface CannedReply {
  id: string;
  context: CoachContextType | 'any';
  /** Lowercase keywords; the first reply whose keywords match wins. Empty = fallback for the context. */
  keywords: string[];
  text: string;
  /** Whether this reply raises a safety flag (shows the Report button). */
  flagged?: boolean;
}

export const cannedReplies: CannedReply[] = [
  /* Safety flags first so they win over everything else. */
  {
    id: 'flag_money',
    context: 'any',
    keywords: ['money', 'send him', 'send her', 'cash app', 'venmo', 'gift card', 'loan', 'wire'],
    flagged: true,
    text: "Sweetheart, I need to say this plainly: asking you for money this early isn't how a serious man or woman of faith behaves. Please don't send anything. You can report this from the chat menu, and I'd be proud of you for doing it.",
  },
  {
    id: 'flag_offapp',
    context: 'any',
    keywords: ['whatsapp', 'telegram', 'my number', 'off the app', 'text me at', 'instagram'],
    flagged: true,
    text: "Pressure to move off the app quickly is a flag, baby. There's no rush that love requires. Stay here where there are guardrails a while longer. If it keeps up, the Report button is right there.",
  },
  {
    id: 'flag_control',
    context: 'any',
    keywords: ['controlling', 'won\'t let me', 'wont let me', 'checks my', 'jealous', 'who i talk to', 'where i go'],
    flagged: true,
    text: "Telling you who you can talk to or where you can go is controlling, not caring. Trust what you're noticing, sweetheart. You don't owe anyone an explanation for protecting your peace, and the Report button is there if you need it.",
  },
  {
    id: 'crisis',
    context: 'any',
    keywords: ['hurt myself', 'kill myself', 'suicide', 'abuse', 'hit me', 'hits me', 'end it all'],
    flagged: true,
    text: "I'm so glad you told me. I'm not the right help for this, sweetheart, but real help is close. If you are in danger, call or text 988 (US) or your local emergency number right now. Please also reach out to your pastor or someone you trust tonight. You matter, and you are not alone.",
  },

  /* Profile coaching (always free). */
  {
    id: 'profile_review',
    context: 'profile',
    keywords: [],
    text: 'Of course, baby. Your voice intro is lovely. Leave it be. One answer could use a little more of you.',
  },
  {
    id: 'profile_followup',
    context: 'profile',
    keywords: ['why', 'more', 'what do you mean', 'deeper'],
    text: "Here's the thing. People don't fall for schedules, they fall for the person inside them. When you say brunch with your sisters, I want to know what you three laugh about and who always picks the place. That's the part someone will want to be invited into.",
  },

  /* Conversation help. */
  {
    id: 'shared_chat',
    context: 'shared_chat',
    keywords: [],
    text: "Thank you for sharing that with me. I see two people being honest, which is more than most folks manage in a week. Here's what I'd lean into: ask about the verse that got him through something hard, and tell him about the half marathon. Not the time, the why. I won't write it for you, but you already know how to say it.",
  },
  {
    id: 'what_to_ask',
    context: 'any',
    keywords: ['what should i ask', 'questions to ask', 'what do i say', 'how do i start', 'conversation'],
    text: "Ask what a good Sunday looks like for them, start to finish. You'll learn about their faith, their family, and their habits in one answer. Then ask what they're praying about this season. If they can't answer that one, you've learned something too.",
  },

  /* Date prep. */
  {
    id: 'date_plan_context',
    context: 'date_plan',
    keywords: [],
    text: "Coffee is a fine first date, sweetheart. Daytime, public, and easy to leave if it isn't right. Pick a place you already know so you're comfortable, and let somebody you trust know where you'll be. Bring one real question and let the rest happen.",
  },
  {
    id: 'first_date_ideas',
    context: 'any',
    keywords: ['first date', 'date idea', 'where should we go', 'what should we do'],
    text: "Keep the first one simple: coffee, a walk somewhere pretty, or a church event where you can see how they treat people. Save dinner for date two. And baby, go in the daytime, meet there, and tell a friend where you are. Wisdom isn't the opposite of romance.",
  },
  {
    id: 'what_to_expect',
    context: 'any',
    keywords: ['nervous', 'expect', 'what if', 'scared', 'anxious'],
    text: "Nerves mean you care, and that's a good sign about you. Expect a little awkwardness in the first ten minutes and let it be. Pray on the way there, not for it to go perfectly, but for you to be honest and kind. That's all you're responsible for.",
  },

  /* Dating advice. */
  {
    id: 'red_flag',
    context: 'any',
    keywords: ['red flag', 'is this normal', 'is this okay', 'warning sign'],
    text: "Tell me what happened and I'll be straight with you. The big ones: rushing intimacy or commitment, asking for money, pushing to leave the app, saying unkind things about every ex, and getting angry when you set a boundary. One of those is a conversation. Two is a pattern.",
  },
  {
    id: 'serious',
    context: 'any',
    keywords: ['serious', 'wasting my time', 'does he like me', 'does she like me', 'interested'],
    text: "A serious person makes plans and keeps them, asks about your life and remembers the answers, and brings you around the people they love. Words are easy, sweetheart. Watch the calendar and the follow-through.",
  },
  {
    id: 'after_divorce',
    context: 'any',
    keywords: ['divorce', 'divorced', 'ex-husband', 'ex-wife', 'single parent', 'single mom', 'single dad'],
    text: "Dating after divorce takes courage, and you've got it or you wouldn't be here. Take it slow. Let them earn the story of what happened, don't lead with it. And if you have children, they meet someone only when you're sure, not when you're hopeful. God is not finished writing your story, baby.",
  },
  {
    id: 'boundaries',
    context: 'any',
    keywords: ['boundaries', 'physical', 'purity', 'waiting', 'too fast'],
    text: "Decide your boundaries before you're in the moment, and say them out loud early. A person who honors your boundaries is showing you how they'll honor your marriage. A person who argues with them is showing you something too.",
  },
  {
    id: 'waiting',
    context: 'any',
    keywords: ['lonely', 'tired of waiting', 'still single', 'give up', 'why hasn\'t god'],
    text: "I hear you, and I won't give you a bumper sticker. Waiting is hard and lonely sometimes. But you are not behind, and you are not forgotten. Keep building a life you'd be glad to invite someone into. Psalm 27:14, sweetheart. Wait for the Lord, and be strong.",
  },

  /* Reflection. */
  {
    id: 'checkin_context',
    context: 'checkin',
    keywords: [],
    text: "Tell me how it went, honestly. Not how you think it should have gone. What surprised you? What did you notice about how they treated the server, or how you felt on the drive home? Those little things are usually the truth.",
  },
  {
    id: 'not_a_fit',
    context: 'any',
    keywords: ['not a fit', 'didn\'t work', 'did not work', 'closed', 'ended it', 'rejected', 'ghosted'],
    text: "That stings, and I'm sorry. But baby, a no is information, not a verdict on you. You showed up, you were honest, and you were kind. Rest a day or two, then keep going. The right one needs you to still be here.",
  },
  {
    id: 'great_date',
    context: 'any',
    keywords: ['went great', 'went well', 'amazing', 'second date', 'i like him', 'i like her'],
    text: "Well, look at you. I'm smiling over here. Enjoy it, and keep your eyes open at the same time. Let the next date tell you something new about them. And say thank you to God for a good evening. Those are gifts.",
  },

  /* Fallback. */
  {
    id: 'fallback',
    context: 'any',
    keywords: [],
    text: "Tell me a little more, sweetheart. What's actually sitting on your heart about this? I've got time and I've got coffee.",
  },
];

export const profileReviewCard = {
  prompt_answer_id: 'pa_me_0',
  prompt_short_label: 'My perfect day',
  answer_excerpt: 'Early service, brunch with my sisters, then a walk before choir.',
  level: 'go_deeper' as const,
  followup:
    'That tells me what you do, not who you are. What makes brunch with your sisters so special? Tell them that part.',
};

export const closeKindlyTemplates: string[] = [
  "Thank you for the conversation. I don't think we're a match, but I'm praying God brings you the right person.",
  "I've enjoyed getting to know you, but I don't feel this is the right fit for me. Wishing you every blessing.",
  "I want to be honest rather than disappear: I don't see this going further. Thank you for your kindness.",
  "I've decided to focus on another connection. I'm grateful for our chat and I wish you well.",
];
