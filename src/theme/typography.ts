

export const FontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const FontSize = {
  display: 32,
  heading: 24,
  title: 18,
  body: 16,
  bodySmall: 15,
  caption: 13,
  label: 14,
  tiny: 11,
} as const;

export const LineHeight = {
  display: 40,
  heading: 32,
  title: 26,
  body: 24,
  bodySmall: 22,
  caption: 18,
  label: 20,
} as const;

export const Typography = {
  display: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.display,
    lineHeight: LineHeight.display,
  },
  heading: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.heading,
    lineHeight: LineHeight.heading,
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.title,
    lineHeight: LineHeight.title,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  bodyMedium: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
  },
  bodySmall: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.bodySmall,
    lineHeight: LineHeight.bodySmall,
  },
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
  },
  labelSmall: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
  },
} as const;

export type TypographyVariant = keyof typeof Typography;
