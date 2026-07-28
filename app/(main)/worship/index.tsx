import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image, ImageSourcePropType } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing, Radius } from '@/src/theme';
import { useTheme } from '@/src/context/ThemeContext';
import AppText from '@/src/components/common/AppText';


interface WorshipMenuItem {
  id: string;
  icon: ImageSourcePropType;
  title: string;
  subtitle: string;
  route: string;
  gradientColors: [string, string];
}

export default function WorshipScreen() {
  const router = useRouter();
  const { C } = useTheme();

  const MENU_ITEMS: WorshipMenuItem[] = [
    {
      id: 'dua',
      icon: require('@/assets/images/doa.png'),
      title: 'Doa',
      subtitle: 'Doa-doa shahih harian',
      route: '/(main)/worship/dua',
      gradientColors: [C.primary, C.secondary],
    },
    {
      id: 'dhikr',
      icon: require('@/assets/images/Dzikir_icon.png'),
      title: 'Dzikir',
      subtitle: 'Pagi, petang & setelah sholat',
      route: '/(main)/worship/dhikr',
      gradientColors: [C.secondary, C.primaryMedium],
    },
    {
      id: 'tasbih',
      icon: require('@/assets/images/counter.png'),
      title: 'Tasbih Counter',
      subtitle: 'Hitung dzikir secara digital',
      route: '/(main)/worship/tasbih',
      gradientColors: [C.accent, C.primary],
    },
  ];

  const styles = makeStyles(C);

  return (
    <View style={styles.root}>
      {/* Soft background blob */}
      <LinearGradient
        colors={[C.primaryLight, C.background, C.secondaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <AppText variant="caption" color={C.textSecondary} style={{ letterSpacing: 0.5, fontWeight: '600' }}>
            IBADAH
          </AppText>
          <AppText variant="heading" style={{ fontSize: 28, fontWeight: '800', marginTop: 4 }}>
            Pusat Ibadah
          </AppText>
          <AppText variant="body" color={C.textSecondary} style={{ marginTop: 4 }}>
            Perkuat ikatan dengan Allah
          </AppText>
        </View>

        {/* Menu Cards */}
        <View style={styles.menu}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(item.route as Parameters<typeof router.push>[0])}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={item.title}
            >
              <View style={[styles.card, { shadowColor: item.gradientColors[0] }]}>
                {/* Glass base */}
                <View style={[StyleSheet.absoluteFillObject, { backgroundColor: C.surface, borderRadius: Radius.clay }]} />
                {/* Subtle gradient tint */}
                <LinearGradient
                  colors={[item.gradientColors[0], item.gradientColors[1]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[StyleSheet.absoluteFillObject, { borderRadius: Radius.clay, opacity: 0.1 }]}
                />
                {/* White shimmer */}
                <LinearGradient
                  colors={['rgba(255,255,255,0.5)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={[StyleSheet.absoluteFillObject, { borderRadius: Radius.clay }]}
                />
                {/* Top highlight line */}
                <View style={[styles.cardHighlight, { backgroundColor: 'rgba(255,255,255,0.7)' }]} />

                <View style={styles.cardContent}>
                  {/* Icon bubble */}
                  <View style={[styles.iconBubble, { shadowColor: item.gradientColors[0] }]}>
                    <LinearGradient
                      colors={item.gradientColors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFillObject}
                    />
                    <Image
                      source={item.icon}
                      style={styles.iconImage}
                      resizeMode="contain"
                    />
                  </View>

                  <View style={styles.cardText}>
                    <AppText variant="title" style={{ fontSize: 17 }}>{item.title}</AppText>
                    <AppText variant="caption" color={C.textSecondary} style={{ marginTop: 2 }}>
                      {item.subtitle}
                    </AppText>
                  </View>

                  {/* Arrow */}
                  <View style={[styles.arrowBubble, { backgroundColor: item.gradientColors[0] + '18' }]}>
                    <AppText color={item.gradientColors[0]} style={{ fontSize: 16, fontWeight: '700' }}>›</AppText>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Motivational quote */}
        <View style={[styles.quoteBox, { backgroundColor: C.primaryLight + 'BB', borderColor: C.primary + '30' }]}>
          <AppText style={styles.quoteArabic} color={C.primary} align="center">
            وَاذْكُرُوا اللَّهَ كَثِيرًا
          </AppText>
          <AppText variant="caption" color={C.textSecondary} align="center" style={{ marginTop: 6, fontStyle: 'italic' }}>
            "Dan ingatlah Allah sebanyak-banyaknya." — QS. Al-Anfal: 45
          </AppText>
        </View>
      </ScrollView>
    </View>
  );
}

function makeStyles(C: ReturnType<typeof useTheme>['C']) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: C.background },
    scroll: { flex: 1 },
    content: {
      paddingHorizontal: Spacing.screen,
      paddingTop: 60,
      paddingBottom: Spacing.xxxl + 20,
      gap: Spacing.base,
    },
    header: {
      marginBottom: Spacing.sm,
      gap: 2,
    },
    menu: { gap: Spacing.md },
    card: {
      borderRadius: Radius.clay,
      overflow: 'hidden',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.16,
      shadowRadius: 16,
      elevation: 8,
      minHeight: 88,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.6)',
    },
    cardHighlight: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 2,
      borderTopLeftRadius: Radius.clay,
      borderTopRightRadius: Radius.clay,
      zIndex: 3,
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.base,
      gap: Spacing.md,
      zIndex: 2,
    },
    iconBubble: {
      width: 56,
      height: 56,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    
    iconImage: {
      width: 50,
      height: 50,
      zIndex: 2,
    },
    cardText: { flex: 1, gap: 2 },
    arrowBubble: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quoteBox: {
      marginTop: Spacing.sm,
      borderRadius: Radius.clay,
      padding: Spacing.xl,
      borderWidth: 1,
      gap: 4,
    },
    quoteArabic: {
      fontSize: 20,
      fontWeight: '700',
      lineHeight: 32,
    },
  });
}
