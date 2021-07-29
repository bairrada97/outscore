<template>
	<div class="cardTeamLineup" :class="{ isOpen: isOpen }">
		<div class="cardTeamLineup__container">
			<nuxt-img v-if="team.team.logo" class="cardTeamLineup__logo" width="24" height="24" :src="team.team.logo" :alt="team.team.name + ' logo'" />
			<h3 class="cardTeamLineup__name">{{ team.team.name }}</h3>
			<svg class="cardCountry__dropdown" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M7.41 8.29492L12 12.8749L16.59 8.29492L18 9.70492L12 15.7049L6 9.70492L7.41 8.29492Z" fill="currentcolor" />
			</svg>
		</div>

		<slot></slot>
	</div>
</template>

<script>
	import { watch, computed } from "@nuxtjs/composition-api";
	import store from "@/store.js";

	export default {
		props: {
			team: {
				type: Object
			},
			isOpen: {
				type: String
			}
		},
		setup(props) {
			return {};
		}
	};
</script>

<style lang="scss" scoped>
	.cardTeamLineup {
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
			#{$this}__container {
				background: var(--color-bg--black);
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
			font-size: 16px;
			font-weight: 600;
		}

		&__dropdown {
			grid-column: -1;
			transition: transform 0.3s ease;
			padding-left: 0;
			box-sizing: content-box;
		}
	}
</style>
