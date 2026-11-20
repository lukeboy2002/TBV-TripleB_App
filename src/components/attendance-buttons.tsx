/** Drie knoppen om je aan te melden voor een event: Ik kom / Misschien / Niet. */
import { Pressable, StyleSheet } from 'react-native';

import { Muted, Row } from '@/components/ui';
import { useTheme } from '@/constants/theme';
import { useSetAttendance } from '@/lib/queries';
import type { AttendanceStatus } from '@/lib/types';

const OPTIONS: { status: AttendanceStatus; label: string }[] = [
  { status: 'attending', label: '✅ Ik kom' },
  { status: 'maybe', label: '🤔 Misschien' },
  { status: 'not_attending', label: '❌ Niet' },
];

export function AttendanceButtons({ slug, current }: { slug: string; current: AttendanceStatus | null }) {
  const theme = useTheme();
  const setAttendance = useSetAttendance(slug);
  // Laat de nieuwe keuze meteen zien, nog voordat de server antwoordt.
  const shown = setAttendance.isPending ? setAttendance.variables : current;

  return (
    <Row>
      {OPTIONS.map((option) => {
        const active = shown === option.status;
        return (
          <Pressable
            key={option.status}
            onPress={() => setAttendance.mutate(option.status)}
            style={[
              styles.button,
              { backgroundColor: active ? theme.primary : theme.background, borderColor: theme.border },
            ]}>
            <Muted style={{ color: active ? theme.primaryText : theme.text, textAlign: 'center' }}>
              {option.label}
            </Muted>
          </Pressable>
        );
      })}
    </Row>
  );
}

const styles = StyleSheet.create({
  button: { flex: 1, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
});
