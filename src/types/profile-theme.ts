export type ThemeGradient = 'none' | 'sunset' | 'ocean' | 'forest' | 'candy';
export type ThemePattern = 'none' | 'dots' | 'lines' | 'grid' | 'waves';

export interface ProfileTheme {
  gradient: ThemeGradient;
  pattern: ThemePattern;
  backgroundImage?: string;
  showStats?: boolean;
  showBadges?: boolean;
}