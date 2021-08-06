<template>
	<div class="cardBetsHelper" :class="{ isOpen: isOpen }">
		<div class="cardBetsHelper__container">
			<h3 class="cardBetsHelper__name">{{ name }}</h3>
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
			name: {
				type: String
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
	.cardBetsHelper {
		$this: &;
		grid-column: 1/-1;

		&__container {
			display: grid;
			grid-template-columns: 1fr auto auto;
			gap: 0 16px;
			padding: 8px 16px;
			box-shadow: inset 0px -1px 0px rgba(183, 183, 183, 0.3);
			text-transform: uppercase;
			align-items: center;
		}

		&.isOpen {
			border: 1px solid rgba(183, 183, 183, 0.3);
			#{$this}__container {
				background: var(--color-bg--black);
				color: #fff;
			}
			#{$this}__dropdown {
				color: #fff;
				transform: rotateX(180deg);
				box-sizing: content-box;
			}
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
