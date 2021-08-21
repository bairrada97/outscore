<template>
	<nav class="calendarBar">
		<button class="calendarBar__liveToggleButton" :class="{ active: liveToggle }" @click="toggleLive">
			<svg class="calendarBar__liveToggleIcon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path fill-rule="evenodd" clip-rule="evenodd" d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM11 7H12.5V12.25L17 14.92L16.25 16.15L11 13V7Z" fill="currentColor" />
			</svg>
			<span>Live</span>
		</button>
		<CalendarDays />
		<button class="calendarBar__calendarButton" @click="openCalendar">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path fill-rule="evenodd" clip-rule="evenodd" d="M20 3H19V1H17V3H7V1H5V3H4C2.9 3 2 3.9 2 5V21C2 22.1 2.9 23 4 23H20C21.1 23 22 22.1 22 21V5C22 3.9 21.1 3 20 3ZM20 21H4V10H20V21ZM4 8H20V5H4V8Z" fill="#212121" />
			</svg>
		</button>
	</nav>
</template>

<script>
	import { defineComponent, reactive, toRefs, ref, onMounted, useFetch, onActivated, onUnmounted, computed, watch } from "@nuxtjs/composition-api";
	import store from "@/store.js";
	import axios from "axios";

	export default {
		components: {
			CalendarDays: () => import("@/components/CalendarDays/CalendarDays.vue" /* webpackChunkName: "CalendarDays" */)
		},
		setup() {
			const liveToggle = computed(() => store.getLiveToggle());
			const toggleLive = () => store.setLiveToggle(liveToggle.value);
			const openCalendar = () => store.setCalendarOpen(true);
			return {
				toggleLive,
				liveToggle,
				openCalendar
			};
		}
	};
</script>

<style lang="scss" scoped>
	.calendarBar {
		display: grid;
		grid-template-columns: auto 1fr auto;
		background: #f1f1f1;
		position: sticky;
		top: 0;
		left: 0;
		z-index: 2;

		&__liveToggleButton {
			display: flex;
			flex-direction: column;
			align-items: center;
			background: var(--color-primary);
			color: #fff;
			justify-content: center;
			width: 54px;
			padding: 4px 0;
			border-bottom: 1px solid var(--color-primary);

			&:focus {
				outline: 0;
			}

			span {
				font-size: 12px;
			}

			&.active {
				background: none;
				color: var(--color-primary);
			}
		}

		&__liveToggleIcon {
			color: #fff;

			.active & {
				color: var(--color-primary);
			}
		}

		&__calendarButton {
			background: var(--color-bg--dark);
			width: 54px;
		}
	}
</style>
