import { defineComponent, reactive, toRefs, ref, onMounted, useFetch, onActivated, onUnmounted, computed } from "@nuxtjs/composition-api";
import store from "@/store.js";
import axios from "axios";

export default function () {
	const games = ref(null);
	const state = reactive({
		today: new Date()
	});
	state.currentMonth = state.today.getMonth();
	state.currentYear = state.today.getFullYear();

	store.setFormatDate(state.currentYear, state.currentMonth, state.today.getDate());
	const selectedDate = computed(() => store.getSelectedDate());
	const timezone = computed(() => store.getTimezone());
	const loadGames = async () => {
		try {
			await axios
				.get(`https://api-football-v3.herokuapp.com/api/v3/fixtures?date=${selectedDate.value}&timezone=${timezone.value}`)
				.then(response => {
					store.setLiveToggle(true);
					games.value = store.getGames();
					const hasDataUpdated = !games.value.cacheDate || response.data.cacheDate != games.value.cacheDate;
					if (hasDataUpdated) store.setGames(response.data);
				})
				.then(() => {
					games.value = store.getGames();
				});
		} catch (error) {}
	};

	return {
		games,
		loadGames
	};
}
