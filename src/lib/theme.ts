// Theme colors and styles

export const lightTheme = {
  background: '#fcfaf2',
  cardBackground: '#ffffff',
  textPrimary: '#1a1a1a',
  textSecondary: '#666666',
  textTertiary: '#999999',
  border: '#e8e4dc',
  borderLight: '#d4d4d4',
  inputBackground: '#ffffff',
  hoverBackground: '#f5f3ef',

  // Button colors
  yesButton: '#3d6b4f',
  yesButtonHover: '#345842',
  noButton: '#c25e3e',
  noButtonHover: '#a84d32',

  // Category colors
  categoryAll: '#3d6b4f',
  categoryPolitics: '#dc2626',
  categoryCrypto: '#2563eb',
  categorySports: '#059669',
  categoryBusiness: '#7c3aed',
  categoryOther: '#6b7280',
};

export const darkTheme = {
  background: '#0f0f0f',
  cardBackground: '#1a1a1a',
  textPrimary: '#f5f5f5',
  textSecondary: '#a0a0a0',
  textTertiary: '#707070',
  border: '#2a2a2a',
  borderLight: '#3a3a3a',
  inputBackground: '#1a1a1a',
  hoverBackground: '#252525',

  // Button colors
  yesButton: '#4d7b5f',
  yesButtonHover: '#3d6b4f',
  noButton: '#d26e4e',
  noButtonHover: '#b85e3e',

  // Category colors
  categoryAll: '#4d7b5f',
  categoryPolitics: '#f53636',
  categoryCrypto: '#3573eb',
  categorySports: '#159e79',
  categoryBusiness: '#8d4efd',
  categoryOther: '#7b8290',
};

export type SortOption = "volume" | "probability" | "newest";

export const sortOptions: { value: SortOption; label: string; description: string }[] = [
  { value: "volume", label: "Volume", description: "Sort by trading volume" },
  { value: "probability", label: "Probability", description: "Sort by probability" },
  { value: "newest", label: "Newest", description: "Sort by newest" },
];
