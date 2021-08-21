<template>
	<div class="cardCountry" :class="{ isOpen: isOpen }">
		<div class="cardCountry__container">
			<nuxt-img v-if="country.image" class="cardCountry__logo" width="24" height="24" :src="country.image" :alt="name + ' logo'" />
			<h3 class="cardCountry__name">{{ name }}</h3>
			<span class="cardCountry__gamesNumber">
				<span v-if="country.totalLiveGames" :class="{ cardCountry__liveGamesNumber: hasLiveGames }">{{ country.totalLiveGames }}</span>
				<span v-if="country.totalLiveGames && !liveToggle">/</span>
				<span v-if="!liveToggle" class="cardCountry__totalGamesNumber">{{ country.totalGames }}</span>
			</span>
			<svg class="cardCountry__dropdown" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M7.41 8.29492L12 12.8749L16.59 8.29492L18 9.70492L12 15.7049L6 9.70492L7.41 8.29492Z" fill="currentcolor" />
			</svg>
		</div>

		<slot></slot>
	</div>
</template>

<script>
	import { watch, computed } from "@nuxtjs/composition-api";
	import useCalendar from "../../modules/useCalendar";
	import store from "@/store.js";

	export default {
		props: {
			name: {
				type: String
			},
			country: {
				type: Object
			},
			isOpen: {
				type: String
			}
		},
		setup(props) {
			const { country } = props;
			const liveToggle = computed(() => store.getLiveToggle());
			const hasLiveGames = country.totalLiveGames > 0;

			return {
				liveToggle,
				hasLiveGames
			};
		}
	};
</script>

<style lang="scss" scoped>
	.cardCountry {
		$this: &;

		&__container {
			display: grid;
			grid-template-columns: 40px 1fr auto auto;
			gap: 0 16px;
			padding: 8px 16px;
			align-items: center;
			border-bottom: 1px solid rgba(183, 183, 183, 0.3);
		}

		&.isOpen {
			border: 1px solid rgba(183, 183, 183, 0.3);

			#{$this}__container {
				background: var(--color-bg--black);
				position: sticky;
				top: 48px;
			}
			#{$this}__dropdown {
				color: #fff;
				transform: rotateX(180deg);
				box-sizing: content-box;
			}
		}

		&__logo {
			box-sizing: content-box;
		}

		&__name {
			font-size: 14px;
			font-weight: 400;
		}

		&__gamesNumber {
			font-size: 14px;
		}

		&__liveGamesNumber {
			color: #ffa800;
		}

		&__dropdown {
			grid-column: -1;
			transition: transform 0.3s ease;
			padding-left: 0;
			box-sizing: content-box;
		}
	}
</style>
