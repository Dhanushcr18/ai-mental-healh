import { AnalysisResult } from '../types';

// Keyword sentiment mappings
const POSITIVE_KEYWORDS = {
  joy: ['happy', 'joy', 'joyful', 'excited', 'thrilled', 'delighted', 'great', 'wonderful', 'amazing', 'fantastic', 'excellent', 'perfect', 'love', 'blessed', 'grateful', 'thankful'],
  confidence: ['confident', 'strong', 'powerful', 'capable', 'accomplished', 'proud', 'success', 'achieved', 'brave'],
  calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'comfortable', 'safe', 'content'],
  hope: ['hope', 'hopeful', 'optimistic', 'future', 'possibilities', 'potential', 'opportunity', 'better', 'improve'],
  love: ['love', 'care', 'appreciate', 'compassion', 'kindness', 'supportive', 'friend', 'family', 'connected']
};

const NEGATIVE_KEYWORDS = {
  sadness: ['sad', 'sadness', 'depressed', 'down', 'blue', 'miserable', 'unhappy', 'lonely', 'heartbroken'],
  anxiety: ['anxious', 'worried', 'nervous', 'stressed', 'panic', 'fear', 'afraid', 'scared', 'uncertain', 'doubt'],
  anger: ['angry', 'furious', 'rage', 'irritated', 'frustrated', 'annoyed', 'mad', 'hate', 'bitter'],
  exhaustion: ['tired', 'exhausted', 'drained', 'burnt out', 'overwhelmed', 'tired', 'fatigue'],
  shame: ['ashamed', 'embarrassed', 'guilty', 'worthless', 'failure', 'stupid', 'useless', 'shame']
};

const NEUTRAL_WORDS = ['the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of'];

export class LocalAnalysisService {
  static analyzeEntry(text: string): AnalysisResult {
    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/).filter(w => w.length > 0);
    
    // Calculate sentiment scores
    const { posScore, negScore, emotionalCategories } = this.calculateSentiment(lowerText);
    const sentimentBalance = posScore - negScore;
    
    // Calculate overall mood score (0-100)
    const moodScore = Math.max(0, Math.min(100, 50 + (sentimentBalance * 5)));
    
    // Determine mood label
    const mood = this.determineMood(moodScore, emotionalCategories);
    
    // Calculate clarity (based on sentence structure and coherence)
    const clarity = this.calculateClarity(text, words);
    
    // Calculate confidence (based on word count and specificity)
    const confidence = this.calculateConfidence(words, emotionalCategories);
    
    // Identify emotional patterns
    const emotionalPatterns = this.identifyPatterns(emotionalCategories, text);
    
    // Generate affirmation
    const affirmation = this.generateAffirmation(mood, moodScore);
    
    // Generate suggestions
    const suggestions = this.generateSuggestions(mood, moodScore, emotionalPatterns);
    
