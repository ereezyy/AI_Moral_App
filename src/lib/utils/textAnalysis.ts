export class TextAnalyzer {
  static countKeywords(text: string, keywords: string[]): number {
    const normalizedText = text.toLowerCase();
    return keywords.filter(keyword => 
      normalizedText.includes(keyword.toLowerCase())
    ).length;
  }

  static extractEmotionalWords(text: string): string[] {
    const emotionalVocabulary = [
      'feel', 'emotion', 'happy', 'sad', 'angry', 'excited', 'worried', 'confident',
      'frustrated', 'peaceful', 'anxious', 'grateful', 'overwhelmed', 'hopeful'
    ];
    return emotionalVocabulary.filter(word => 
      text.toLowerCase().includes(word)
    );
  }

  static extractValueWords(text: string): string[] {
    const valueWords = [
      'honesty', 'integrity', 'freedom', 'security', 'growth', 
      'family', 'success', 'justice', 'compassion', 'trust'
    ];
    return valueWords.filter(word => 
      text.toLowerCase().includes(word)
    );
  }

  static calculateWordComplexity(text: string): number {
    const words = text.split(' ').filter(word => word.length > 0);
    const complexWords = words.filter(word => word.length > 6);
    return words.length > 0 ? complexWords.length / words.length : 0;
  }

  static calculateSentiment(text: string): number {
    const positiveWords = ['good', 'great', 'happy', 'love', 'wonderful', 'amazing'];
    const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'horrible', 'worst'];
    
    const positiveCount = this.countKeywords(text, positiveWords);
    const negativeCount = this.countKeywords(text, negativeWords);
    
    return Math.max(0, Math.min(1, 0.5 + (positiveCount - negativeCount) * 0.1));
  }

  static extractCertaintyLevel(text: string): number {
    const highCertainty = ['definitely', 'absolutely', 'certainly', 'sure'];
    const lowCertainty = ['maybe', 'perhaps', 'possibly', 'might', 'unsure'];
    
    const highCount = this.countKeywords(text, highCertainty);
    const lowCount = this.countKeywords(text, lowCertainty);
    
    return Math.max(0, Math.min(1, 0.5 + (highCount - lowCount) * 0.2));
  }
}