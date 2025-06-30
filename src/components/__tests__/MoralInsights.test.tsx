import { describe, it, expect } from 'vitest';
import { render, screen } from '../lib/utils/testing/test-utils';
import { MoralInsights } from '../MoralInsights';
import { mockMoralAnalysis } from '../lib/utils/testing/test-utils';

describe('MoralInsights', () => {
  it('renders ethical alignment score', () => {
    render(<MoralInsights analysis={mockMoralAnalysis} />);
    
    const score = screen.getByText('85%');
    expect(score).toBeInTheDocument();
  });

  it('displays conflicting values', () => {
    render(<MoralInsights analysis={mockMoralAnalysis} />);
    
    mockMoralAnalysis.conflictingValues.forEach(value => {
      const conflict = screen.getByText(value.split('_').join(' '));
      expect(conflict).toBeInTheDocument();
    });
  });

  it('shows recommended actions', () => {
    render(<MoralInsights analysis={mockMoralAnalysis} />);
    
    mockMoralAnalysis.recommendedActions.forEach(action => {
      const recommendation = screen.getByText(action.split('_').join(' '));
      expect(recommendation).toBeInTheDocument();
    });
  });
});