    return {
      mood,
      moodScore: Math.round(moodScore),
      clarity: Math.round(clarity),
      confidence: Math.round(confidence),
      emotionalPatterns,
      affirmation,
      suggestions
    };
  }

  private static calculateSentiment(text: string): { posScore: number; negScore: number; emotionalCategories: Record<string, number> } {
    let posScore = 0;
    let negScore = 0;
    const emotionalCategories: Record<string, number> = {};

    // Check positive keywords
    Object.entries(POSITIVE_KEYWORDS).forEach(([category, keywords]) => {
      const matches = keywords.filter(kw => text.includes(kw)).length;
      if (matches > 0) {
        posScore += matches;
        emotionalCategories[category] = matches;
      }
    });

    // Check negative keywords
    Object.entries(NEGATIVE_KEYWORDS).forEach(([category, keywords]) => {
      const matches = keywords.filter(kw => text.includes(kw)).length;
      if (matches > 0) {
        negScore += matches;
        emotionalCategories[category] = matches;
      }
    });

    return { posScore, negScore, emotionalCategories };
  }

  private static determineMood(moodScore: number, categories: Record<string, number>): string {
    // Find dominant emotion category
    const dominantCategory = Object.entries(categories).sort(([, a], [, b]) => b - a)[0];
    
    if (moodScore >= 75) {
      if (dominantCategory?.[0] === 'joy') return 'Joyful';
      if (dominantCategory?.[0] === 'love') return 'Loved';
      if (dominantCategory?.[0] === 'confidence') return 'Confident';
      if (dominantCategory?.[0] === 'hope') return 'Hopeful';
      return 'Happy';
    } else if (moodScore >= 60) {
      if (dominantCategory?.[0] === 'calm') return 'Peaceful';
      if (dominantCategory?.[0] === 'confidence') return 'Capable';
      return 'Content';
    } else if (moodScore >= 40) {
      if (dominantCategory?.[0] === 'anxiety') return 'Anxious';
      if (dominantCategory?.[0] === 'sadness') return 'Contemplative';
      return 'Neutral';
    } else if (moodScore >= 25) {
      if (dominantCategory?.[0] === 'anxiety') return 'Stressed';
      if (dominantCategory?.[0] === 'exhaustion') return 'Tired';
      if (dominantCategory?.[0] === 'anger') return 'Frustrated';
      return 'Sad';
    } else {
      if (dominantCategory?.[0] === 'anxiety') return 'Overwhelmed';
      if (dominantCategory?.[0] === 'exhaustion') return 'Exhausted';
      if (dominantCategory?.[0] === 'shame') return 'Hopeless';
      return 'Very Sad';
    }
  }

  private static calculateClarity(text: string, words: string[]): number {
    let clarity = 50; // baseline

    // Check for clear sentence structure
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);

    // Ideal sentence length is 15-20 words
    if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 25) {
      clarity += 20;
    } else if (avgWordsPerSentence >= 5 && avgWordsPerSentence <= 30) {
      clarity += 10;
    }

    // Penalize very short or very long sentences
    if (avgWordsPerSentence < 5 || avgWordsPerSentence > 40) {
      clarity -= 10;
    }

    // Bonus for good text length
    if (words.length >= 30 && words.length <= 500) {
      clarity += 10;
    } else if (words.length > 500) {
      clarity += 5;
    }

    // Check for specific details (more specific words boost clarity)
    const specificWordPatterns = [/\d+/, /specific|detail|example|like|such as/gi];
    const hasSpecifics = specificWordPatterns.filter(pattern => pattern.test(text)).length;
    clarity += hasSpecifics * 5;

    return Math.min(100, clarity);
  }

  private static calculateConfidence(words: string[], emotionalCategories: Record<string, number>): number {
    let confidence = 40; // baseline

    // More words = higher confidence in the expression
    if (words.length >= 50) confidence += 30;
    else if (words.length >= 25) confidence += 20;
    else if (words.length >= 10) confidence += 10;

    // More emotional variety = higher confidence in self-awareness
    const uniqueCategories = Object.keys(emotionalCategories).length;
    confidence += uniqueCategories * 5;

    // Presence of specific emotional markers
    if (emotionalCategories['confidence'] || emotionalCategories['hope']) {
      confidence += 15;
    }

    return Math.min(100, confidence);
  }

  private static identifyPatterns(categories: Record<string, number>, text: string): string {
    const sortedCategories = Object.entries(categories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2);

    if (sortedCategories.length === 0) {
      return 'Balanced emotional state with neutral perspective';
    }

    const primaryPattern = sortedCategories[0][0];
    const secondaryPattern = sortedCategories[1]?.[0];

    const patterns: Record<string, string> = {
      joy: 'Experiencing joy and positive energy',
      sadness: 'Navigating feelings of sadness or melancholy',
      anxiety: 'Managing worry and anxious thoughts',
      anger: 'Processing frustration and irritation',
      exhaustion: 'Dealing with fatigue and burnout',
      confidence: 'Building personal strength and capability',
      calm: 'Cultivating peace and tranquility',
      hope: 'Embracing optimism and positive outlook',
      love: 'Expressing care and connection',
      shame: 'Confronting feelings of self-doubt'
    };

    let pattern = patterns[primaryPattern] || 'Complex emotional experience';

    if (secondaryPattern && secondaryPattern !== primaryPattern) {
      const secondaryDesc = patterns[secondaryPattern]?.split(' and ')[0].toLowerCase() || '';
      pattern += ` alongside ${secondaryDesc}`;
    }

    return pattern;
  }

  private static generateAffirmation(mood: string, moodScore: number): string {
    const affirmations = {
      high: [
        'You are capable of amazing things. Keep this momentum going!',
        'Your positive energy is inspiring. Trust in your strength.',
        'You deserve to feel this good. Embrace this beautiful moment.',
        'Your growth and resilience shine through. You are worthy of joy.',
        'This feeling of strength within you is real. Celebrate it!'
      ],
      medium: [
        'You are doing better than you think. One step at a time.',
        'Your awareness of your emotions is a sign of strength.',
        'Every moment is a chance to grow. You\'ve got this.',
        'You are worthy of peace and contentment.',
        'Your efforts matter, even on difficult days.'
      ],
      low: [
        'This difficult moment is temporary. You will get through it.',
        'Your feelings are valid. Be gentle with yourself.',
        'Reach out to someone you trust. You don\'t have to do this alone.',
        'Small steps forward still move you closer to better days.',
        'You are stronger than you believe. This will pass.'
      ]
    };

    let category = 'medium';
    if (moodScore >= 65) category = 'high';
    else if (moodScore <= 35) category = 'low';

    const categoryAffirmations = affirmations[category as keyof typeof affirmations];
    return categoryAffirmations[Math.floor(Math.random() * categoryAffirmations.length)];
  }

  private static generateSuggestions(mood: string, moodScore: number, patterns: string): string[] {
    const suggestions: string[] = [];

    // General suggestions based on mood score
    if (moodScore >= 70) {
      suggestions.push('Capture this positive energy by setting a meaningful goal for tomorrow');
      suggestions.push('Share your good mood with someone who needs it');
    } else if (moodScore >= 50) {
      suggestions.push('Try a mindfulness exercise to maintain your balance');
      suggestions.push('Take a short walk outside to refresh your mind');
    } else if (moodScore >= 30) {
      suggestions.push('Practice self-compassion. You\'re doing your best.');
      suggestions.push('Consider reaching out to a friend or loved one');
    } else {
      suggestions.push('Please consider talking to a mental health professional');
      suggestions.push('Use coping strategies that have helped you before');
    }

    // Pattern-specific suggestions
    if (patterns.includes('anxiety')) {
      suggestions.push('Try deep breathing: inhale for 4 counts, hold for 4, exhale for 4');
      suggestions.push('Write down your worries and rank them by controllability');
    }
    if (patterns.includes('sadness')) {
      suggestions.push('Engage in a small activity you enjoy');
      suggestions.push('Connect with someone who cares about you');
    }
    if (patterns.includes('joy')) {
      suggestions.push('Document what made you happy today');
      suggestions.push('Plan to recreate these positive experiences');
    }
    if (patterns.includes('exhaustion')) {
      suggestions.push('Prioritize rest and recovery');
      suggestions.push('Break your day into smaller, manageable chunks');
    }

    // Return top 4 suggestions
    return suggestions.slice(0, 4);
  }
}
