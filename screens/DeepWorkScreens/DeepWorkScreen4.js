import { useRoute } from '@react-navigation/native';

export default function DeepWorkScreen4() {
    const route = useRoute();
    const goalTitle = route.params?.goalTitle || 'No goal selected';
    const focusedTime = route.params?.focusedTime || '--:--';
    const completedSubgoals = route.params?.completedSubgoals ?? 0;
    const totalSubgoals = route.params?.totalSubgoals ?? 0;
    const sessionCount = route.params?.sessionCount ?? 0;

    // Render these values in the appropriate places in your UI, e.g.:
    // <Text>{goalTitle}</Text>
    // <Text>{focusedTime}</Text>
    // <Text>{`${completedSubgoals}/${totalSubgoals}`}</Text>
    // <Text>{sessionCount}</Text>
} 